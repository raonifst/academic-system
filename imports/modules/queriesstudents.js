import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

coursesAtStudentSemester =  function coursesAtStudentSemester() {
    let studentKey = Session.get('courseName');//devera ser alterado
    let cod = parseInt(studentKey,10);
    let student=Records.findOne({rga:cod});
    //Template.instance().countCoursesAtStudentSemester.set(0);
    if(student==null){
      studentNome = Session.get('courseName');//devera ser alterado
      student=Records.findOne({nome:studentNome});
    }
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
Template.instance().countCoursesAtStudentSemester.set(v.length);
return v;

}
