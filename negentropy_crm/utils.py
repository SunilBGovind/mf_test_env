from __future__ import unicode_literals
from frappe.model.mapper import get_mapped_doc
import frappe

@frappe.whitelist()
def get_employee_list(doctype,txt,searchfield,start,page_len,filters):
	department = "";
	department = ','.join(map("'{0}'".format, filters))
	department = str('('+ department +')')

	elements = frappe.db.sql(""" SELECT 
			employee,employee_name,company
		FROM 
		`tabEmployee` 
		WHERE 
			department IN ( SELECT name FROM `tabDepartment` WHERE department_name IN {key}) 
			""".format(key=department)
			)
	return elements

#Pending Opportunity list for Manufacturing Feasibility
@frappe.whitelist()
def get_pending_mf_opportunity_list(doctype,txt,searchfield,start,page_len,filters):
	elements = frappe.db.sql(""" SELECT 
			name, customer_name
			FROM 
			`tabOpportunity` 
			WHERE 
				name not IN ( 
			SELECT 
				opportunity_number 
			FROM `tabManufacturing Feasibility`) 
			""")
	return elements
#Pending Opportunity list for Risk Analysis
@frappe.whitelist()
def get_pending_ra_opportunity_list(doctype,txt,searchfield,start,page_len,filters):
	elements = frappe.db.sql(""" SELECT 
			name, customer_name
			FROM 
			`tabOpportunity` 
			WHERE 
				name not IN ( 
			SELECT 
				opportunity_number 
			FROM `tabRisk Analysis`)
			AND
			 name IN (
			SELECT 
				opportunity_number 
			FROM `tabManufacturing Feasibility`)
			""")
	return elements
#Pending Risk Analysis list for Risk Mitigation
@frappe.whitelist()
def get_pending_risk_analysis_list(doctype,txt,searchfield,start,page_len,filters):
	elements = frappe.db.sql(""" SELECT 
			name 
			FROM 
			`tabRisk Analysis` 
			WHERE 
				name not IN (
			SELECT 
				risk_analysis 
			FROM 
				`tabRisk Mitigation Plan`)
			AND docstatus = 0
			""")
	return elements


@frappe.whitelist()
def make_risk_analysis(source_name, target_doc=None):
	doclist = get_mapped_doc("Opportunity", source_name, {
		"Opportunity": {
			"doctype": "Risk Analysis",
			"field_map": {
				"opportunity_number" : "opportunity_number"
			}
		},
		
	}, target_doc)

	return doclist
