import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import "../../imports/modules/queries";
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

Template.studentsSearchs.helpers({

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
  coursesAtStudentSemester:function(){
      let studentKey = Session.get('courseName');//devera ser alterado
      let cod = parseInt(studentKey,10);
      let student=Records.findOne({rga:cod});
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
  return v;
}
});
