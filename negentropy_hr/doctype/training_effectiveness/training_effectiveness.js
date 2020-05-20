// Copyright (c) 2020, Kaynes Technology India Pvt Ltd and contributors
// For license information, please see license.txt


frappe.ui.form.on('Training Effectiveness', {
	onload: function(frm){
		frm.set_query('training_event', function(doc) {
			return {
				filters: {
					"docstatus": 1,
					"event_status": "Completed"
				}
			};
		});
	},
	refresh: function(frm){
		cur_frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-add-row').hide();
        cur_frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-remove-rows').hide();
	},
	training_effectiveness_employee_on_form_rendered: function(frm,cdt,cdn){
		frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-delete-row').hide();
		frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-duplicate-row').hide();
		frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-move-row').hide();
		frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-append-row').hide();
		frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-insert-row-below').hide();
		frm.fields_dict['training_effectiveness_employee'].grid.wrapper.find('.grid-insert-row').hide();
	},
	training_event: function(frm){
		frm.set_value("training_effectiveness_employee","")
		frappe.call({
			"method": "frappe.client.get",
			args:{
				"doctype":"Training Event",
				"name": frm.doc.training_event
			},
			callback: function(r){
				var training_date = new Date(r.message.start_time);
				frm.set_value("training_date",training_date);
				frm.set_value("conducted_on",frappe.datetime.nowdate())
				$.each(r.message.employees, function (i, d) {
					var row = frappe.model.add_child(frm.doc, "Training Effectiveness Employee", "training_effectiveness_employee");
					row.employee = d.employee;
					row.employee_name = d.employee_name;
					row.department = d.department;
					row.training_program=r.message.training_program;
					if(d.status=="Open" || d.status=="Invited"){
						row.understanding = "NA";
						row.ability_to_use = "NA";
						row.improvement_noticed_in_job = "NA";
						row.ability_to_guide_others = "NA";
						row.achievement_of_objectives = "NA";
						row.areas_where_trained_subject_implemented = "NA";
						row.need_for_additional_self_learning = "NA";
						row.further_support_required_from_hr_to_improve = "Yes";
					}
				})
				refresh_field("training_effectiveness_employee");
			}
		})
	},
	conducted_by: function(frm){
		if(frm.doc.training_effectiveness_employee.length > 0){
			$.each(frm.doc.training_effectiveness_employee, function (i, d) {
				if(d.employee == frm.doc.conducted_by){
					frm.set_value("conducted_by","")
					frappe.throw("Training Attendees cannot conduct training effectiveness")
				}
			})
		}
	}
});




