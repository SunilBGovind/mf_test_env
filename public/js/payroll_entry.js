// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt


frappe.ui.form.on('Payroll Entry', {
	onload: function (frm) {
		frm.toggle_reqd(['payroll_frequency'], frm.doc.salary_slip_based_on_timesheet);

	},
	
	verify_attendance: function(frm){
		if(frm.doc.employees.length > 0){
			frappe.call({
				method: 'negentropy.negentropy_hr.validations.payroll_entry.verify_employee_attendance',
				args: {
					payroll_entry: frm.doc.name
				},
				callback: function(r) {
					render_employee_attendance(frm, r.message);
				},
				freeze: true,
				freeze_message: 'Validating Employee Attendance...'
			});
		}else{
			frm.fields_dict.attendance_detail_html.html("");
		}
	},
	mark_lwp: function(frm){
		if(frm.doc.employees.length > 0){
			frappe.call({
				method: 'negentropy.negentropy_hr.validations.payroll_entry.mark_lwp',
				args: {
					payroll_entry: frm.doc.name
				},
				callback: function(r) {
					frm.doc.lwp_marked = 1;
					frm.save()
					frappe.msgprint('LWP marked successfully.')
					
				},
				freeze: true,
				freeze_message: 'Marking LWP for absent employees...'
			});
		}else{
			
		}
	},
	company: function(frm){
		frm.doc.lwp_marked = 0;
	},
	start_date: function(frm){
		frm.doc.lwp_marked = 0;
	},
	end_date: function(frm){
		frm.doc.lwp_marked = 0;
	},
	branch: function(frm){
		frm.doc.lwp_marked = 0;
	},
	designation: function(frm){
		frm.doc.lwp_marked = 0;
	},
	department: function(frm){
		frm.doc.lwp_marked = 0;
	},
});