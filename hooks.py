# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "negentropy"
app_title = "Negentropy"
app_publisher = "Kaynes Technology India Pvt Ltd"
app_description = "Additional features and customizations for ERPNext."
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "govindsmenokee@kaynestechnology.net"
app_license = "MIT"

app_logo_url = '/assets/negentropy/images/kaynes-logo.svg'

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/negentropy/css/negentropy.css"
# app_include_js = "/assets/negentropy/js/negentropy.js"

# include js, css files in header of web template
# web_include_css = "/assets/negentropy/css/negentropy.css"
# web_include_js = "/assets/negentropy/js/negentropy.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}
# fixtures = ["Custom Field", "Custom Script", "Property Setter", "Print Format"]
# fixtures = ["Custom DocPerm", "Custom Script", "Lead Category", "Incoterms"]
# include js in doctype views
doctype_js = {
	"Payroll Entry" : "public/js/payroll_entry.js"
}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

website_context = {
	"favicon": 	"/assets/negentropy/images/kaynes-logo.svg",
	"splash_image": "/assets/negentropy/images/kaynes-logo.svg"
}

# Website user home page (by function)
# get_website_user_home_page = "negentropy.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "negentropy.install.before_install"
# after_install = "negentropy.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "negentropy.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Training Event": {
		"validate": "negentropy.negentropy_hr.api.update_training_effectiveness_on_validate",
		"on_trash": "negentropy.negentropy_hr.api.update_training_effectiveness_on_trash",
    },
	"Payroll Entry": {
		"before_submit": "negentropy.negentropy_hr.validations.payroll_entry.before_submit"
	},
	"Salary Slip": {
		"validate": "negentropy.negentropy_hr.validations.salary_slip.validate"
	},
	"Attendance": {
		"on_submit": "negentropy.negentropy_hr.validations.attendance.on_submit"
	}
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"negentropy.tasks.all"
# 	],
# 	"daily": [
# 		"negentropy.tasks.daily"
# 	],
# 	"hourly": [
# 		"negentropy.tasks.hourly"
# 	],
# 	"weekly": [
# 		"negentropy.tasks.weekly"
# 	]
# 	"monthly": [
# 		"negentropy.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "negentropy.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "negentropy.event.get_events"
# }

