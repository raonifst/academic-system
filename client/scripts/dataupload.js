import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import {Meteor} from "meteor/meteor";
import {ReactiveVar} from "meteor/reactive-var";

import {uploadDataStatus} from "../../imports/modules/status";
import {CoursesDAG} from "../../lib/classes/coursesdag";
import {AcademicRecord} from "../../lib/classes/academicrecord";
import {Course} from "../../lib/classes/course";
import BertMsg from "../../imports/modules/bertmessages";

/*-------------------- UPLOAD CURRICULAR STRUCTURE --------------------*/
Template.uploadcurricularstructure.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadcurricularstructure.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  wasAcademicRecordsDeleted(){
      let  count =Records.find({createdBy:Meteor.userId()}).count();
    return !count;
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
        try {
          Courses.validateRegistry(row.data[0]);
          const codigo    = row.data[0].codigo;
          const nome      = row.data[0].nome;
          const creditos  = row.data[0].creditos;
          const semestre  = row.data[0].semestre;
          const prereq    = row.data[0].prereq;
          const courseRegistry = new Course(codigo, nome, creditos, semestre, prereq);
          courseRegistry.convertPrereqToArray();
          data.push(courseRegistry);
        } catch (err) {
          Bert.alert(BertMsg.courses.errorInvalidCsv, 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
      },
      complete() {
        if (globalError)
          return;
        if (!data || data.length == 0) {
          Bert.alert(BertMsg.courses.errorEmptyCourses, 'danger', 'growl-top-right');
          return;
        }
        try {
          var g = new CoursesDAG(data);
          //console.log(g); // Debug (descomente esta linha)
        } catch (e) {
          Bert.alert(e.reason, 'danger', 'growl-top-right');
          return;
        }
        Meteor.call('uploadCoursesData', data, (error, results) => {
          if (error)
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          else {
            switch (results) {
              case uploadDataStatus.SUCCESS:
                Bert.alert(BertMsg.courses.successUpload, 'success', 'growl-top-right');
                break;
              case uploadDataStatus.WARNINGS:
                Bert.alert(BertMsg.courses.warningUpload, 'warning', 'growl-top-right');
                break;
              case uploadDataStatus.ERROR:
                Bert.alert(BertMsg.courses.errorUpload, 'warning', 'growl-top-right');
                break;
            }
          }
          Meteor.call('changeUploadCoursesFlag');
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
        try {
          Records.validateRegistry(row.data[0]);
          const rga         = row.data[0].rga;
          const nome        = row.data[0].nome;
          const disciplina  = row.data[0].disciplina;
          const situacao    = row.data[0].situacao;
          const ano         = row.data[0].ano;
          const semestre    = row.data[0].semestre;
          const recordRegistry = new AcademicRecord(rga, nome, disciplina, situacao, ano, semestre);
          data.push(recordRegistry);
        } catch (err) {
          Bert.alert(BertMsg.records.errorInvalidCsv, 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
      },
      complete() {
        if (globalError)
          return;
        if (!data || data.length == 0) {
          Bert.alert(BertMsg.records.errorEmptyRecords, 'danger', 'growl-top-right');
          return;
        }
        Meteor.call('updateRecordsData', data, (error, results) => {
          if (error)
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          else {
            switch (results) {
              case uploadDataStatus.SUCCESS:
                Bert.alert(BertMsg.records.successUpload, 'success', 'growl-top-right');
                break;
              case uploadDataStatus.WARNINGS:
                Bert.alert(BertMsg.records.warningUpload, 'warning', 'growl-top-right');
                break;
              case uploadDataStatus.ERROR:
                Bert.alert(BertMsg.records.errorUpload, 'warning', 'growl-top-right');
                break;
            }
          }
          Meteor.call('changeCurrentSemester', 0);
          Meteor.call('changeUploadRecordsFlag');
          template.uploading.set(false);
        });
      }
    });
    event.target.value = '';
  }
});
