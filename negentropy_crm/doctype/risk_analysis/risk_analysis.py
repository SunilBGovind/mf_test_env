# -*- coding: utf-8 -*-
# Copyright (c) 2019, Sunil Govind and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc

class RiskAnalysis(Document):
	def before_save(self):
		child_tables = [self.ra_1, self.ra_2, self.ra_3, self.ra_4, self.ra_5, self.ra_6, self.ra_7] 
		for child_table in child_tables:
			for field in child_table:
				if field.net_risk_score == 0:
					frappe.throw("Net Score should not be zero, Row {0}".format(field.idx))
# Level of Risk Description of HTML format is sending to Risk Analysis module of child tables
@frappe.whitelist()
def get_risk_details(doctype,risk_element):
	risk_description = ''
	elements = frappe.get_doc("DocType Review", doctype)
	for element in elements.doctype_review_details:
		if element.question == risk_element:
			risk_description = '''<table class="table table-bordered">	
									<tbody>
										<tr>
											<td border: 1px solid black;padding: 15px><strong> (1) Low Risk - {0}</strong></td>
										</tr>
										<tr >
											<td border: 1px solid black;padding: 15px><strong> (2) Medium Risk - {1}</strong></td>
										</tr>
										<tr>
											<td border: 1px solid black;padding: 15px><strong> (3) High Risk - {2}</strong></td>
										</tr>
									</tbody>
					</table>'''.format(element.low_risk,element.medium_risk,element.high_risk)	
	return risk_description

# Document mapping from Risk Analysis module to Risk Mitigation Plan module
@frappe.whitelist()
def make_risk_mitigation_plan(source_name, target_doc=None):
	doclist = get_mapped_doc("Risk Analysis", source_name, {
		"Risk Analysis": {
			"doctype": "Risk Mitigation Plan",
			"field_map": {
				"risk_analysis" : "name"
			}	
		},
		
	}, target_doc)

	return doclist
