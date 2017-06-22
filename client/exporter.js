import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'

import './uploadacademicrecord.html';

MyAppExporter = {
	exportAllrecord: function() {
		var self = this;
		Meteor.call("exportAllrecords", function(error, data) {

			if ( error ) {
				alert(error);
				return false;
			}

			var csv = Papa.unparse(data);
			self._downloadCSV(csv);
		});
	},

	_downloadCSV: function(csv) {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "records.csv";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}
}
