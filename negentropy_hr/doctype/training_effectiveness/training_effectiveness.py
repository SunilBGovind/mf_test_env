# -*- coding: utf-8 -*-
# Copyright (c) 2020, Kaynes Technology India Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import today, add_days
from datetime import datetime
from frappe.utils import time_diff_in_seconds
from frappe import _

class TrainingEffectiveness(Document):
    def autoname(self):
        self.name = self.training_event



    def on_submit(self):
        if self.auto_assign:
            next_training_event = frappe.db.sql(""" select name from `tabTraining Event` where event_status='Scheduled' and docstatus='0' order by creation asc """,as_dict=1)
            actual_employee_list = frappe.get_list("Training Effectiveness Employee",filters={"parent":self.name,"further_support_required_from_hr_to_improve":"Yes"},fields=["employee","employee_name","department"])
            final_employee_list = []
            if next_training_event and actual_employee_list:
                next_training_event_doc = frappe.get_doc("Training Event",next_training_event[0].name)
                next_training_event_employees = frappe.get_list("Training Event Employee",filters={"parent":next_training_event[0].name},fields=["employee","employee_name","department"])
                for ae in actual_employee_list:
                    if ae not in next_training_event_employees:
                        final_employee_list.append(ae)
                if final_employee_list:
                    for emp in final_employee_list:
                        next_training_event_doc.append("employees",{
                            "employee": emp.employee,
                            "employee_name": emp.employee_name,
                            "department": emp.department,
                            "status": "Open",
                            "attendance": "Mandatory",
                            "from_training_effectiveness": self.name
                        })
                    next_training_event_doc.save(ignore_permissions=True)
                    update_training_effectiveness_employees(self,"1")

            
            
            



@frappe.whitelist()
def update_training_effectiveness_employees(self,status):
    training_effectiveness_employee = self.training_effectiveness_employee
    for emp in training_effectiveness_employee:
        if emp.further_support_required_from_hr_to_improve=="Yes":
            emp.training_event_allocated = status







@frappe.whitelist()
def get_open_count(name):
    out = []
    data = {'name': "Training Effectiveness"}
    total = len(frappe.get_all("Training Effectiveness", fields='name',
        filters={'docstatus':0,'training_event': name}, limit=100, distinct=True, ignore_ifnull=True))
    data['open_count'] = total

    total = len(frappe.get_all("Training Effectiveness", fields='name',
        filters={"training_event": name}, limit=100, distinct=True, ignore_ifnull=True))
    data['count'] = total
    out.append(data)

    out = {
        'count': out,
    }
    return out