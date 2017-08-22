import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from "meteor/reactive-var";

import { CsvUtils } from "../../imports/modules/csvutils";
import { uploadDataStatus } from "../../imports/modules/status";
import { CoursesDAG } from "../../imports/modules/coursesgraph";
import { msgUploadCourses, msgUploadRecords } from "../../imports/modules/bertmessages";

/*-------------------- UPLOAD CURRICULAR STRUCTURE --------------------*/
Template.uploadcurricularstructure.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadcurricularstructure.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },

  uploaded() {
    const currentUser = Meteor.user();
    if (currentUser)
      if (!currentUser.uploadCoursesFlag)
        Bert.alert("É necessário fazer upload da Estrutura Curricular", 'warning', 'growl-top-right');
  }
});

Template.uploadcurricularstructure.events({
  'change .uploadCSV': function(event, template) {
    var data = [];
    var globalError = false;
    template.uploading.set(true);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,

      step(row, parser) {
        var reg = Courses.parser(row.data[0]);
        try {
          Courses.schema.validate(reg);
        } catch (err) {
          Bert.alert(msgUploadCourses.msgErrorInvalidCsv, 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
        reg.prereq = CsvUtils.prereqStringToArray(reg.prereq);
        data.push(reg);
      },

      complete() {
        if (globalError)
          return;
        //console.log(data); // Debug (descomente esta linha)
        try {
          var g = new CoursesDAG(data);
          //console.log(g.gMap); // Debug (descomente esta linha)
        } catch (e) {
          Bert.alert(e.reason, 'danger', 'growl-top-right');
          return;
        }
        Meteor.call('uploadCoursesData', data, (error, results) => {
          if (error)
            Bert.alert('Unknown internal error.', 'danger', 'growl-top-right');
          else {
            switch (results) {
              case uploadDataStatus.SUCCESS:
                Bert.alert(msgUploadCourses.msgSuccessUpload, 'success', 'growl-top-right');
                break;
              case uploadDataStatus.WARNINGS:
                Bert.alert(msgUploadCourses.msgWarningUpload, 'warning', 'growl-top-right');
                break;
              case uploadDataStatus.ERROR:
                Bert.alert(msgUploadCourses.msgErrorsUpload, 'warning', 'growl-top-right');
                break;
            }
            Meteor.call('changeUploadCoursesFlag');
          }
          template.uploading.set(false);
        });
      }
    });
    event.target.value = '';
  }
});

/*-------------------- UPLOAD ACADEMIC RECORDS --------------------*/
Template.uploadacademicrecord.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadacademicrecord.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },

  uploaded() {
    const currentUser = Meteor.user();
    if (currentUser)
      if (!currentUser.uploadRecordsFlag)
        Bert.alert("É necessário fazer upload do Histórico Acadêmico", 'warning', 'growl-top-right');
  }
});

Template.uploadacademicrecord.events({
  'change .uploadCSV': function(event, template) {
    var data = [];
    var globalError = false;
    template.uploading.set(true);

    Papa.parse( event.target.files[0], {
      header: true,
      skipEmptyLines: true,

      step(row, parser) {
        var peg = Records.parser(row.data[0]);
        try {
          Records.schema.validate(peg);
        } catch (err) {
          Bert.alert(msgUploadRecords.msgErrorInvalidCsv, 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
        data.push(peg);
      },

      complete() {
        if (globalError) return;

        //console.log(data); // Debug (descomente esta linha)
        Meteor.call('updateRecordsData', data, (error, results) => {
          if (error)
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          else {
            switch (results) {
              case uploadDataStatus.SUCCESS:
                Bert.alert(msgUploadRecords.msgSuccessUpload, 'success', 'growl-top-right');
                break;
              case uploadDataStatus.WARNINGS:
                Bert.alert(msgUploadRecords.msgWarningUpload, 'warning', 'growl-top-right');
                break;
              case uploadDataStatus.ERROR:
                Bert.alert(msgUploadRecords.msgErrorsUpload, 'warning', 'growl-top-right');
                break;
            }
            Meteor.call('changeCurrentSemester', 0);
            Meteor.call('changeUploadRecordsFlag');
          }
          template.uploading.set(false);
        });
      }
    });
    event.target.value = '';
  }
});
