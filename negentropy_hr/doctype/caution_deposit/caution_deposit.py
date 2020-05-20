# -*- coding: utf-8 -*-
# Copyright (c) 2020, Kaynes Technology India Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import add_months

class CautionDeposit(Document):
	def on_submit(self):
		if self.period:
			for p in range(self.period):
				additional_salary = frappe.get_doc({
					"doctype": "Additional Salary",
					"company": self.company,
					"employee": self.employee,
					"salary_component": self.salary_component,
					"payroll_date": add_months(self.start_date,p),
					"amount": self.amount/self.period,
					"overwrite_salary_structure_amount": 0,
					"caution_deposit": self.name
				}).insert(ignore_permissions=True)
				additional_salary.submit()