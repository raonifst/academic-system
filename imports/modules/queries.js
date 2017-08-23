import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import {Meteor} from 'meteor/meteor';

hash2array = function hash2array(map) {
  let array = [];

  Object.keys(map).forEach(function(key) {
    array.push(map[key]);
  });
  return array;
}

listOfStudents = function listOfStudents() {
  let map = {};

  Records.find({},{fields:{rga:1, nome: 1}}).forEach(
        function (student) {
          if(!map[student.rga]) {
             map[student.rga] = {
                value: student.nome,
              data: student.rga
              }
    }
  });
  return hash2array(map);
}


/*Funcao auxiliar para queries*/
auxStudentsWhoMustEnrollInACourse = function auxStudentsWhoMustEnrollInACourse(courseName) {

    let studentsApprovedInCourse = [];
    Records.find({disciplina: courseName, situacao: "AP"}, {_id: 0}).forEach(
                  function(rec){studentsApprovedInCourse.push(rec.rga)
                });
    var map = {};

    Records.find( { 'rga': {'$nin': studentsApprovedInCourse}}, { sort: { rga: 1 } } ).forEach(
                   function(rec){
                     if(!map[rec.rga]) {
                        map[rec.rga] = {
                           nome: rec.nome,
                           rga: rec.rga
                       }
                     }
                   });
    return hash2array(map);
}



searchStudentBySemesterForHelper = function searchStudentBySemesterForHelper(courseName,semester){
  //console.log("searchStudentBySemesterForHelper dentro de queries.js");
   var asx=calculateSem(parseInt(semester,10));
   if(asx==null){
     return [{}];
   }
   var searchKey = parseInt(String(asx.year)+String(asx.semester));
   let studentsApprovedInCourse =[];
   var map ={};
    Records.find({createdBy:Meteor.userId(),disciplina: courseName, situacao: "AP"}, {_id: 0}).forEach(
                  function(rec){studentsApprovedInCourse.push(rec.rga)
                });

   Records.find( { 'rga': {'$nin': studentsApprovedInCourse}}, { sort: { rga: 1 } } ).forEach(
                  function(rec){
                    let itemKey=Math.floor((parseInt(rec.rga))/Math.pow(10,7));
                    if(!map[rec.rga] && itemKey === searchKey) {
                       map[rec.rga] = {
                          nome: rec.nome,
                          rga: rec.rga
                      }
                    }
                  });

   return hash2array(map);
}


calculateSem = function calculateSem(semester) {
 var atualkey=getAtualSem();
 var cYear;
 var cSemester;
 if(atualkey!=null){
   cYear = parseInt(atualkey.year);
   cSemester = parseInt(atualkey.semester);
   const sem  = parseInt(semester,10);
   if(sem>1 ){
    var keyYear = cYear-(Math.floor((sem-1)/2));
    var keySem = cSemester;
    if(( (sem-1)%2 >0)|| (sem-1)==1 ){
        if(cSemester==1){
              keyYear =year-1;
              keySem = 2;
        }else
            keySem = 1;
    }
   var key={"year":keyYear,"semester":keySem};
   return key;
  }
  else
      return null;
 }else
      return null;
}

getAtualSem = function getAtualSem() {
  const dataUser = Meteor.users.findOne({_id:Meteor.userId()});
  if(dataUser==null){
    // console.log("erro ao obter id da conexao");
    // console.log(Meteor.userId());
    return null;
  }
  const year=dataUser.currentYear;
  const sem=dataUser.currentSemester;
  // console.log("Semestre atual"+year+"/"+sem);
  var key= {"year":year,"semester":sem};
  return key ;
}

calcCourseSemesterByStudent = function calcCourseSemesterByStudent(rga) {
  let key_rga =Math.floor(parseInt(rga)/Math.pow(10,7));
  let sYear = Math.floor(key_rga/10);//pega o ano do rga do estudante
  let sSemester = parseInt((key_rga%10));
  let key_atual = getAtualSem();
  //console.log(key_atual.year);
  let cYear = parseInt(key_atual.year);
  let cSemester = parseInt(key_atual.semester);
  let sem=1;
  while((sYear!=cYear || sSemester!=cSemester)&&sem<=10){
      sem = sem+1;
      if(sSemester==2){
        sYear=sYear+1;
        sSemester =1;
      }
      else sSemester =2;
  }
  return sem;
}

loadingAutoComplete = function loadingAutoComplete() {
  if (Meteor.isClient) {
    if (Template.instance().isStudent.get()){
      $('#autocomplete-input').autocomplete({
        lookup: function (query, done) {
          var result = { suggestions: listOfStudents() };
          done(result);
        }
      });
    } else {
      $('#autocomplete-input').autocomplete({
        lookup: function (query, done) {
          var result = {
            suggestions: Courses.find().map(function(x) {
              return { value: x.nome, data: x.codigo};
            })
          };
          done(result);
        }
      });
    }
  }
}
