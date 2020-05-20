# -*- coding: utf-8 -*-
# Copyright (c) 2019, Kaynes Technology India Pvt Ltd and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import date_diff, cstr, getdate
from frappe import _
from itertools import tee, zip_longest
from datetime import datetime, timedelta

one_day = timedelta(days=1)
five_days = timedelta(days=5)


def pairwise(iterable):
    a, b = tee(iterable)
    next(b, None)
    return zip_longest(a, b, fillvalue=None)


def collapse_ranges(sorted_iterable, inc):

    pairs = pairwise(sorted_iterable)
    for start, tmp in pairs:
        if inc(start) == tmp:
            for end, tmp in pairs:
                if inc(end) != tmp:
                    break
            yield start, end
        else:
            yield start

def check_nearby_dates(seed_date, direction, holidays, absent_list):
    if direction == 'forward':
        seed_date += one_day
        if seed_date in holidays:
            return check_nearby_dates(seed_date, "forward", holidays, absent_list)
        elif seed_date in absent_list:
            return seed_date
        else:
            return None

    if direction == 'backward':
        seed_date -= one_day
        if seed_date in holidays:
            return check_nearby_dates(seed_date, "backward", holidays, absent_list)
        elif seed_date in absent_list:
            return seed_date + one_day
        else:
            return None


def before_submit(doc, method):
    if not doc.skip_attendance_validations:
        if not doc.lwp_marked:
            frappe.throw("Please mark lwp for employees.")
        # check attendance for the employees.
        employees_to_mark_attendance = verify_employee_attendance(doc)
        if employees_to_mark_attendance:
            frappe.throw(_("Cannot Submit, Employees left to mark attendance"))


@frappe.whitelist()
def verify_employee_attendance(payroll_entry):
    if type(payroll_entry) == str:
        payroll_entry = frappe.get_doc("Payroll Entry", payroll_entry)
    else:
        payroll_entry = frappe.get_doc("Payroll Entry", payroll_entry.name)
    employees_to_mark_attendance = []
    days_in_payroll, days_holiday, days_attendance_marked = 0, 0, 0

    employees_joining_date = dict(
        frappe.db.sql(
            """
			SELECT 
				name, date_of_joining 
			FROM `tabEmployee` 
			WHERE attendance=1 
			AND company=%s
			""",
            (payroll_entry.company)))
    employee_att_check = employees_joining_date.keys()

    employee_att_check = [
        x for x in payroll_entry.employees if x.employee in employee_att_check
    ]
    holidays = get_holidays_between(payroll_entry.start_date,
                                    payroll_entry.end_date,
                                    payroll_entry.company)

    for employee_detail in employee_att_check:
        new_emp_absent_days = 0
        new_emp_excluded_holidays = len([
            x for x in holidays
            if x < employees_joining_date[employee_detail.employee]
        ])
        days_holiday = payroll_entry.get_count_holidays_of_employee(
            employee_detail.employee)
        if not employees_joining_date[employee_detail.
                                      employee] <= payroll_entry.start_date:
            new_emp_absent_days = date_diff(
                employees_joining_date[employee_detail.employee],
                payroll_entry.start_date) - new_emp_excluded_holidays
        days_attendance_marked = payroll_entry.get_count_employee_attendance(
            employee_detail.employee)
        days_in_payroll = date_diff(payroll_entry.end_date,
                                    payroll_entry.start_date) + 1
        if days_in_payroll > days_holiday + days_attendance_marked + new_emp_absent_days:
            employees_to_mark_attendance.append({
                "employee":
                    employee_detail.employee,
                    "employee_name":
                    employee_detail.employee_name
            })
    return employees_to_mark_attendance


