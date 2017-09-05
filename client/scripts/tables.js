import Courses from '../../imports/api/collections/courses';
import Records from '../../imports/api/collections/records';
import { Session } from 'meteor/session';

/*-------------------- TABLE CURRICULAR STRUCTURE --------------------*/
Template.tablecurricularstructure.helpers({
  listaDisiciplinas() {
    return Courses.find();
  },

  uploaded() {
    const currentUser = Meteor.user();
    return currentUser && currentUser.uploadCoursesFlag;
  },

  settings() {
    i18n.setLanguage('pt-br');
    return {
      rowsPerPage: 10,
      showFilter: true,
      /*noDataTmpl: Template.error404,*/
      fields: [
        { key: 'codigo',    label: 'Codigo',                    headerClass: 'titleheader',
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza'; }},

        { key: 'nome',      label: 'Nome',                      headerClass: 'titleheader', /*tmpl: Template.discplina,*/
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza'; }},

        { key: 'creditos',  label: 'Créditos',                  headerClass: 'titleheader',
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza num'; return 'num'}},

        { key: 'perc_ap',   label: 'Aprovações',                headerClass: 'titleheader', tmpl: Template.percap,
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza num'; return 'num' },
          fn(value, object, key) { return 100*object.perc_ap; }},

        { key: 'perc_reic', label: 'Reincidencia',              headerClass: 'titleheader', tmpl: Template.percreic,
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza num'; return 'num' },
          fn(value, object, key) { return 100*object.perc_reic; }},

        /*{ key: 'perc_reic', label: 'Aprovado pela segunda vez', headerClass: 'titleheader', tmpl: Template.percreic,
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza num'; return 'num' },
          fn(value, object, key) { return 100*object.perc_reic; }},*/

        { sortable: false,  label: '',                          headerClass: 'titleheader', tmpl: Template.editing,
          cellClass(value, object) { if (!(object.semestre%2)) return 'cinza'; }},
      ]
    };
  }
});

Template.tablecurricularstructure.events({
  'click .export': function() {
    Bert.alert("[Courses] Criar método para exportar dados da tabela", 'warning', 'growl-top-right');
  }
});

/*-------------------- TABLE ACADEMIC RECORDS --------------------*/
Template.tableacademicrecords.helpers({
  listaAlunos() {
    return Records.find();
  },

  uploaded() {
    const currentUser = Meteor.user();
    return currentUser && currentUser.uploadRecordsFlag;
  },

  settings() {
    i18n.setLanguage('pt-br');
    return {
      rowsPerPage: 10,
      showFilter: true,
      /*noDataTmpl: Template.error404,*/
      fields: [
        { key: 'rga',         label: 'RGA',         headerClass: 'titleheader',
          cellClass(value, object) { if (Session.get('hover') == object._id) return 'hover'; },
          sortOrder: 1, sortDirection: -1},

        { key: 'nome',        label: 'Nome',        headerClass: 'titleheader',
          cellClass(value, object) { if (Session.get('hover') == object._id) return 'hover'; }},

        { key: 'disciplina',  label: 'Disciplina',  headerClass: 'titleheader',
          cellClass(value, object) { if (Session.get('hover') == object._id) return 'hover'; }},

        { key: 'situacao',    label: 'Situação',    headerClass: 'titleheader',
          cellClass(value, object) { if (Session.get('hover') == object._id) return 'hover num'; return 'num'; }},

        {                     label: 'Semestre',    headerClass: 'titleheader', tmpl: Template.anosemestre,
          cellClass(value, object) { if (Session.get('hover') == object._id) return 'hover num'; return 'num'; },
          fn(value, object, key) { return 10*object.ano+object.semestre; },
          sortOrder: 0, sortDirection: -1 },

        { sortable: false,    label: '', tmpl: Template.editing, headerClass: 'tableicon',
          cellClass(value, object) { if (Session.get('hover') == object._id) return 'hover'; }},
      ]
    };
  }
});

Template.tableacademicrecords.events({
  'click .export': function() {
    Bert.alert("[Records] Criar método para exportar dados da tabela", 'warning', 'growl-top-right');
  }
});

/*-------------------- AÇÕES DENTRO DAS TABELAS --------------------*/
Template.reactiveTable.events({
  'mouseenter .reactive-table tr':function(event) {
    Session.set('hover', this._id);
  },

  'mouseleave .reactive-table tr':function(event) {
    Session.set('hover', 1);
  }
});
