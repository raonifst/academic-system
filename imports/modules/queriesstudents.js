import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {CoursesDAG} from "../../lib/classes/coursesdag";
import {incrementYearSemester} from "./auxiliar";

export function getStudentBy(key) {
  return Records.findOne({ $or: [{ rga: parseInt(key, 10) }, { nome: key }] });
}

export function getSuggestionsToStudent() {
  // TODO realizar testes com esta função no card de disciplinas na homepage
  const currentUser = Meteor.user();
  var recordsList, recordsDoneList, coursesNotDone, studentCoursesGraph, suggestions;
  const student = getStudentBy(Session.get('courseName'));

  if (!currentUser || !student)
    return [{}];

  recordsList = Records.find({ nome: student.nome, situacao: "AP" }).fetch();
  recordsDoneList = recordsList.map(function (o) { return o.disciplina });
  coursesNotDone = Courses.find({ nome: { $nin: recordsDoneList } }).fetch();

  try {
    studentCoursesGraph = new CoursesDAG(coursesNotDone, false);
  } catch (e) {
    return [{}];
  }
  suggestions = studentCoursesGraph.groupBy();
  for (var i = 0; i < suggestions.length; i++) {
    const ys = incrementYearSemester(currentUser.currentYear, currentUser.currentSemester, key - 1);
    suggestions[i] = { period: ys.year + "/" + ys.semester, list: suggestions[i] };
  }
  return suggestions; // Array de grupos de disciplinas e respectivos ano/semestre
}

coursesAtStudentSemester =  function coursesAtStudentSemester() {
    let student = getStudentBy(Session.get('courseName'));
    if (!student)
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
Template.instance().countCoursesAtStudentSemester.set(v.length);
return v;

}
