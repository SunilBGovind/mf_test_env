// Copyright (c) 2019, Sunil Govind and contributors
// For license information, please see license.txt
frappe.ui.form.on('Risk Analysis', {
    onload: function(frm) {
        set_field_filter(frm);
        if (frm.doc.__islocal) {
            fetch_questions(frm);
            if(frm.doc.opportunity_number) {
                fetch_transcation_details(frm);
            }
        }
    },
    refresh: function(frm) {
        configure_child_tables(frm);
        set_field_filter(frm);
    },

    before_submit: function(frm) {
        enable_risk_mitigation_plan(frm);
    },
    opportunity_number: function(frm) {
        configure_child_tables(frm);
        fetch_manufacturing_feasibility_detail(frm);
        if(frm.doc.opportunity_number) {
            fetch_transcation_details(frm);
        }
    },
    ra_1_on_form_rendered: function(frm) {
        frm.get_field('ra_1').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_1').grid.form_grid.find('.grid-append-row').hide();
    },
    ra_2_on_form_rendered: function(frm) {
        frm.get_field('ra_2').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_2').grid.form_grid.find('.grid-append-row').hide();
    },
    ra_3_on_form_rendered: function(frm) {
        frm.get_field('ra_3').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_3').grid.form_grid.find('.grid-append-row').hide();
    },
    ra_4_on_form_rendered: function(frm) {
        frm.get_field('ra_4').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_4').grid.form_grid.find('.grid-append-row').hide();
    },
    ra_5_on_form_rendered: function(frm) {
        frm.get_field('ra_5').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_5').grid.form_grid.find('.grid-append-row').hide();
    },
    ra_6_on_form_rendered: function(frm) {
        frm.get_field('ra_6').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_6').grid.form_grid.find('.grid-append-row').hide();
    },
    ra_7_on_form_rendered: function(frm) {
        frm.get_field('ra_7').grid.form_grid.find('.row-actions').hide();
        frm.get_field('ra_7').grid.form_grid.find('.grid-append-row').hide();
    }

});

