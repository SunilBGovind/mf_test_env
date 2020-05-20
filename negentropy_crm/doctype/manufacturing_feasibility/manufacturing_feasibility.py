# -*- coding: utf-8 -*-
# Copyright (c) 2019, Sunil Govind and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
from frappe import utils


class ManufacturingFeasibility(Document):
	def validate(self):	
		child_tables = [self.mf_1, self.mf_2, self.mf_3, self.mf_4, self.mf_5, self.mf_6, self.mf_7, self.mf_8, self.mf_9, self.mf_10] 
		risk_status = frappe.get_all("Risk Analysis", fields=["name", "docstatus"], 
									filters={"opportunity_number": self.opportunity_number}, order_by="name")
		
		# condition based on workflow state
		if self.status == 'Stage 1 Completed':
			if risk_status:
				if risk_status[0]['docstatus'] == 0:
					frappe.throw("Draft - Risk Analysis " + risk_status[0]['name'] + " needs to be submit")
			else:
				frappe.throw("Complete Risk Analysis before completing Opportunity Stage")

		if self.status == 'Stage 2 Pending':
			sales_order_number = frappe.db.sql(""" 
				SELECT 
					name 
				FROM 
					`tabSales Order`
					WHERE name IN (SELECT parent FROM `tabSales Order Item`
					WHERE prevdoc_docname IN (SELECT name FROM `tabQuotation`
					WHERE name IN (SELECT parent FROM `tabQuotation Item`
					WHERE prevdoc_docname IN (SELECT name FROM `tabOpportunity`
					WHERE name IN (SELECT opportunity_number FROM `tabManufacturing Feasibility`
					WHERE name = %s
					)))))""", self.name, as_dict=1)
			if sales_order_number:
				self.stage = 'Order Handling Stage'
				self.order_handling_stage_date = utils.today()
				self.status = 'Stage 2 Pending'
			else:
				frappe.throw("Sales Order has to be created to enter Manufacturing Feasibility Stage 2")
		
		# setting up mandatory fields based on stage		
		if self.stage == 'Opportunity Stage' and self.status == 'Stage 1 Completed':
			for child_table in child_tables:
				for field in child_table:
					if field.stage1_response_remarks is None:
						frappe.throw("Opportunity Stage Remarks Mandatory fields required in table , Row {0}".format(field.idx))
		if self.stage == 'Order Handling Stage' and self.status == 'Stage 2 Completed':
			for child_table in child_tables:
				for field in child_table:
					if field.stage2_response_remarks is None:
						frappe.throw("Order Handling Stage Remarks Mandatory fields required in table , Row {0}".format(field.idx))

# Document Mapping from Opportunity module to Manufacturing Feasibility module
@frappe.whitelist()
def make_manufacturing_feasibility(source_name, target_doc=None):
	doclist = get_mapped_doc("Opportunity", source_name, {
		"Opportunity": {
			"doctype": "Manufacturing Feasibility",
			"field_map": {
				"opportunity_number": "name",
			}
		},
		
	}, target_doc)

	return doclist

# Using in Sales Order Module JS, Checking first stage status of Manufacturing feasibility
@frappe.whitelist()
def fetch_manufacturing_feasibility(sales_order_id):
	manufacturing_feasibility_number = frappe.db.sql(""" SELECT 
			name 
		FROM 
			`tabManufacturing Feasibility` 
		WHERE 
			opportunity_number 
		IN ( SELECT 
				opportunity 
		FROM 
			`tabQuotation` 
		WHERE name 	IN ( SELECT 
			prevdoc_docname # prevdoc_docname field is contain quotatation number reference in Sales Order screen
		FROM 
			`tabSales Order Item` 
		WHERE 
			parent =%s )
			)
		""", sales_order_id, as_dict=1)
						
	if manufacturing_feasibility_number:
		return manufacturing_feasibility_number[0]['name']
	else:
		frappe.throw("Manufacturing Feasibility Opportunity Stage is not completed")

# Using in Sales Order Module JS, To fetch Opportunity number from Quotation Child table
@frappe.whitelist()
def fetch_opportunity_number(sales_order_id):
	opportunity_number = frappe.db.sql("""SELECT 
			opportunity 
		FROM 
			`tabQuotation` 
		WHERE 
			name 
		IN (SELECT 
			prevdoc_docname 
		FROM 
			`tabSales Order Item` 
		WHERE parent =%s
			)""", 
		sales_order_id, as_dict=1)
	if opportunity_number:
		return opportunity_number[0]['opportunity']

# Using in Sales Order Module, To update Manufacturing stage status from Opportunity stage to Order handling Stage
@frappe.whitelist()
def update_manufacturing_feasibility(name):
	doc = frappe.get_doc('Manufacturing Feasibility', name)
	doc.stage = 'Order Handling Stage'
	doc.order_handling_stage_date = utils.today()
	doc.status = 'Stage 2 Pending'
	doc.save()

# End Of Program