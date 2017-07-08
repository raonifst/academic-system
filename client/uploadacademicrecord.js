import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './uploadacademicrecord.html';

Meteor.subscribe('record');

Template.uploadacademicrecord.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadacademicrecord.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  'listaAlunos': function(){
    
    return Records.find();
    //console.log(D)
    //return Disciplines.find(({ createdBy: currentUserId },
    //                      { sort: {codigo: 1, nome: 1} }));
  }
});

Template.uploadacademicrecord.events({

  'change [name="uploadCSV"]'(event, template) {

    var data = [];
    var globalError = false;
    template.uploading.set(true);

    Papa.parse( event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step(row, parser) {
        try {
          SchemaHistRecords.validate(row.data[0]);
        } catch (err) {
          Bert.alert('Este não é um arquivo CSV válido.', 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
        data.push(row.data[0]);
      },
      complete() {
        if (globalError)
          return;
        Meteor.call('updateAcademicRecordData', data, (error, results) => {
          if (error)
            Bert.alert('Unknown internal error.', 'danger', 'growl-top-right');
          else if (results == 1)
            Bert.alert('Upload completado com sucesso! Alguns itens repetidos foram ignorados.',
              'warning', 'growl-top-right');
          else
            Bert.alert('Upload completado com sucesso!', 'success', 'growl-top-right');
          template.uploading.set(false);
        });
      }
    });

  }

});
