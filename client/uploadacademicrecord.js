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
    template.uploading.set(true);
    Papa.parse(event.target.files[0], {
      header: true,
      complete(results) {
        Meteor.call('updateAcademicRecordData', results.data, (error) => {
          if (error) {
            console.log(error.reason);
            return;
          }
          template.uploading.set(false);
          Bert.alert('Upload completado com sucesso!', 'success', 'growl-top-right');
        });
      }
    });
  }
});
