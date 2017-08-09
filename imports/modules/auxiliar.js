import {Meteor} from 'meteor/meteor';
import Courses from '../../imports/api/collections/courses'
import Records from '../../imports/api/collections/records'
reinc = function reinc(item) {
  const currentUser = Meteor.userId();
  return Records.find({
    rga: item.rga,
    disciplina: item.disciplina,
    createdBy: currentUser
  }).count();
}
ApprovedAndRecidivists = function ApprovedAndRecidivists(item) {
  var id_disciplina=0, aprov, reincidenciaaux, aprovtwo, alunos;
  console.log(item);
  var disciplina = Courses.find({nome: item.disciplina}).fetch();
  _.each(disciplina, function(h) {
    id_disciplina=h._id;
    aprov=h.aprovacoes;
    rep=h.reprovacoes;
    reincidenciaaux=h.reincidencia;
    aprovtwo=h.aprov2;
    alunos=h.alunos;
  });
  var reincident = reinc(item);
  if(reincident==0){
    alunos = alunos + 1;
  }
  if(item.situacao=='AP'){
    aprov=aprov+1;
    if(reincident==1){
      aprovtwo = aprovtwo+1;
    }
    Courses.update(
      { _id: id_disciplina },
      {$set: {aprovacoes:aprov,alunos:alunos, aprov2:aprovtwo} });
}
  else{
    if(reincident==1){
      reincidenciaaux = reincidenciaaux+1;
    }
    rep=rep+1;
    Courses.update(
      { _id: id_disciplina },
      {$set: {reprovacoes:rep, reincidencia:reincidenciaaux, alunos:alunos} });
  }
  var percent=(aprov/(aprov+rep))*100;
  percent=percent.toFixed(3);
  var percentp, percentl;
  if(reincidenciaaux){
    percentp=(reincidenciaaux/alunos)*100;
    percentp=percentp.toFixed(3);
  }
  else {
    percentp=0;
  }
  if(aprovtwo){
    percentl=(aprovtwo/alunos)*100;
    percentl=percentl.toFixed(3);
  }
  else{
    percentl=0;
  }
  Courses.update({
    _id: id_disciplina
        },
      {$set: {perc_ap:  percent,
              perc_reic:  percentp,
              perc_aprov2:percentl
              }});
  }