frappe.ui.form.on('Risk Analysis Detail', {
    anticipated_risk_value: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var total_net_risk_score = 0;
        var total_risk = 0;

        row.net_risk_score = parseInt(row.weightage) * parseInt(row.anticipated_risk_value);
        $.each(frm.doc.ra_1, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        $.each(frm.doc.ra_2, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        $.each(frm.doc.ra_3, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        $.each(frm.doc.ra_4, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        $.each(frm.doc.ra_5, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        $.each(frm.doc.ra_6, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        $.each(frm.doc.ra_7, function(i, d) {
            total_net_risk_score = parseInt(total_net_risk_score) + parseInt(d.net_risk_score);
        });
        frm.doc.total_net_risk_score = total_net_risk_score;
        total_risk = parseInt(total_net_risk_score) / parseInt(frm.doc.total_weightage);
        frm.doc.total_risk = total_risk;
        refresh_child_table_and_fields(frm);
        
    }
});

function configure_child_tables(frm) {

    frm.get_field('ra_1').grid.cannot_add_rows = true;
    frm.get_field('ra_2').grid.cannot_add_rows = true;
    frm.get_field('ra_3').grid.cannot_add_rows = true;
    frm.get_field('ra_4').grid.cannot_add_rows = true;
    frm.get_field('ra_5').grid.cannot_add_rows = true;
    frm.get_field('ra_6').grid.cannot_add_rows = true;
    frm.get_field('ra_7').grid.cannot_add_rows = true;

    frm.fields_dict['ra_1'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['ra_2'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['ra_3'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['ra_4'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['ra_5'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['ra_6'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.fields_dict['ra_7'].grid.wrapper.find('.grid-remove-rows').hide();
    
    if (frm.doc.opportunity_number) {
        frm.set_df_property('section_1', 'hidden', 0);
        frm.set_df_property('section_2', 'hidden', 0);
        frm.set_df_property('section_3', 'hidden', 0);
        frm.set_df_property('section_4', 'hidden', 0);
        frm.set_df_property('section_5', 'hidden', 0);
        frm.set_df_property('section_6', 'hidden', 0);
        frm.set_df_property('section_7', 'hidden', 0);
        frm.set_df_property('total_section', 'hidden', 0);
    } else {
        frm.set_df_property('section_1', 'hidden', 1);
        frm.set_df_property('section_2', 'hidden', 1);
        frm.set_df_property('section_3', 'hidden', 1);
        frm.set_df_property('section_4', 'hidden', 1);
        frm.set_df_property('section_5', 'hidden', 1);
        frm.set_df_property('section_6', 'hidden', 1);
        frm.set_df_property('section_7', 'hidden', 1);
        frm.set_df_property('total_section', 'hidden', 1);
    }
    refresh_child_table_and_fields(frm);
}

function fetch_questions(frm) {
    var total_weightage = 0;
    frappe.call({
        method: "negentropy.negentropy_core.utils.get_question_list",
        args: {
            "doctype": frm.doc.doctype
        },
        async: false,
        callback: function(r) {
            frm.clear_table("ra_1");
            frm.clear_table("ra_2");
            frm.clear_table("ra_3");
            frm.clear_table("ra_4");
            frm.clear_table("ra_5");
            frm.clear_table("ra_6");
            frm.clear_table("ra_7");
            frm.refresh_field();
            $.each(r.message, function(i, d) {
                /* Adding question filter and storing into respective child table
                based on question number and child table vairable name  */
                if (d.question_no == 'RA_1') {
                    var child = frm.add_child("ra_1");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question)
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                } else if (d.question_no == 'RA_2') {
                    var child = frm.add_child("ra_2");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question)
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                } else if (d.question_no == 'RA_3') {
                    var child = frm.add_child("ra_3");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question)
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                } else if (d.question_no == 'RA_4') {
                    var child = frm.add_child("ra_4");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question)
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                } else if (d.question_no == 'RA_5') {
                    var child = frm.add_child("ra_5");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question)
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                } else if (d.question_no == 'RA_6') {
                    var child = frm.add_child("ra_6");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question)
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                } else if (d.question_no == 'RA_7') {
                    var child = frm.add_child("ra_7");
                    total_weightage = parseInt(total_weightage) + parseInt(d.weightage);
                    frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                    frappe.model.set_value(child.doctype, child.name, "risk_element", d.question);
                    frappe.model.set_value(child.doctype, child.name, "weightage", d.weightage);
                    var risk_value_description = fetch_risk_element_description(frm.doc.doctype, d.question);
                    frappe.model.set_value(child.doctype, child.name, "risk_value_description", risk_value_description);
                    frm.refresh_field("risk_element");
                }
            })
            frm.doc.total_weightage = total_weightage;
        }
    });
}

function fetch_transcation_details(frm){
    var manfucturing_feasibility_number= fetch_manufacturing_feasibility_detail(frm);
    var opportunity_date = fetch_opportunity_detail(frm);

    frm.set_value("opportunity_date", opportunity_date);
    refresh_field("opportunity_date");  

    if (manfucturing_feasibility_number) {
        frm.set_value("manufacturing_feasibility_number", manfucturing_feasibility_number['name']);
        refresh_field("manufacturing_feasibility_number");    
    } else {
        frappe.msgprint('Manufacturing Feasibility has to be completed for '+ frm.doc.opportunity_number);
        frm.set_value("opportunity_number","");
        frm.set_value("opportunity_date","");
        frm.set_value("company","");
        frm.set_value("customer_name","");       
    }
}

function fetch_opportunity_detail(frm) {
    var opportunity_date;
   frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Opportunity",
            filters: {
                name: frm.doc.opportunity_number
            },
            fieldname: ["transaction_date"]
        },
        async: false,
        callback: function(r) {
            opportunity_date = r.message.transaction_date;
        } 
    })
    return opportunity_date;
}

function fetch_manufacturing_feasibility_detail(frm) {
    var manfucturing_feasibility_number;
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Manufacturing Feasibility",
            filters: {
                opportunity_number: frm.doc.opportunity_number
            },
            fieldname: ["name"]
        },
        async: false,
        callback: function(r) {
            manfucturing_feasibility_number = r.message;
        } 
    })
    return manfucturing_feasibility_number;
}


