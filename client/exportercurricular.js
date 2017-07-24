import {Meteor} from 'meteor/meteor';

import './exporter.html'


const ExporterCurricular = {
  exportAllCurricular() {
    Meteor.call("exportAllCurricular", (error, data) => {
      if (error) {
        alert(error);
        return;
      }
      this.downloadCurricularCSV(Papa.unparse(data));
    });
  },

  downloadCurricularCSV (csv) {
    // TODO refatorar forma de fazer essa exportacao
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
    a.download = "curricular.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

Template.exportercurricularstructure.events({
  "click .js-exportcurricular": function () {
    ExporterCurricular.exportAllCurricular();
  }
});
Template.exportercurricularstructure.helpers({
  curricular: function () {
    return CurricularStructure.find();
  },
  disciplina: function () {
    return Disciplines.find();
  }
});

export default ExporterCurricular;
