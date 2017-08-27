import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

studentsWhoMustEnrollInACourse =  function studentsWhoMustEnrollInACourse() {

    let courseName = Session.get('courseName');

    if(courseName == '') {
      Template.instance().countStudentsWhoMustEnrollInACourse.set(0);
      return [{}];
    }

    let result = auxStudentsWhoMustEnrollInACourse(courseName);
    Template.instance().countStudentsWhoMustEnrollInACourse.set(result.length);
    return result;
}

studentsWhoHavePrerequisitesForACourse = function studentsWhoHavePrerequisitesForACourse() {
  let courseName = Session.get('courseName');
  if(courseName != '') {
    let candidates = auxStudentsWhoMustEnrollInACourse(courseName);
    let prereq = Courses.findOne({nome: courseName}, {fields: {prereq: 1}});
    prereq = prereq == null?[]:prereq.prereq;
  var map = {};
  //console.log(prereq)
  candidates.forEach(function(student) {
    let count = 0;
    prereq.forEach(function(code) {

      courseName = Courses.findOne({codigo: code}, {fields: {nome: 1}}).nome;
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
}

studentsAtCourseSemester = function studentsAtCourseSemester() {
    let courseName = Session.get('courseName');
    //console.log(courseName);
    let semesterCourse;
    let courseId;
    Template.instance().countStudentsAtCourseSemester.set(0);
    if(courseName == '')
      return [{}];
      semesterCourse=Courses.findOne({nome: courseName},{fields:{semestre:1}});
      let res;
      if(semesterCourse.semestre>1){
        res = searchStudentBySemesterForHelper(courseName,semesterCourse.semestre);
        Template.instance().countStudentsAtCourseSemester.set(res.length);
        return res;
      }else return [{}]
}

coursesAtStudentSemester = function coursesAtStudentSemester() {
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
}