function fetch_risk_element_description(doctype, risk_element) {
    var data = {};
    frappe.call({
        method: "negentropy.negentropy_crm.doctype.risk_analysis.risk_analysis.get_risk_details",
        args: {
            "doctype": doctype,
            "risk_element": risk_element
        },
        async: false,
        callback: function(r) {
            data = r.message;
        }
    })
    return data;
}


function fetch_risk_mitigation_status(risk_analysis_id) {
    var status = {};
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Risk Mitigation Plan",
            filters: {
                risk_analysis: risk_analysis_id
            },
            fieldname: ["name","docstatus"]
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                status = {
                    "name": r.message.name,
                    "docstatus": r.message.docstatus
                };
            } else {
                status = undefined;
            }
        }
    });
    return status;
}

function enable_risk_mitigation_plan(frm) {
    var risk_analysis_id = frm.doc.name;
    var risk_mitigation_plan = fetch_risk_mitigation_status(risk_analysis_id);
    /*Check Risk Mitigation transaction status and if does not exist, Risk Mitigation Plan will be create as based on below 
    below condition */
    if (risk_mitigation_plan == undefined) {
        if (frm.doc.total_risk > 1.50) {
            //if Total Risk is greater than 1.50 then Risk Mitigation to be done for all risk elements
            frm.add_custom_button(__('Risk Mitigation Plan'), function() {
                create_risk_mitigation_plan(frm);
            }, );
            frappe.msgprint("This Document is having High Risk Value, Risk Mitigation Plan needs to be completed.");
            frappe.validated = false;
        } else if (frm.doc.total_risk <= 1.50) {
            //if Total Risk is lesser than 1.50 then Risk Mitigation to be done for few risk elements which is having 9 value
            frappe.call({
                method: "negentropy.negentropy_crm.doctype.risk_mitigation_plan.risk_mitigation_plan.get_main_risk_elements",
                args: {
                    "risk_analysis": frm.doc.name
                },
                async: false,
                callback: function(r) {
                    if (r.message.length > 0) {
                        frm.add_custom_button(__('Risk Mitigation Plan'), function() {
                            create_risk_mitigation_plan(frm);
                        }, );
                        frappe.msgprint("One of the question element is having a high risk value, Risk Mitigation Plan needs to be completed.");
                        frappe.validated = false;
                    }
                }
            });
        }
    } else if(risk_mitigation_plan["docstatus"] == 0) {
        frappe.throw("Risk Mitigation Plan " + risk_mitigation_plan["name"] + " needs to be submitted");
        frappe.validated = false;
    }
}

function create_risk_mitigation_plan(frm) {
    frappe.model.open_mapped_doc({
        method: "negentropy.negentropy_crm.doctype.risk_analysis.risk_analysis.make_risk_mitigation_plan",
        frm: frm
    })
}

function refresh_child_table_and_fields(frm) {
    refresh_field("total_net_risk_score");
    refresh_field("total_risk");
    refresh_field("ra_1");
    refresh_field("ra_2");
    refresh_field("ra_3");
    refresh_field("ra_4");
    refresh_field("ra_5");
    refresh_field("ra_6");
    refresh_field("ra_7");
}


function set_field_filter(frm) {
    frm.fields_dict["opportunity_number"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_pending_ra_opportunity_list",
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

//End of Program
