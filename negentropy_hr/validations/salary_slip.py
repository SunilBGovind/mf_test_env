# -*- coding: utf-8 -*-
# Copyright (c) 2019, Kaynes Technology India Pvt Ltd and contributors
# For license information, please see license.txt

import frappe
from erpnext.hr.doctype.salary_structure.salary_structure import make_salary_slip


def validate(doc, method):
    basic_component = [x for x in doc.earnings if x.abbr == 'B']
    default_basic_amount = 0
    if basic_component:
        basic_component = basic_component[0]
        default_basic_amount = basic_component.default_amount
    else:
        frappe.throw('Basic(B) component not found!')

    employee_settings = frappe.db.get_value('Employee', doc.employee, fieldname=[
                                            'attendance', 'overtime'], as_dict=True)
    attendance = employee_settings.get('attendance', 0)
    overtime = employee_settings.get('overtime', 0)
    if attendance and overtime:
        overtime_threshold = float(frappe.get_cached_value(
            'Company',  doc.company,  'overtime_threshold'))
        overtime_factor = float(frappe.get_cached_value(
            'Company',  doc.company,  'overtime_factor'))
        lunch_threshold = float(frappe.get_cached_value(
            'Company',  doc.company,  'lunch_threshold'))
        combined_overtime_threshold = overtime_threshold + lunch_threshold
        overtime_hours = frappe.db.sql(
            """
			SELECT 
				SUM(working_hours-%s) 
			FROM `tabAttendance` 
			WHERE status='Present' 
			AND employee=%s 
			AND attendance_date>=%s 
			AND attendance_date<=%s 
			AND working_hours>%s
			""",
            (combined_overtime_threshold, doc.employee, doc.start_date, doc.end_date, combined_overtime_threshold))
        overtime_hours = overtime_hours[0][0]
        if overtime_hours:

            hourly_pay_rate = default_basic_amount / (26 * 8)
            overtime_amount = overtime_hours * overtime_factor * hourly_pay_rate
            if overtime_amount > 0:
                add_earning_for_hourly_wages(
                    doc, doc._salary_structure_doc.overtime_component, overtime_amount)
                doc.calculate_net_pay()
                doc.overtime_pay_rate = hourly_pay_rate * overtime_factor
                doc.overtime_hours = overtime_hours
    # update_deductions(doc)


def add_earning_for_hourly_wages(doc, salary_component, amount):
    row_exists = False
    for row in doc.earnings:
        if row.salary_component == salary_component:
            row.amount = amount
            row_exists = True
            break

    if not row_exists:
        wages_row = {
            "salary_component": salary_component,
            "abbr": frappe.db.get_value("Salary Component", salary_component, "salary_component_abbr"),
            "amount": amount,
            "default_amount": 0.0,
            "additional_amount": 0.0,
            "is_tax_applicable": 1
        }
        doc.append('earnings', wages_row)

# def update_deductions(doc):
#     data = doc.get_data_for_eval()
#     for struct_row in doc._salary_structure_doc.get("deductions"):
#         amount = doc.eval_condition_and_formula(struct_row, data)
#         if (amount == 0 and struct_row in doc._salary_structure_doc.get("deductions")):
#             doc.update_component_row(struct_row, amount, "deductions")
    