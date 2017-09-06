import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {CoursesDAG} from "../../lib/classes/coursesdag";
import {incrementYearSemester} from "./auxiliar";

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function getStudentBy(key) {
  return Records.findOne({ $or: [{ rga: parseInt(key, 10) }, { nome: key }] });
}

function getSuggestionsToStudentRec(maxCredits, option, coursesDone,
                                    suggestions, index) {
  var coursesDoneInSemester;
  var coursesNotDone;
  var studentCoursesGraph;

  if (index >= 0) {
    // Retorna um array de objetos das disciplinas feitas no agrupamento anterior
    coursesDoneInSemester = deepCopy(suggestions[index]);
    // Concatena-o ao array de disciplinas já feitas
    coursesDoneInSemester.forEach(c => {
      coursesDone.push(c);
    });
  }
  coursesNotDone = Courses.find({ codigo: { $nin: coursesDone }}).fetch();
  if (coursesNotDone.length > 0) {
    try {
      studentCoursesGraph = new CoursesDAG(coursesNotDone, false);
      suggestions[++index] = studentCoursesGraph.groupTopCourses(maxCredits, option).map(function (o) {
        return o.codigo;
      });
      getSuggestionsToStudentRec(maxCredits, option, coursesDone, suggestions, index);
    } catch (e) {
      // Não faz nada
    }
  }
}

export function getSuggestionsToStudent(maxCredits, option) {
  var recordsList, coursesDone;
  var suggestions = [[]];
  const currentUser = Meteor.user();
  const student = getStudentBy(Session.get('query'));

  if (!currentUser || !student)
    return [];

  // Retorna o nome das disciplinas não realizadas pelo aluno
  recordsList = deepCopy(Records.find({ nome: student.nome, situacao: "AP" }).fetch());
  if (!recordsList)
    return [];
  coursesDone = recordsList.map(function (o) { return o.disciplina });
  // Retorna o código das disciplinas realizadas pelo aluno
  coursesDone = Courses.find({ nome: { $in: coursesDone } }).fetch();
  coursesDone = coursesDone.map(function (o) { return o.codigo });

  getSuggestionsToStudentRec(maxCredits, option, coursesDone, suggestions, -1);

  for (var i = 0; i < suggestions.length; i++) {
    const ys = incrementYearSemester(currentUser.currentYear, currentUser.currentSemester, i);
    suggestions[i] = Object.freeze({
      period: ys.year + "/" + ys.semester,
      list: Courses.find({ codigo: { $in: suggestions[i] } }).fetch()
    });
  }
  return suggestions; // Array de grupos de disciplinas e respectivos ano/semestre
}

coursesAtStudentSemester =  function coursesAtStudentSemester() {
    let student = getStudentBy(Session.get('query'));
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

};
