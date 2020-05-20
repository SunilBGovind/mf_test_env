frappe.ui.form.on('Opportunity', {
    refresh(frm) {
        if (!frm.doc.__islocal) {
            enable_custom_buttons(frm);
        }
    }
});

function enable_custom_buttons(frm) {
    if (frm.custom_buttons['Quotation'] == undefined) {
        frm.add_custom_button(__('Quotation'), __("Create"));
    } else {
        cur_frm.custom_buttons["Quotation"][0].onclick = function() {
            var opportunity_id = cur_frm.doc.name;
            var status = fetch_manufacture_feasibility_status(opportunity_id);
            if (status == undefined) {
                frappe.validated = false;
            } else if (status.status == 'Stage 1 Pending') {
                frappe.msgprint(status.name + " Manufacturing Feasibility is made for this Opportunity and it is needs to be Submitted");
                frappe.set_route("Form", "Manufacturing Feasibility", status.name);
            } else if (status.status == 'Stage 1 Completed' || status.status == 'Stage 2 Completed') {
                frappe.model.open_mapped_doc({
                    method: "erpnext.crm.doctype.opportunity.opportunity.make_quotation",
                    frm: cur_frm
                });

            }

        }
    }
    if (frm.custom_buttons['Manufacturing Feasibility'] == undefined) {
        frm.add_custom_button(__('Manufacturing Feasibility'), function() {
            var opportunity_id = cur_frm.doc.name;
            var status = fetch_manufacture_feasibility_status(opportunity_id);
            if (status == undefined) {
                frappe.model.open_mapped_doc({
                    method: "negentropy.negentropy_crm.doctype.manufacturing_feasibility.manufacturing_feasibility.make_manufacturing_feasibility",
                    frm: cur_frm
                })
            } else if (status.status == 'Stage 1 Pending') {
                frappe.msgprint(status.name + ' Manufacturing Feasibility of Opportunity Stage needs to be completed');
                frappe.set_route("Form", "Manufacturing Feasibility", status.name);
            } else if (status.status == 'Stage 1 Completed' || status.status == 'Stage 2 Completed') {
                frappe.throw(status.name + ' Manufacturing Feasibility is completed for this opportunity');
                return false;
            } else {

                return true;
            }
        }, __("Create"));
    }
    if (frm.custom_buttons['Risk Analysis'] == undefined) {
        frm.add_custom_button(__('Risk Analysis'), function() {
            create_risk_analysis(frm);
        }, __("Create"));
    }
}

function fetch_manufacture_feasibility_status(opportunity_id) {
    var status = {};
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Manufacturing Feasibility",
            filters: {
                opportunity_number: ["=", opportunity_id],
                docstatus: ["!=", 2]
            },
            fieldname: ["name", "status"]
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                status = {
                    "status": r.message.status,
                    "name": r.message.name
                };
            } else {
                status = undefined;
            }

        }
    });
    return status;
}

// fetching risk analysis transaction status using in-build frappe API
function fetch_risk_analysis_status(opportunity_id) {
    var status = {};
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Risk Analysis",
            filters: {
                opportunity_number: ["=", opportunity_id],
                docstatus: ["!=", 2]

            },
            fieldname: ["name", "docstatus"]
        },
        async: false,
        callback: function(r) {
            if (r.message) {
                status = {
                    "status": r.message.docstatus,
                    "name": r.message.name
                };
            } else {
                status = undefined;
            }

        }
    });
    return status;
};

function create_risk_analysis(frm) {
    var opportunity_id = cur_frm.doc.name;
    var risk_analysis = fetch_risk_analysis_status(opportunity_id);
    if (risk_analysis == undefined) {
        frappe.model.open_mapped_doc({
            method: "negentropy.negentropy_crm.utils.make_risk_analysis",
            frm: frm
        })
    } else if (risk_analysis.status == 0) {
        frappe.msgprint(risk_analysis.name + ' Risk Analysis is completed for this opportunity and it is needs to be submitted');
        frappe.set_route("Form", "Risk Analysis", risk_analysis.name);
    } else if (risk_analysis.status == 1) {
        frappe.throw(risk_analysis.name + ' Risk Analysis is completed for this opportunity');
        return false;
    }
};

