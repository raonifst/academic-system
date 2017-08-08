import {ReactiveVar} from 'meteor/reactive-var';
import {CsvUtils} from '../../imports/utils/csvutils';
import {uploadDataStatus} from "../../imports/utils/status"
import Courses from '../../imports/api/collections/courses'

Template.uploadcurricularstructure.onCreated(() => {
  Template.instance().uploading = new ReactiveVar( false );
});


Template.uploadcurricularstructure.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  'listaDisiciplinas': function(){
    var currentUserId = Meteor.userId();
    return Courses.find();
  },/*
  uploaded: function() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }) : null;
    return user && Users.findOne({ idUser: currentUserId }).courses;
  }
  ,
  */
  settings: function () {
    return {
      rowsPerPage: 10,
      showFilter: true,
      fields: [
        { key: 'codigo', label: 'Codigo' , cellClass: 'col-md-4'},
        { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'},
        { key: 'creditos', label: 'Créditos' , cellClass: 'col-md-4'},
        {key:'perc_ap', label:'Aprovações',cellClass: 'col-md-4' },
        {key:'perc_reic', label:'Reincidencia',cellClass: 'col-md-4' },
        {key:'perc_reic', label:'Aprovado pela segunda vez',cellClass: 'col-md-4' }
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
        console.log(row.data[0]);
        var reg = Courses.parser(row.data[0]);
        try {
          console.log(reg);
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
        console.log(data); // Debug (descomente esta linha)
        // TODO DEVOLVE MINHA ORDENAÇÃO TOPOLÓGICA HUIESAHEIOJSKNJSK
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

  }

});
