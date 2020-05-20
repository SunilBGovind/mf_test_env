frappe.ui.form.on('Training Event', {
    refresh: function(frm) {
        if(!frm.doc.__islocal){
        	dashboard_link_doctype(frm, "Training Effectiveness");
        }
    },
    employees_on_form_rendered: function(frm,cdt,cdn){
        frm.fields_dict['employees'].grid.wrapper.find('.grid-delete-row').hide();
    },
    training_program: function(frm){
        frm.set_value("employees","")
        frappe.call({
            "method": "negentropy.negentropy_hr.api.populate_employee_from_training_effectiveness",
            args:{
                "training_program": frm.doc.training_program
            },
            callback: function(r){
                if(r.message){
                    $.each(r.message, function (i, emp_list) {
                        $.each(emp_list, function (i, d) {
                            var row = frappe.model.add_child(frm.doc, "Training Event Employee", "employees");
                            row.employee = d.employee;
                            row.employee_name = d.employee_name;
                            row.department = d.department;
                            row.status = "Open";
                            row.attendance= "Mandatory";
                            row.from_training_effectiveness = d.parent;
                        })
                    })
                    refresh_field("employees")
                }
                
            }
        })
    },
    validate: function(frm){
        frm.set_df_property("training_program","read_only","1")
    }
});

frappe.ui.form.on('Training Event Employee', {
    before_employees_remove: function(frm,cdt,cdn){
        var row = locals[cdt][cdn]
        var idx = []
        var selected_children = frm.get_field('employees').grid.get_selected_children()
        for(var i=0;i<selected_children.length;i++) {
            if(selected_children[i].from_training_effectiveness){
                idx.push(selected_children[i].idx)
            }
        }
        if(idx.length!=0){
            frappe.throw("Cannot Delete Employees populated from Training Effectiveness")
        }
    }
    
})


   function dashboard_link_doctype(frm, doctype){

    	var parent = $('.form-dashboard-wrapper [data-doctype="Training Feedback"]').closest('div').parent();
    	
    	parent.find('[data-doctype="'+doctype+'"]').remove();

    	parent.append(frappe.render_template("dashboard_link_doctype", {doctype:doctype,docstatus:frm.doc.docstatus}));

    	var self = parent.find('[data-doctype="'+doctype+'"]');
    	set_open_count(frm, doctype);

        // bind links
    	self.find(".badge-link").on('click', function(){
            frappe.route_options = {
                "training_event": frm.doc.name
            }
            frappe.set_route("List", doctype);
        });

        // bind open notifications
         self.find('.open-notification').on('click', function(){
            frappe.route_options = {
              "training_event": frm.doc.name,
              "docstatus": 0
            }
            frappe.set_route("List", doctype);
          });

          // bind new
          if (frappe.model.can_create(doctype)){
            self.find('.btn-new').removeClass('hidden');
          }
          self.find('.btn-new').on('click', function(){
            if(frm.doc.event_status == "Completed"){
                frappe.new_doc(doctype,
                {
                  "training_event": frm.doc.name
                });
            }else{
                frappe.new_doc(doctype,
                {

                });
            }
          });
          
          
          function set_open_count(frm, doctype){
           var method = '';
        	var links = {};
    
        	if(doctype=="Training Effectiveness"){
        		method = 'negentropy.negentropy_hr.doctype.training_effectiveness.training_effectiveness.get_open_count';
        	}
    
        	if(method!=""){
        		frappe.call({
        			type: "GET",
        			method: method,
        			args: {
        				name: frm.doc.name,
        			},
        			callback: function(r) {
        				// update badges
        				$.each(r.message.count, function(i, d) {
        					frm.dashboard.set_badge_count(d.name, cint(d.open_count), cint(d.count));
        				});
        			}
        		});
        	}
        }
                
    }
    
   frappe.templates["dashboard_link_doctype"] = ' \
    	<div class="document-link" data-doctype="{{ doctype }}"> \
    	<a class="badge-link small">{{ __(doctype) }}</a> \
    	<span class="text-muted small count"></span> \
    	<span class="open-notification hidden" title="{{ __("Open {0}", [__(doctype)])}}"></span> \
    		<button class="btn btn-new btn-default btn-xs hidden" data-doctype="{{ doctype }}"> \
    			{% if docstatus==1 %}<i class="octicon octicon-plus" style="font-size: 12px;"></i> {% endif %}\
    		</button>\
    	</div>';