@frappe.whitelist()
def mark_lwp(payroll_entry):
    payroll_entry = frappe.get_doc("Payroll Entry", payroll_entry)
    emp_lwp_dict = dict(
        frappe.db.sql(
            """
			SELECT 
				attendance.employee, 
				GROUP_CONCAT(attendance.attendance_date) 
			FROM `tabAttendance` attendance 
			INNER JOIN `tabEmployee` employee ON employee.name=attendance.employee 
			WHERE (
                (attendance.status='Absent') 
                OR 
                (attendance.status='On Leave' AND attendance.leave_type='Leave Without Pay')
                )
			AND attendance.company=%s 
			AND attendance.attendance_date>=%s 
			AND attendance.attendance_date<=%s 
			AND employee.attendance=1 
			GROUP BY attendance.employee 
			ORDER BY attendance.attendance_date 
			""",
            (payroll_entry.company, payroll_entry.start_date - five_days,
             payroll_entry.end_date + five_days)))
    holidays = get_holidays_between(payroll_entry.start_date - five_days,
                                    payroll_entry.end_date + five_days,
                                    payroll_entry.company)
    for employee in emp_lwp_dict:
        date_list = map(getdate, emp_lwp_dict[employee].split(','))
        date_list = [x for x in date_list]
        employee_att_check = frappe.db.get_value(
            'Employee', employee, fieldname='attendance')

        for each in collapse_ranges(
                sorted(set([x for x in date_list if x.month==payroll_entry.start_date.month])),
                lambda d: d + get_delta_days(d, holidays)):
            if employee_att_check:
                if type(each) == tuple:
                    from_date, to_date = each
                else:
                    from_date, to_date = each, each

                new_from_date = check_nearby_dates(from_date, 'backward', holidays, date_list)
                new_to_date = check_nearby_dates(to_date, 'forward', holidays, date_list)
                
                if new_from_date:
                    from_date = new_from_date
                if new_to_date:
                    to_date = new_to_date
                if from_date < payroll_entry.start_date:
                    from_date = payroll_entry.start_date
                if to_date > payroll_entry.end_date:
                    to_date = payroll_entry.end_date
                
                

                leave_application = frappe.new_doc('Leave Application')
                leave_application.leave_type = 'Leave Without Pay'
                leave_application.employee = employee
                leave_application.from_date = from_date
                leave_application.to_date = to_date
                leave_application.leave_approver = 'Administrator'
                leave_application.status = 'Approved'
                leave_application.company = payroll_entry.company
                leave_application.description = 'Auto LWP for Absent'
                leave_application.insert()
                leave_application.submit()


def get_delta_days(date, holidays, ctr=1):
    """ Get the number of days to add to collapse func"""
    date = date + one_day
    if date in holidays:
        ctr += 1
        return get_delta_days(date, holidays, ctr)

    return timedelta(days=ctr)


def get_holidays_between(start_date, end_date, company):
    """ Get the holidays between specified days for a given company"""
    holiday_list = frappe.get_cached_value('Company', company,
                                           "default_holiday_list")
    holidays = frappe.db.sql_list(
        '''
			select holiday_date from `tabHoliday` 
			where
			parent=%(holiday_list)s
			and holiday_date >= %(start_date)s
			and holiday_date <= %(end_date)s order by holiday_date''', {
            "holiday_list": holiday_list,
            "start_date": start_date,
            "end_date": end_date
        })
    return holidays


# def mark_leave_without_pay(employees, payroll_entry):
# 	if employees:
# 		payroll_entry = frappe.get_doc("Payroll Entry", payroll_entry.name)
# 		holiday_list = frappe.get_cached_value('Company',  payroll_entry.company,  "default_holiday_list")
# 		holidays = frappe.db.sql_list('''
# 				select holiday_date from `tabHoliday`
# 				where
# 				parent=%(holiday_list)s
# 				and holiday_date >= %(start_date)s
# 				and holiday_date <= %(end_date)s''', {
# 				"holiday_list": holiday_list,
# 				"start_date": payroll_entry.start_date,
# 				"end_date": payroll_entry.end_date
# 			})
# 		for employee in employees:
# 			joining_date = employee.get('date_of_joining', None)
# 			lwp_days = date_diff(joining_date, payroll_entry.start_date)
# 			lwp_date_list = [joining_date - datetime.timedelta(days=x) for x in range(1, lwp_days + 1)]
# 			lwp_date_list = [x for x in lwp_date_list if x not in holidays]
# 			for date in lwp_date_list:
# 				leave_application = frappe.new_doc('Leave Application')
# 				leave_application.leave_type = 'Leave Without Pay'
# 				leave_application.employee = employee.get('employee', None)
# 				leave_application.from_date = date
# 				leave_application.to_date = date
# 				leave_application.leave_approver = 'Administrator'
# 				leave_application.status = 'Approved'
# 				leave_application.company = payroll_entry.company
# 				leave_application.description = 'Auto LWP for mid moth entry.'
# 				leave_application.insert()
# 				leave_application.submit()
