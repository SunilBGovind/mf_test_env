// Copyright (c) 2019, Sunil Govind and contributors
// For license information, please see license.txt
frappe.ui.form.on('Risk Mitigation Plan', {
    onload: function(frm) {
        set_field_filter(frm);
        if (frm.doc.__islocal) {
            if(frm.doc.risk_analysis) {
                fetch_risk_mitigation_elements(frm);    
            }
        } 
    },
    refresh: function(frm) {
        configure_child_tables(frm);
        set_field_filter(frm);
    },
    risk_analysis: function(frm) {
        fetch_risk_mitigation_elements(frm);
        configure_child_tables(frm);
    },
    risk_mitigation_plan_details_on_form_rendered: function(frm) {
        frm.get_field('risk_mitigation_plan_details').grid.form_grid.find('.row-actions').hide();
        frm.get_field('risk_mitigation_plan_details').grid.form_grid.find('.grid-append-row').hide();
    }
});

function configure_child_tables(frm) {
    frm.get_field('risk_mitigation_plan_details').grid.cannot_add_rows = true;
    frm.fields_dict['risk_mitigation_plan_details'].grid.wrapper.find('.grid-remove-rows').hide();
    frm.refresh_field('risk_mitigation_plan_details');
    
    if (frm.doc.risk_analysis) {
        frm.set_df_property('risk_element_content', 'hidden', 0);
        frm.set_df_property('section_11', 'hidden', 0);
    } else {
        frm.set_df_property('risk_element_content', 'hidden', 1);
        frm.set_df_property('section_11', 'hidden', 1);
    }
}

function set_field_filter(frm) {
    frm.fields_dict["risk_analysis"].get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.utils.get_pending_risk_analysis_list"
        }
    }
    frm.fields_dict["risk_mitigation_plan_details"].grid.get_field("responsibility").get_query = function(doc) {
        return {
            query: "negentropy.negentropy_crm.doctype.risk_mitigation_plan.risk_mitigation_plan.fetch_employee_list",
            filters: {
                company: frm.doc.company
            }
        }
    }
}


function fetch_risk_mitigation_elements(frm) {
    if (frm.doc.risk_analysis) {
        frappe.call({
            method: "negentropy.negentropy_crm.doctype.risk_mitigation_plan.risk_mitigation_plan.get_total_risk_value",
            args: {
                "risk_analysis": frm.doc.risk_analysis
            },
            async: false,
            callback: function(r) {
                var risk_analysis_value = 0;
                risk_analysis_value = r.message.total_risk;
                if (risk_analysis_value > 1.50) {
                    frappe.call({
                        method: "negentropy.negentropy_crm.doctype.risk_mitigation_plan.risk_mitigation_plan.get_all_risk_elements",
                        args: {
                            "risk_analysis": frm.doc.risk_analysis
                        },
                        async: false,
                        callback: function(r) {
                            frm.clear_table("risk_mitigation_plan_details");
                            $.each(r.message, function(i, d) {
                                var child = frm.add_child("risk_mitigation_plan_details");
                                frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                                frappe.model.set_value(child.doctype, child.name, "risk_element", d.risk_element);
                                frappe.model.set_value(child.doctype, child.name, "net_risk_score", d.net_risk_score);
                                frappe.model.set_value(child.doctype, child.name, "remarks", d.remarks);
                                frappe.model.set_value(child.doctype, child.name, "can_delete", 1);
                                frm.refresh_field("risk_element");
                            })
                            refresh_field("risk_mitigation_plan_details");
                        }
                    }); 
                } else if (risk_analysis_value <= 1.5) {
                    frappe.call({
                        method: "negentropy.negentropy_crm.doctype.risk_mitigation_plan.risk_mitigation_plan.get_main_risk_elements",
                        args: {
                            "risk_analysis": frm.doc.risk_analysis
                        },
                        async: false,
                        callback: function(r) {
                            frm.clear_table("risk_mitigation_plan_details");
                            $.each(r.message, function(i, d) {
                                var child = frm.add_child("risk_mitigation_plan_details");
                                frappe.model.set_value(child.doctype, child.name, "main_question", d.main_question);
                                frappe.model.set_value(child.doctype, child.name, "risk_element", d.risk_element);
                                frappe.model.set_value(child.doctype, child.name, "net_risk_score", d.net_risk_score);
                                frappe.model.set_value(child.doctype, child.name, "remarks", d.remarks);
                                frappe.model.set_value(child.doctype, child.name, "can_delete", 1);
                                refresh_field("risk_element");
                            }) 
                            refresh_field("risk_mitigation_plan_details");
                        }
                    }); 
                } 

            }
        })
    }
}

// End of Program
