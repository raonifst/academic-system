
hash2array = function hash2array(map) {
  let array = [];
  Object.keys(map).forEach(function(key){
    array.push(map[key]);
  });
  return array;
}

listOfStudents = function listOfStudents()
{
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
  //console.log(map);
  return hash2array(map);
}


/*Funcao auxiliar para queries*/
auxStudentsWhoMustEnrollInACourse = function auxStudentsWhoMustEnrollInACourse(courseName){

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


searchStudentBySemesterForHelper = function searchStudentBySemesterForHelper(semester){

   var asx=calculateSem(parseInt(semester,10));
   if(asx==null){
     //console.log("Erro ao calcular o semestre chave");
     return [{}];
   }
   console.log("Semestre buscado:"+asx.year+"/"+asx.semester);
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


calculateSem = function calculateSem(semester){
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

function calcCourseSemesterByStudent(rga){
  let key_rga =Math.floor(parseInt(rga)/Math.pow(10,7));
  let sYear = Math.floor(key_rga/10);//pega o ano do rga do estudante
  let sSemester = parseInt((key_rga%10));
  let key_atual = getAtualSem();
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
