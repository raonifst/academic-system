import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import "../../imports/modules/queriescourses";
import "../../imports/modules/queriesstudents";

////////////  CONSULTAS DE DISCIPLINAS /////////////
Template.disciplinesSearchs.onCreated(() => {

  Template.instance().countStudentsWhoMustEnrollInACourse         = new ReactiveVar(0);
  Template.instance().countStudentsWhoHavePrerequisitesForACourse = new ReactiveVar(0);
  Template.instance().countStudentsAtCourseSemester               = new ReactiveVar(0);
});

Template.disciplinesSearchs.helpers({

  isStudent: function() {
    return Template.instance().isStudent.get();
  },

  settings: function () {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { sortable: false, label: Template.tableexport },
            { key: 'rga', label: 'RGA' , cellClass: 'col-md-4'},
            { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'}
          ]
      };
  },

  disciplinesSettings: function () {
    return {
        rowsPerPage: 10,
        showFilter: true,
        fields: [
          { sortable: false, label: Template.tableexport },
          { key: 'codigo', label: 'Código' , cellClass: 'col-md-4'},
          { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'}
        ]
    };
},

  studentsAtCourseSemester: function() {
    return studentsAtCourseSemester();
  },

  coursesAtStudentSemester: function() {
    return coursesAtStudentSemester();
},

  studentsWhoHavePrerequisitesForACourse: function() {
    return studentsWhoHavePrerequisitesForACourse();
  },

  studentsWhoMustEnrollInACourse: function() {
      return studentsWhoMustEnrollInACourse();
  },

  countStudentsWhoMustEnrollInACourse: function() {

    Template.disciplinesSearchs.__helpers.get('studentsWhoMustEnrollInACourse').call();
    return Template.instance().countStudentsWhoMustEnrollInACourse.get();
  },

  countStudentsWhoHavePrerequisitesForACourse: function() {
    Template.disciplinesSearchs.__helpers.get('studentsWhoHavePrerequisitesForACourse').call();
    return Template.instance().countStudentsWhoHavePrerequisitesForACourse.get();
  },

  countStudentsAtCourseSemester: function() {
      Template.disciplinesSearchs.__helpers.get('studentsAtCourseSemester').call();
      return Template.instance().countStudentsAtCourseSemester.get();
  }

});

Template.disciplinesSearchs.onRendered(function(){
  accordion();
});

Template.disciplinesSearchs.events({
  'click .export': function() {
    console.log("Tentando Exportar");
  }
})

////////////  CONSULTAS DE ESTUDANTES /////////////
Template.studentsSearchs.helpers({
  disciplinesSettings: function () {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { sortable: false, label: Template.tableexport },
            { key: 'codigo', label: 'Código' , cellClass: 'col-md-4'},
            { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'}
          ]
      };
  },

  coursesAtStudentSemester:function(){
    let aux = coursesAtStudentSemester();
    return coursesAtStudentSemester();
  }
});

Template.studentsSearchs.events({
  'click .export': function() {
    console.log("alguma coisa");
    if(this.type=='a'){
      console.log("Tentando Exportar");
    }
  }
})
