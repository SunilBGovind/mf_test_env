// Copyright (c) 2019, Sunil Govind and contributors
// For license information, please see license.txt
frappe.ui.form.on('Manufacturing Feasibility', {
    onload: function(frm) {
        set_field_filter(frm);
        configure_fields(frm);
        configure_child_tables_column(frm);
        if (frm.doc.__islocal) {
            fetch_question(frm);
            if(frm.doc.opportunity_number) {
                fetch_opportunity_detail(frm);
            }
        }
    },

    refresh: function(frm) {
        configure_child_tables(frm);
        configure_child_tables_column(frm);
        configure_fields(frm);
    },

    opportunity_number: function(frm) {
        configure_fields(frm);
        configure_child_tables(frm);    
        if (frm.doc.opportunity_number){
            fetch_opportunity_detail(frm);    
        }
    },
    mf_1_on_form_rendered: function(frm) {
        frm.get_field('mf_1').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_1').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_2_on_form_rendered: function(frm) {
        frm.get_field('mf_2').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_2').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_3_on_form_rendered: function(frm) {
        frm.get_field('mf_3').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_3').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_4_on_form_rendered: function(frm) {
        frm.get_field('mf_4').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_4').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_5_on_form_rendered: function(frm) {
        frm.get_field('mf_5').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_5').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_6_on_form_rendered: function(frm) {
        frm.get_field('mf_6').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_6').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_7_on_form_rendered: function(frm) {
        frm.get_field('mf_7').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_7').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_8_on_form_rendered: function(frm) {
        frm.get_field('mf_8').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_8').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_9_on_form_rendered: function(frm) {
        frm.get_field('mf_9').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_9').grid.form_grid.find('.grid-append-row').hide();
    },
    mf_10_on_form_rendered: function(frm) {
        frm.get_field('mf_10').grid.form_grid.find('.row-actions').hide();
        frm.get_field('mf_10').grid.form_grid.find('.grid-append-row').hide();
    } 
});

function configure_fields(frm) {
    if (frm.doc.status !== "Stage 1 Pending") {
        frm.set_df_property('company', 'read_only', 1);
        frm.set_df_property('opportunity_number', 'read_only', 1);
        frm.set_df_property('business_development', 'read_only', 1);
        frm.set_df_property('purchase', 'read_only', 1);
        frm.set_df_property('operations', 'read_only', 1);
        frm.set_df_property('quality_assurance', 'read_only', 1);
        frm.set_df_property('process_engineering', 'read_only', 1);
        frm.set_df_property('pre_engineering', 'read_only', 1);
        frm.set_df_property('technical', 'read_only', 1);
        refresh_child_table_and_fields(frm);
    }
}

function fetch_opportunity_detail(frm) {
    frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Opportunity",
                filters: {
                    name: frm.doc.opportunity_number
                },
                fieldname: ["transaction_date"]
            },
            callback: function(r) {
                frm.set_value("opportunity_date", r.message.transaction_date);
                frm.set_value("opportunity_stage_date", frappe.datetime.nowdate());
                frm.set_value("stage", "Opportunity Stage")

                refresh_field("opportunity_date");
                refresh_field("opportunity_stage_date");
                refresh_field("stage");
               

            } 
    })
}

