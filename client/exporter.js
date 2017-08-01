import {Meteor} from 'meteor/meteor';
import './exporter.html'


Meteor.subscribe('userStats');


const Exporter = {
  exportAllRecord() {
    Meteor.call("exportAllRecords", (error, data) => {
      if (error) {
        alert(error);
        return;
      }
      this.downloadCSV(Papa.unparse(data));
    });
  },

  exportExampleRecord() {
    Meteor.call('exportExampleRecords', (error, data) => {
        if (error) {
          alert(error);
          return;
        }
        this.downloadCSV(Papa.unparse(data));
    });
  },

  downloadCSV (csv) {
    // TODO refatorar forma de fazer essa exportacao
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
    a.download = "records.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

Template.exportercurricularstructure.helpers({
  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }):null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure
  }
});


Template.exporterRecords.helpers({
  records: function () {
    return Records.find();
  },
  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }):null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedAcademicRecords

  }
});
Template.exporterRecords.events({
  "click .js-export": function () {
    Exporter.exportAllRecord();
  }
});

Template.exporterexamplerecords.events({
  "click .js-exporterexamplerecords": function () {
    Exporter.exportExampleRecord();
  }
});

export default Exporter;
