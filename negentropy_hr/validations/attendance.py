# -*- coding: utf-8 -*-
# Copyright (c) 2019, Kaynes Technology India Pvt Ltd and contributors
# For license information, please see license.txtimport frappe

import frappe


def on_submit(doc, method):
	pass
	# if doc.status == 'Absent':
	# 	employee = frappe.get_doc('Employee', doc.employee)
	# 	if employee.attendance:
	# 		leave_application = frappe.new_doc('Leave Application')
	# 		leave_application.leave_type = 'Leave Without Pay'
	# 		leave_application.employee = doc.employee
	# 		leave_application.from_date = doc.attendance_date
	# 		leave_application.to_date = doc.attendance_date
	# 		leave_application.leave_approver = 'Administrator'
	# 		leave_application.status = 'Approved'
	# 		leave_application.company = doc.company
	# 		leave_application.description = 'Auto LWP for Absent'
	# 		leave_application.insert()
	# 		leave_application.submit()