function configure_child_tables(frm) {
    // remove add_row and remove-rows from grid
    frm.get_field('mf_1').grid.cannot_add_rows = true;
    frm.get_field('mf_2').grid.cannot_add_rows = true;
    frm.get_field('mf_3').grid.cannot_add_rows = true;
    frm.get_field('mf_4').grid.cannot_add_rows = true;
    frm.get_field('mf_5').grid.cannot_add_rows = true;
    frm.get_field('mf_6').grid.cannot_add_rows = true;
    frm.get_field('mf_7').grid.cannot_add_rows = true;
    frm.get_field('mf_8').grid.cannot_add_rows = true;
    frm.get_field('mf_9').grid.cannot_add_rows = true;
    frm.get_field('mf_10').grid.cannot_add_rows = true;

    frm.fields_dict['mf_1'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_2'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_3'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_4'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_5'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_6'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_7'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_8'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_9'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['mf_10'].grid.wrapper.find('.grid-remove-rows').hide();
    refresh_child_table_and_fields(frm);
    

    if (frm.doc.opportunity_number) {
        frm.set_df_property('section_1', 'hidden', 0);
        frm.set_df_property('section_2', 'hidden', 0);
        frm.set_df_property('section_3', 'hidden', 0);
        frm.set_df_property('section_4', 'hidden', 0);
        frm.set_df_property('section_5', 'hidden', 0);
        frm.set_df_property('section_6', 'hidden', 0);
        frm.set_df_property('section_7', 'hidden', 0);
        frm.set_df_property('section_8', 'hidden', 0);
        frm.set_df_property('section_9', 'hidden', 0);
        frm.set_df_property('section_10', 'hidden', 0);
    } else {
        frm.set_df_property('section_1', 'hidden', 1);
        frm.set_df_property('section_2', 'hidden', 1);
        frm.set_df_property('section_3', 'hidden', 1);
        frm.set_df_property('section_4', 'hidden', 1);
        frm.set_df_property('section_5', 'hidden', 1);
        frm.set_df_property('section_6', 'hidden', 1);
        frm.set_df_property('section_7', 'hidden', 1);
        frm.set_df_property('section_8', 'hidden', 1);
        frm.set_df_property('section_9', 'hidden', 1);
        frm.set_df_property('section_10', 'hidden', 1);
    }
}

function fetch_question(frm) {
    frappe.call({
        method: "negentropy.negentropy_core.utils.get_question_list",
        args: {
            "doctype": frm.doc.doctype
        },
        async: false,
        callback: function(r) {
            frm.clear_table("mf_1");
            frm.clear_table("mf_2");
            frm.clear_table("mf_3");
            frm.clear_table("mf_4");
            frm.clear_table("mf_5");
            frm.clear_table("mf_6");
            frm.clear_table("mf_7");
            frm.clear_table("mf_8");
            frm.clear_table("mf_9");
            frm.clear_table("mf_10");
            $.each(r.message, function(i, d) {
                /* Adding question filter and storing into respective child table
                based on question number and child table vairable name */
                if (d.question_no == 'MF_1') {
                    var child = frm.add_child("mf_1");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_2') {
                    var child = frm.add_child("mf_2");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_3') {
                    var child = frm.add_child("mf_3");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_4') {
                    var child = frm.add_child("mf_4");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_5') {
                    var child = frm.add_child("mf_5");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_6') {
                    var child = frm.add_child("mf_6");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_7') {
                    var child = frm.add_child("mf_7");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_8') {
                    var child = frm.add_child("mf_8");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_9') {
                    var child = frm.add_child("mf_9");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                } else if (d.question_no == 'MF_10') {
                    var child = frm.add_child("mf_10");
                    frappe.model.set_value(child.doctype, child.name, "question", d.question);
                    frm.refresh_field("question");
                }
            })
        }
    });
}

//setup child table column property based on stage
function configure_child_tables_column(frm) {
    refresh_field("status");
    refresh_field("stage");
    refresh_field("order_handling_stage_date");
    if (frm.doc.stage == "Opportunity Stage" && frm.doc.status !== "Stage 1 Completed") {
        frm.get_field('mf_1').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_1').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_1').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_1').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_2').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_2').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_2').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_2').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_3').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_3').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_3').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_3').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_4').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_4').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_4').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_4').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_5').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_5').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_5').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_5').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_6').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_6').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_6').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_6').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_7').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_7').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_7').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_7').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_8').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_8').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_8').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_8').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_9').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_9').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_9').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_9').grid.toggle_reqd('stage1_response_remarks',true);

        frm.get_field('mf_10').grid.toggle_enable('stage1_response',true);
        frm.get_field('mf_10').grid.toggle_enable('stage1_response_remarks',true);
        frm.get_field('mf_10').grid.toggle_reqd('stage1_response',true);
        frm.get_field('mf_10').grid.toggle_reqd('stage1_response_remarks',true);

    } else if (frm.doc.stage == "Order Handling Stage" && frm.doc.status !== "Stage 2 Completed") {
    
        frm.get_field('mf_1').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_1').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_1').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_1').grid.toggle_reqd('stage2_response_remarks',true);
        

        frm.get_field('mf_2').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_2').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_2').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_2').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_3').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_3').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_3').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_3').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_4').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_4').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_4').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_4').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_5').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_5').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_5').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_5').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_6').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_6').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_6').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_6').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_7').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_7').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_7').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_7').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_8').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_8').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_8').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_8').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_9').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_9').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_9').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_9').grid.toggle_reqd('stage2_response_remarks',true);
        
        frm.get_field('mf_10').grid.toggle_enable('stage2_response',true);
        frm.get_field('mf_10').grid.toggle_enable('stage2_response_remarks',true);
        frm.get_field('mf_10').grid.toggle_reqd('stage2_response',true);
        frm.get_field('mf_10').grid.toggle_reqd('stage2_response_remarks',true);
        
    }
    refresh_child_table_and_fields(frm);
}

function refresh_child_table_and_fields(frm) {
    refresh_field("stage1_response");
    refresh_field("stage1_response_remarks");
    refresh_field("stage2_response");
    refresh_field("stage2_response_remarks");
    refresh_field("mf_1");
    refresh_field("mf_2");
    refresh_field("mf_3");
    refresh_field("mf_4");
    refresh_field("mf_5");
    refresh_field("mf_6");
    refresh_field("mf_7");
    refresh_field("mf_8");
    refresh_field("mf_9");
    refresh_field("mf_10");
}

//Fetching list of employee details using get query to avoid doctype permission to sales user
function set_field_filter(frm) {
    frm.fields_dict["opportunity_number"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_pending_mf_opportunity_list"
        }
    }

    frm.fields_dict["business_development"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Business Development'
            ]
        }
    }


    frm.fields_dict["purchase"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Purchase'
            ]
        }
    }
    

    frm.fields_dict["operations"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Operations'
            ]
        }
    }

    frm.fields_dict["quality_assurance"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Quality Assurance'
            ]
                 
        }
    }
    frm.fields_dict["process_engineering"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Process Engineering'
            ]
        }
    }
    frm.fields_dict["pre_engineering"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Pre Engineering'
            ]
        }
    }
    frm.fields_dict["technical"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_employee_list",
            filters: [
                'Technical'
            ]
        }
    }
}
// End of Program
