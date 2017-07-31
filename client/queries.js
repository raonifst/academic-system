
hash2array = function hash2array(map) {
  let array = [];
  Object.keys(map).forEach(function(key){
    array.push(map[key]);
  });
  return array;
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
