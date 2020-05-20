// Copyright (c) 2020, Kaynes Technology India Pvt Ltd and contributors
// For license information, please see license.txt


frappe.ui.form.on('Caution Deposit', {
	onload: function(frm) {
		frm.set_query("employee", function() {
			return {
				filters: {
					"company": frm.doc.company
				}
			};
		});
		frm.set_query("salary_component", function() {
			return {
				filters: {
					"type": "Deduction"
				}
			};
		});
	}
});
