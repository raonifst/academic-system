import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

Template.disciplinesSearchs.onCreated(() => {

  Template.instance().countStudentsWhoMustEnrollInACourse         = new ReactiveVar(0);
  Template.instance().countStudentsWhoHavePrerequisitesForACourse = new ReactiveVar(0);
  Template.instance().countStudentsAtCourseSemester = new ReactiveVar(0);
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
          { key: 'codigo', label: 'Código' , cellClass: 'col-md-4'},
          { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'}
        ]
    };
},

  studentsAtCourseSemester: function() {
      let courseName = Session.get('courseName');
      let semesterCourse;
      let courseId;
      Template.instance().countStudentsAtCourseSemester.set(0);
      if(courseName == '')
        return [{}];

        semesterCourse=Courses.findOne({nome: courseName},{fields:{semestre:1}});
        //Template.instance().semesterSearch.set(semesterCourse.semestre);
        //Template.search.__helpers.get('searchStudentBySemester').call();
        console.log(semesterCourse.semestre);
        let res;
        if(semesterCourse.semestre>1){
          res = searchStudentBySemesterForHelper(semesterCourse.semestre);
          Template.instance().countStudentsAtCourseSemester.set(res.length);
          return res;
        }else return [{}]
  },

  coursesAtStudentSemester: function() {
      let studentKey = Session.get('courseName');//devera ser alterado
      let cod = parseInt(studentKey,10);
      let student=Records.findOne({rga:cod});
      if(student==null)
          return [{}];

      let studentSem=parseInt(calcCourseSemesterByStudent(student.rga),10);
      if(studentSem<2||studentSem>10)
        return [{}];

      let discipline = Courses.find({createdBy:Meteor.userId(),semestre:studentSem});
      if(discipline ==null)
        return[{}];

      let map={};
      let disc;
      discipline.forEach(item=>{
         if(!map[item.codigo]){
           map[item.codigo]={
               codigo: item.codigo,
               nome:item.nome
           }
         }

      });
    let v =[{}];
    v = hash2array(map);
  return v;
},

  studentsWhoHavePrerequisitesForACourse: function() {
    let courseName = Session.get('courseName');
    if(courseName != '') {
      let candidates = auxStudentsWhoMustEnrollInACourse(courseName);
      let prereq = Courses.findOne({nome: courseName}, {fields: {prereq: 1}});
      prereq = prereq == null?[]:prereq.prereq;
    var map = {};
    console.log(prereq)
    candidates.forEach(function(student) {
      let count = 0;
      prereq.forEach(function(code) {

        courseName = Courses.findOne({_id: code}, {fields: {nome: 1}}).nome;
        let exist = Records.findOne({rga: student.rga, disciplina: courseName, situacao: "AP"}, {_id: 0});
        if(exist)
          count = count + 1;
      });

      if(count == prereq.length) {
        map[student.rga] = {
           nome: student.nome,
           rga: student.rga
       }
      }
    });
      let result = hash2array(map);
      Template.instance().countStudentsWhoHavePrerequisitesForACourse.set(result.length);
      return result;
    }
    else { Template.instance().countStudentsWhoHavePrerequisitesForACourse.set(0);return [{}]};
  },

  studentsWhoMustEnrollInACourse: function() {

      let courseName = Session.get('courseName');

      if(courseName == '') {
        Template.instance().countStudentsWhoMustEnrollInACourse.set(0);
        return [{}];
      }

      let result = auxStudentsWhoMustEnrollInACourse(courseName);
      Template.instance().countStudentsWhoMustEnrollInACourse.set(result.length);
      return result;
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
