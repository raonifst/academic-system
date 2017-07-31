Template.search.onCreated(() => {
  Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent = new ReactiveVar(true);
  Template.instance().semesterSearch = new ReactiveVar(2);
  Template.instance().countStudentsWhoMustEnrollInACourse = new ReactiveVar(0);
  Template.instance().countStudentsWhoHavePrerequisitesForACourse = new ReactiveVar(0);
  Template.instance().countStudentsAtCourseSemester = new ReactiveVar(0);
});
Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
});
function hash2array(map) {
  let array = [];
  Object.keys(map).forEach(function(key){
    array.push(map[key]);
  });
  return array;
}
/*Funcao auxiliar para queries*/
function auxStudentsWhoMustEnrollInACourse(courseName){

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

Template.search.helpers({
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

  countStudentsWhoMustEnrollInACourse: function() {
    Template.search.__helpers.get('studentsWhoMustEnrollInACourse').call();
    return Template.instance().countStudentsWhoMustEnrollInACourse.get();
  },
  countStudentsWhoHavePrerequisitesForACourse: function() {
    Template.search.__helpers.get('studentsWhoHavePrerequisitesForACourse').call();
    return Template.instance().countStudentsWhoHavePrerequisitesForACourse.get();
  },


  studentsWhoHavePrerequisitesForACourse: function(){

    let courseName = Template.instance().courseName.get();
    //console.log(courseName)
    if(courseName != '') {
      let candidates = auxStudentsWhoMustEnrollInACourse(courseName);
      //console.log(courseName)
      courseId = Disciplines.findOne({nome: courseName}, {fields:{_id:1}});
      courseId = courseId==null?'':courseId._id;
      //console.log(courseId);
      let prereq = CurricularStructure.findOne({idDisciplina: courseId}, {fields: {prereq: 1}});
      prereq = prereq == null?[]:prereq.prereq;
    var map = {};
    //console.log(prereq)
    candidates.forEach(function(student) {
      let count = 0;
      prereq.forEach(function(code) {

        courseName = Disciplines.findOne({_id: code}, {fields: {nome: 1}}).nome;
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

  studentsWhoMustEnrollInACourse: function(){
      let courseName = Template.instance().courseName.get();
      if(courseName == '') {
        Template.instance().countStudentsWhoMustEnrollInACourse.set(0);
        return [{}];
      }
      let result = auxStudentsWhoMustEnrollInACourse(courseName);
      Template.instance().countStudentsWhoMustEnrollInACourse.set(result.length);
      return result;
  },


  countStudentsAtCourseSemester:function(){
      Template.search.__helpers.get('studentsAtCourseSemester').call();
      return Template.instance().countStudentsAtCourseSemester.get();
  },

  studentsAtCourseSemester:function(){
      let courseName = Template.instance().courseName.get();
      let semesterCourse;
      let courseId;
      Template.instance().countStudentsAtCourseSemester.set(0);
      if(courseName == '')
        return [{}];

      courseId = Disciplines.findOne({nome: courseName}, {fields:{_id:1}});
      courseId = courseId==null?'':courseId._id;
     if(courseId!=''){
        semesterCourse=CurricularStructure.findOne({idDisciplina: courseId},{fields:{semestre:1}});
        //Template.instance().semesterSearch.set(semesterCourse.semestre);
        //Template.search.__helpers.get('searchStudentBySemester').call();
        let res;
        if(semesterCourse.semestre>1){
          res = searchStudentBySemesterForHelper(semesterCourse.semestre);
          Template.instance().countStudentsAtCourseSemester.set(res.length);
          return res;

        }else return [{}]
     }
     else{
          //console.log("Disciplina nao encontrada");
          return [{}];
     }

  },

   searchStudentBySemester:function(){

      let semester =Template.instance().semesterSearch.get();
      //console.log("semestre:"+semester);
      var asx=calculateSem(semester);
      if(asx==null){
        return [{}];
      }
      var searchKey = parseInt(String(asx.year)+String(asx.semester));
      const data = Records.find({createdBy:Meteor.userId()});
      var map ={};
      data.forEach(item=>{
      let itemKey=Math.floor((parseInt(item.rga))/Math.pow(10,7));
        if(itemKey === searchKey && !map[item.rga]){
            map[item.rga]={
              nome:item.nome,
              rga:item.rga
            }

        }
      });
      return hash2array(map);
}



});
Template.search.events({
  'keyup [name="search"]' ( event, template ) {
    let value = event.target.value.trim();
    if ( value !== '' && event.keyCode === 13 ) {
      Template.instance().courseName.set( value );
    }

    if ( value === '' ) {
      Template.instance().courseName.set( value );
    }
  }
});

function searchStudentBySemesterForHelper(semester){

   var asx=calculateSem(parseInt(semester,10));
   if(asx==null){
     //console.log("Erro ao calcular o semestre chave");
     return [{}];
   }
//   console.log("Semestre buscado:"+asx.year+"/"+asx.semester);
   var searchKey = parseInt(String(asx.year)+String(asx.semester));
   const data = Records.find({createdBy:Meteor.userId()});
   var map ={};
   data.forEach(item=>{
   let itemKey=Math.floor((parseInt(item.rga))/Math.pow(10,7));
     if(itemKey === searchKey && !map[item.rga]){
         map[item.rga]={
           nome:item.nome,
           rga:item.rga
         }

     }
   });
   return hash2array(map);

}


function calculateSem(semester){
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

function getAtualSem(){
  const dataUser = Users.findOne({idUser:Meteor.userId()});
  if(dataUser==null){
    //console.log("erro ao obter id da conexao");
    return null;
  }
  const year=dataUser.currentYear;
  const sem=dataUser.currentSemester;
  //console.log("Semestre atual"+year+"/"+sem);
  var key= {"year":year,"semester":sem};
  return key ;
}
