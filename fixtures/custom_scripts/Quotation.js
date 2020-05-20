frappe.ui.form.on('Quotation', {
	onload(frm){
		check_manufacture_feasibility_status(frm);
	},
	party_name: function(frm) {
		check_manufacture_feasibility_status(frm);
	},
	before_submit: function(frm) {
		check_manufacture_feasibility_status(frm);
	}
})

function check_manufacture_feasibility_status (frm) {
	var opportunity_number;
	var manufacture_feasibility_number;
	
	if(frm.doc.quotation_to && frm.doc.party_name) {
	    opportunity_number = fetch_opportunity_number(frm);
	    if(opportunity_number != 'undefined') {
	       manufacture_feasibility_number = fetch_manufacture_feasibility_number(opportunity_number);
	       if(manufacture_feasibility_number == 'undefined'){
	           frappe.msgprint("Manufacturing Feasibility has to be completed for  " + frm.doc.party_name);
	           frm.set_value("party_name", "");
	           frm.set_value("customer_name", "");
	           frm.clear_table("items");
	       }
	    } else {
	        frappe.msgprint("Opportunity has to be created for  " + frm.doc.party_name);
	        frm.set_value("party_name", "");
	        frm.set_value("customer_name", "");
	        frm.clear_table("items");
	    }
	}
}

function fetch_opportunity_number(frm) {
    var opportunity_number;
    frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Opportunity",
                filters:{
                    opportunity_from: frm.doc.quotation_to,
                    party_name: frm.doc.party_name,
                    docstatus: ["!=", 2]
                    
                },
                fieldname: ["name"]
            },
            async: false,
            callback: function(r) {
                if(r.message) {
                    opportunity_number = r.message.name;    
                } else {
                 opportunity_number = 'undefined';
                }
                
            }
    })
    return opportunity_number;
}

function fetch_manufacture_feasibility_number(opportunity_number) {
    var manufacture_feasibility_number;
    frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: "Manufacturing Feasibility",
                filters:{
                    opportunity_number: opportunity_number,
                    status: ["!=", 'Stage 1 Pending'],
                    docstatus: ["!=", 2]
                },
                fieldname: ["name"]
            },
            async: false,
            callback: function(r) {
                if(r.message) {
                    manufacture_feasibility_number = r.message.name;    
                } else {
                    manufacture_feasibility_number ='undefined';
                }
                
            }
    })
    return manufacture_feasibility_number;
}


