from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import today, add_days
from datetime import datetime
from frappe.utils import time_diff_in_seconds
from frappe import _


@frappe.whitelist()
def populate_employee_from_training_effectiveness(training_program):
    training_effectiveness_list = frappe.db.sql(""" select distinct parent from `tabTraining Effectiveness Employee` where training_program='%s' and docstatus='1' and training_event_allocated='0' order by creation desc """%(training_program),as_dict=1)
    training_effect_employee = []
    for training_eff in training_effectiveness_list:
        if frappe.db.exists("Training Effectiveness",training_eff.parent):
            training_effect_doc = frappe.get_doc("Training Effectiveness",training_eff.parent)
            training_effect_employee.append(frappe.get_list("Training Effectiveness Employee",filters={"parent":training_effect_doc.name,"further_support_required_from_hr_to_improve":"Yes","training_event_allocated":"0"},fields=["employee","employee_name","department","training_event_allocated","parent"]))
    return training_effect_employee


@frappe.whitelist()
def update_training_effectiveness_on_validate(doc,method):
    if doc.get("__islocal"):
        training_effectiveness_list = frappe.db.sql(""" select distinct parent from `tabTraining Effectiveness Employee` where training_program='%s' and docstatus='1' and training_event_allocated='0' order by creation desc """%(doc.training_program),as_dict=1)
        for training_eff in training_effectiveness_list:
            if frappe.db.exists("Training Effectiveness",training_eff.parent):
                training_effect_doc = frappe.get_doc("Training Effectiveness",training_eff.parent)
                training_effect_employee = frappe.get_list("Training Effectiveness Employee",filters={"parent":training_effect_doc.name,"further_support_required_from_hr_to_improve":"Yes","training_event_allocated":"0"},fields=["employee","employee_name","department","training_event_allocated","parent"]) 
                training_effect_doc.update({
                })
                training_effectiveness_employee = training_effect_doc.training_effectiveness_employee
                for eff_emp in training_effectiveness_employee:
                    if eff_emp.further_support_required_from_hr_to_improve=="Yes":
                        eff_emp.training_event_allocated = "1"
                training_effect_doc.save(ignore_permissions=True)




@frappe.whitelist()
def update_training_effectiveness_on_trash(doc,method):
    if doc.employees:
        training_effectiveness = ""
        training_effectiveness_list = frappe.db.sql(""" select distinct from_training_effectiveness from `tabTraining Event Employee` where parent='%s' and from_training_effectiveness!='' """%doc.name,as_dict=1)
        if training_effectiveness_list:           
            for training_effectiveness in training_effectiveness_list:
                training_effect_doc = frappe.get_doc("Training Effectiveness",training_effectiveness.from_training_effectiveness)
                training_effect_doc.update({
                })
                training_effectiveness_employee = training_effect_doc.training_effectiveness_employee
                for eff_emp in training_effectiveness_employee:
                    if eff_emp.further_support_required_from_hr_to_improve=="Yes":
                        eff_emp.training_event_allocated = "0"
                training_effect_doc.save(ignore_permissions=True)




        
