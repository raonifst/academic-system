import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './uploadcurricularstructure.html'
import {CsvUtils} from "../imports/utils/csvutils";
import {DGraph} from "../imports/utils/disciplines";


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
  },
  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }) : null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure;
  }
  ,
  settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            fields: [
              { key: 'codigo', label: 'Codigo' , cellClass: 'col-md-4'},
              { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'},
              { key: 'creditos', label: 'Créditos' , cellClass: 'col-md-4'},
              {key:'perc_ap', label:'Porcentagem Aprovacoes',cellClass: 'col-md-4' }
            ]
        };
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
          Bert.alert('Este não é um arquivo CSV válido.', 'danger', 'growl-top-right' );
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
        if (DGraph.hasCycle(data)) {
          Bert.alert('Listas de pré-requisitos contém um ou mais ciclos. Corrija-os e tente' +
            ' novamente!', 'danger', 'growl-top-right');
          template.uploading.set(false);
          return;
        }
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
