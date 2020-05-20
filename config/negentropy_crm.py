from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Settings"),
			"icon": "fa fa-star",
			"items": [
				{
					"type": "doctype",
					"name": "Lead Category",
					"description": _("Lead Category"),
					"onboard": 1,
				},
				{
					"type": "doctype",
					"name": "Incoterms",
					"description": _("Incoterms"),
					"onboard": 1,
				}
			]
		},
		{
			"label": _("Documents"),
			"icon": "fa fa-star",
			"items": [
				{
					"type": "doctype",
					"name": "Manufacturing Feasibility",
					"description": _("Manufaturing Feasibility"),
					"onboard": 1,
				},
				{
					"type": "doctype",
					"name": "Risk Analysis",
					"description": _("Risk Analysis"),
					"onboard": 1,
				},
				{
					"type": "doctype",
					"name": "Risk Mitigation Plan",
					"description": _("Risk Mitigation Plan"),
					"onboard": 1,
				}
			]
		}
	]
