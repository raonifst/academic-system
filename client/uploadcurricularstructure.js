import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './uploadcurricularstructure.html'


Meteor.subscribe('disciplines');

Meteor.subscribe('userStats');


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

    var data = [];
    var globalError = false;
    template.uploading.set(true);

    Papa.parse( event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      step(row, parser) {
        var reg = CurricularStructure.parser(row.data[0]);
        try {
          CurricularStructure.schema.validate(reg);
        } catch (err) {
          Bert.alert('Este não é um arquivo CSV válido:' + err.reason, 'danger', 'growl-top-right' );
          globalError = true;
          template.uploading.set(false);
          parser.abort();
        }
        data.push(reg);
      },
      complete() {
        if (globalError)
          return;
        Meteor.call('uploadCurricularStruture', data, (error, results) => {
          if (error)
            Bert.alert('Unknown internal error.', 'danger', 'growl-top-right');
          else {
            switch (results) {
              case 0:
                Bert.alert('Upload completado com sucesso!', 'success', 'growl-top-right');
                break;
              case 1:
                Bert.alert('Upload completado com sucesso! Alguns itens repetidos foram ignorados.',
                  'warning', 'growl-top-right');
                break;
              case 2:
                Bert.alert('Upload parcialmente completado. Itens com erros no campo de' +
                  ' pré-requisitos não foram adicionados. Corrija-os e tente novamente',
                  'warning', 'growl-top-right');
                break;
            }
            Meteor.call('changeUserUploadCurricularStructureFlag');
          }
          template.uploading.set(false);
        });
      }
    });

  }

});
