import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {check} from 'meteor/check';

import './uploadcurricularstructure.html'

Meteor.subscribe('disciplines');

Template.uploadcurricularstructure.onCreated(() => {
  Template.instance().uploading = new ReactiveVar( false );
});


Template.uploadcurricularstructure.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  'listaDisiciplinas': function(){
          var currentUserId = Meteor.userId();
          return Disciplines.find();
          //console.log(D)
          //return Disciplines.find(({ createdBy: currentUserId },
            //                      { sort: {codigo: 1, nome: 1} }));
  }
});


Template.uploadcurricularstructure.events({

  'change [name="uploadCSV"]': function ( event, template ) {

    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      error(err, file, inputElem, reason) {
        template.uploading.set( false );
        Bert.alert('This is not a csv valid file.', 'danger', 'growl-top-right' );
      },
      complete( results, file ) {

        var data = results.data;
        var schema = new SimpleSchema({
          codigo: {
            type: Number,
            min: 90000001,
            max: 99999999,
            label: "Código da disciplina"},
          nome: {
            type: String,
            label: "Nome da disciplina"
          },
          creditos: {
            type: Number,
            min: 2,
            max: 6,
            label: "Créditos da disciplina"
          },
          semestre: {
            type: Number,
            min: 1,
            max: 10,
            label: "Semestre da disciplina"
          },
          prereq: {
            type: String,
            label: "Pré-requisitos da disciplina"
          }
        });

        try {
          check(data, Array);
          data.forEach(item => {
            schema.validate(item);
          });

        } catch (err) {
          template.uploading.set( false );
          Bert.alert('This file is not a valid csv file: ' + err.reason,
            'danger', 'growl-top-right' );
          return;
        }

        Meteor.call('uploadCurricularStruture', data, (error, response) => {
          if (error) {
            console.log(error.reason);
            Bert.alert( 'Unknown internal error.', 'danger', 'growl-top-right' );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
          }
        });

      }
    });

  }

});
