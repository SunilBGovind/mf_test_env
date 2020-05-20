frappe.ui.form.on('Sales Order', {
    before_submit: function(frm) {
        fetch_opportunity(frm);
    }
})

function fetch_opportunity(frm) {
    frappe.call({
        method: "negentropy.negentropy_crm.doctype.manufacturing_feasibility.manufacturing_feasibility.fetch_opportunity_number",
        args: {
            "sales_order_id": cur_frm.doc.name
        },
        callback: function(d) {
            if (d.message) {
                frappe.call({
                    method: "negentropy.negentropy_crm.doctype.manufacturing_feasibility.manufacturing_feasibility.fetch_manufacturing_feasibility",
                    args: {
                        "sales_order_id": cur_frm.doc.name
                    },
                    callback: function(s) {
                        frappe.call({
                            method: "frappe.client.get_value",
                            args: {
                                doctype: "Manufacturing Feasibility",
                                filters: {
                                    name: s.message,
                                    stage: ["=", 'Order Handling Stage'],
                                    status: ["=", 'Stage 2 Completed'],
                                    docstatus: ["!=", 2]
                                },
                                fieldname: ["name"]
                            },
                            callback: function(r) {
                                if (r.message == undefined) {
                                    frappe.validated = false;
                                    frappe.msgprint('Manufacturing Feasibility Order Handling Stage needs to be completed');
                                    call_manufacturing_feasibility(frm)

                                } else {
                                    return true;
                                }

                            }
                        });
                    }
                });
            } else {
                return true;
            }
        }
    })
}

function call_manufacturing_feasibility(frm) {
    frappe.call({
        method: "negentropy.negentropy_crm.doctype.manufacturing_feasibility.manufacturing_feasibility.fetch_manufacturing_feasibility",
        args: {
            "sales_order_id": cur_frm.doc.name
        },
        callback: function(r) {
            frappe.call({
                method: "negentropy.negentropy_crm.doctype.manufacturing_feasibility.manufacturing_feasibility.update_manufacturing_feasibility",
                args: {
                    "name": r.message
                },
                async: false,
                callback: function(r) {
                    frm.refresh();
                }
            });
            frappe.set_route("Form", "Manufacturing Feasibility", r.message);
        }
    })
}
