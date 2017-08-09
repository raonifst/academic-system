import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import {ReactiveVar} from "meteor/reactive-var";
import {CsvUtils} from "../../imports/modules/csvutils";
import {uploadDataStatus} from "../../imports/modules/status";
import {CoursesGraph, validateCoursesGraph} from "../../imports/modules/coursesgraph";

/*--------------- UPLOAD CURRICULAR STRUCTURE ---------------*/

Template.uploadcurricularstructure.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadcurricularstructure.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
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
        //console.log(row.data[0]);
        var reg = Courses.parser(row.data[0]);

        try {
          //console.log(reg);
          Courses.schema.validate(reg);
        } catch (err) {
          Bert.alert('Este não é um arquivo CSV válido: ' + err.reason, 'danger', 'growl-top-right' );
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
          var g = new CoursesGraph(data);
          validateCoursesGraph(g);
        } catch (e) {
          Bert.alert(e, 'danger', 'growl-top-right');
          return;
        }
        Meteor.call('uploadCurricularStruture', data, (error, results) => {
          if (error)
            Bert.alert('Unknown internal error.', 'danger', 'growl-top-right');
          else {
            switch (results) {
              case uploadDataStatus.SUCCESS:
                Bert.alert('Upload completado com sucesso!', 'success', 'growl-top-right');
                break;
              case uploadDataStatus.WARNINGS:
                Bert.alert('Upload completado com sucesso! Alguns itens repetidos foram ignorados.',
                  'warning', 'growl-top-right');
                break;
              case uploadDataStatus.ERROR:
                Bert.alert('Upload parcialmente completado. Itens com erros no campo de' +
                  ' pré-requisitos não foram adicionados. Corrija-os e tente novamente',
                  'warning', 'growl-top-right');
                break;
            }
            //Meteor.call('changeUserUploadCurricularStructureFlag');
          }
          template.uploading.set(false);
        });
      }
    });
    event.target.value = '';
  },
});

/*--------------- UPLOAD ACADEMIC RECORDS ---------------*/
Template.uploadacademicrecord.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadacademicrecord.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
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
          Bert.alert('Este não é um arquivo CSV válido.', 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
        data.push(peg);
      },

      complete() {
        if (globalError)
          return;
        //console.log(data); // Debug (descomente esta linha)
        Meteor.call('updateAcademicRecordData', data, (error, results) => {
          if (error)
            Bert.alert('Unknown internal error.', 'danger', 'growl-top-right');
          else {
            if (results == 1)
              Bert.alert('Upload completado com sucesso! Alguns itens repetidos foram ignorados.',
                'warning', 'growl-top-right');
            else if (results==2) {
              Bert.alert('Upload completado com sucesso! Alguns disciplinas que não estão na estrutura foram ignoaradas',
                'warning', 'growl-top-right');
            }
            else
              Bert.alert('Upload completado com sucesso!', 'success', 'growl-top-right');
            Meteor.call('changeCurrentSemester', data[data.length - 1], 0);
            Meteor.call('changeUserUploadAcademicRecordsFlag');
          }
          template.uploading.set(false);
        });
      }
    });
    event.target.value = '';
  },
});
