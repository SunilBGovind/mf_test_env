from __future__ import unicode_literals
import frappe

@frappe.whitelist()
def get_question_list(doctype):
	ret_list= []
	elements = frappe.get_doc("DocType Review",doctype)
	for i in elements.doctype_review_details:
		ret = {'main_question': i.main_question, 'question_no':i.question_no,'question': i.question,'weightage': i.weightage}
		ret_list.append(ret)
	return ret_list


                    