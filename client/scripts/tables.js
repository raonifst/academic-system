import Courses from '../../imports/api/collections/courses';
import Records from '../../imports/api/collections/records';
import { Session } from 'meteor/session';

/*-------------------- TABLE CURRICULAR STRUCTURE --------------------*/
Template.tablecurricularstructure.helpers({
  listaDisiciplinas() {
    return Courses.find();
  },

  uploaded() {
    const currentUser = Meteor.userId();
    if (currentUser)
      return Meteor.users.findOne({_id: currentUser}).uploadCoursesFlag;
    return false;
  },

  settings() {
    i18n.setLanguage('pt-br');
    return {
      rowsPerPage: 10,
      showFilter: true,
      /*noDataTmpl: Template.error404,*/
      fields: [
        { key: 'codigo',    label: 'Codigo',                    cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
        { key: 'nome',      label: 'Nome',                      cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}, tmpl: Template.discplina},
        { key: 'creditos',  label: 'Créditos',                  cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
        { key: 'perc_ap',   label: 'Aprovações',                cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
        { key: 'perc_reic', label: 'Reincidencia',              cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
        { key: 'perc_reic', label: 'Aprovado pela segunda vez', cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
        { sortable: false,  label: '', tmpl: Template.editing,  cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
        { sortable: false,  label: '', tmpl: Template.apagar,  cellClass(value, object) { if (object.semestre%2) return 'pintarpar';}},
      ]
    };
  },

  'selectedLine': function(){
      return selected;
  },
});

Template.tablecurricularstructure.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();
    console.log(event.target.className);
    Session.set('editcourse', this);
    if (event.target.className == 'material-icons edit')
      console.log(this._id, this.nome+'\nSó Levar para o formulário');
    if (event.target.className == 'material-icons rmv')
      console.log(this._id, this.nome+'\nSó Apagar');
   },
});

/*-------------------- TABLE ACADEMIC RECORDS --------------------*/
Template.tableacademicrecords.helpers({
  listaAlunos() {
    return Records.find();
  },

  uploaded() {
    const currentUser = Meteor.userId();
    if (currentUser)
      return Meteor.users.findOne({ _id: currentUser }).uploadRecordsFlag;
    return false;
  },

  settings() {
    i18n.setLanguage('pt-br');
    return {
      rowsPerPage: 10,
      showFilter: true,
      fields: [
        { key: 'rga',         label: 'RGA',         cellClass: 'col-md-4' },
        { key: 'nome',        label: 'Nome',        cellClass: 'col-md-4' },
        { key: 'disciplina',  label: 'Disciplina',  cellClass: 'col-md-4' },
        { key: 'situacao',    label: 'Situação',    cellClass: 'col-md-4' },
        { key: 'ano',         label: 'Ano',         cellClass: 'col-md-4' },
        { key: 'semestre',    label: 'Semestre',    cellClass: 'col-md-4' },
        { sortable: false,    label: '',            cellClass: 'col-md-4', tmpl: Template.editing },
      ]
    };
  },
});

Template.tableacademicrecords.events({
  'click .reactive-table tbody tr': function (event) {
     event.preventDefault();
     Session.set('editrecord', this);
     if (event.target.className == 'material-icons edit')
       console.log(this._id, this.nome+'\nSó Levar para o formulário');
   },
});
