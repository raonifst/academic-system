import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import Exporter from "../../imports/modules/exporter";

import "../../imports/modules/queries";
import "../../imports/modules/queriescourses";
import "../../imports/modules/queriesstudents";

/*-------------------- CONSULTAS DE DISCIPLINAS --------------------*/
Template.disciplinesSearchs.onCreated(() => {
  Template.instance().countStudentsWhoMustEnrollInACourse         = new ReactiveVar(0);
  Template.instance().countStudentsWhoHavePrerequisitesForACourse = new ReactiveVar(0);
  Template.instance().countStudentsAtCourseSemester               = new ReactiveVar(0);
});

Template.disciplinesSearchs.helpers({
  /*isStudent: function() {
    return Template.instance().isStudent.get();
  },*/

  settings() {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { sortable: false, label: Template.tableexport },
            { key: 'rga',      label: 'RGA',  headerClass: 'titleheader2' },
            { key: 'nome',     label: 'Nome', headerClass: 'titleheader2' }
          ]
      };
  },

  studentsAtCourseSemester(){
    return studentsAtCourseSemester();
  },

  studentsWhoHavePrerequisitesForACourse() {
    return studentsWhoHavePrerequisitesForACourse();
  },

  studentsWhoMustEnrollInACourse() {
      return studentsWhoMustEnrollInACourse();
  },

  countStudentsWhoMustEnrollInACourse() {
    Template.disciplinesSearchs.__helpers.get('studentsWhoMustEnrollInACourse').call();
    return Template.instance().countStudentsWhoMustEnrollInACourse.get();
  },

  countStudentsWhoHavePrerequisitesForACourse() {
    Template.disciplinesSearchs.__helpers.get('studentsWhoHavePrerequisitesForACourse').call();
    return Template.instance().countStudentsWhoHavePrerequisitesForACourse.get();
  },

  countStudentsAtCourseSemester() {
      Template.disciplinesSearchs.__helpers.get('studentsAtCourseSemester').call();
      return Template.instance().countStudentsAtCourseSemester.get();
  }
});

Template.disciplinesSearchs.events({
  'click .export': function() {
    let collection1 = studentsWhoMustEnrollInACourse();
    let collection2 = studentsWhoHavePrerequisitesForACourse();
    let collection3 = studentsAtCourseSemester();
    Exporter.Qcourses ((collection1), 'Consulta_Disciplinas_1');
    Exporter.Qcourses ((collection2), 'Consulta_Disciplinas_2');
    Exporter.Qcourses ((collection3), 'Consulta_Disciplinas_3');
  }
});

/*-------------------- CONSULTAS DE ESTUDANTES --------------------*/

Template.studentsSearchs.onCreated(() => {
  Template.instance().countCoursesAtStudentSemester= new ReactiveVar(0);
});

Template.studentsSearchs.helpers({
  settings() {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { sortable: false, label: Template.tableexport },
            { key: 'codigo',   label: 'Código', headerClass: 'titleheader2' },
            { key: 'nome',     label: 'Nome',   headerClass: 'titleheader2' }
          ]
      };
  },

  coursesAtStudentSemester(){
    return coursesAtStudentSemester();
  },

  countCoursesAtStudentSemester() {
      Template.studentsSearchs.__helpers.get('coursesAtStudentSemester').call();
      return Template.instance().countCoursesAtStudentSemester.get();
  }

});

Template.studentsSearchs.events({
  'click .export': function() {
    let collection = coursesAtStudentSemester();
    Exporter.Qstudents ((collection), 'Consulta_Alunos');
  }
});
