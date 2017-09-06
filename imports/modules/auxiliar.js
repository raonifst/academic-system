import {Meteor} from 'meteor/meteor';
import Courses from '../../imports/api/collections/courses'
import Records from '../../imports/api/collections/records'

function reinc(item) {
  const currentUserId = Meteor.userId();
  return Records.find({
    rga: item.rga,
    disciplina: item.disciplina,
    createdBy: currentUserId
  }).count();
}

export function incrementYearSemester(year, semester, inc) {
  for (var i = 1; i <= inc; i++) {
    if (semester == 2 || semester == 3) { // Semestre é 2 ou 3 (para cursos de verão)
      semester = 1;
      year++
    } else { // Semestre é 1
      semester++;
    }
  }
  return { year: year, semester: semester };
}

export function updateCoursesRemoveRecords(currentUserId) {
  Courses.update({ createdBy: currentUserId }, { $set:
  { perc_ap:      0,
    perc_reic:    0,
    perc_aprov2:  0,
    reprovacoes:  0,
    aprovacoes:   0,
    reincidencia: 0,
    aprov2:       0,
    alunos:       0}}, {multi: true});
}

export function approvedAndRecidivists(item) {
  var idDisciplina, aprov, rep, reincidenciaAux, aprovtwo, alunos;
  //console.log(item); /* Descomente p/ debug */

  var disciplina = Courses.findOne({nome: item.disciplina});
  if (!disciplina) return;

  idDisciplina = disciplina._id;
  aprov = disciplina.aprovacoes;
  rep = disciplina.reprovacoes;
  reincidenciaAux = disciplina.reincidencia;
  aprovtwo = disciplina.aprov2;
  alunos = disciplina.alunos;

  var reincident = reinc(item);
  if (reincident == 0) {
    alunos = alunos + 1;
  }

  if (item.situacao == 'AP') {
    aprov++;
    if (reincident == 1) {
      aprovtwo++;
    }
    Courses.update(
      { _id: idDisciplina },
      { $set: { aprovacoes: aprov, alunos: alunos, aprov2: aprovtwo } });
  } else {
    if (reincident == 1) {
      reincidenciaAux++;
    }
    rep++;
    Courses.update({ _id: idDisciplina }, { $set:
    { reprovacoes: rep,
      reincidencia: reincidenciaAux,
      alunos: alunos }
    });
  }

  var percent = (aprov/(aprov+rep))*100;
  percent = percent.toFixed(2);
  var percentp, percentl;
  if (reincidenciaAux) {
    percentp = (reincidenciaAux/alunos)*100;
    percentp = percentp.toFixed(2);
  } else {
    percentp = 0;
  }
  if (aprovtwo) {
    percentl = (aprovtwo/alunos)*100;
    percentl = percentl.toFixed(2);
  } else {
    percentl = 0;
  }
  Courses.update({ _id: idDisciplina }, { $set:
  { perc_ap:      percent,
    perc_reic:    percentp,
    perc_aprov2:  percentl }
  });
}

export function updateCoursesRemoveItem(item){
  const currentUserId = Meteor.userId();
  var countStudent = Records.find({rga: item.rga, disciplina:item.disciplina, createdBy: currentUserId }).count();
  var discipline  = Courses.findOne({nome: item.disciplina, createdBy: currentUserId });
  var alunos = discipline.alunos;
  if(Records.find({rga: item.rga, disciplina:item.disciplina, createdBy: currentUserId  }).count()==1) {
    alunos = alunos-1;
    Courses.update({nome: item.disciplina, createdBy: currentUserId }, {$set:{alunos: alunos}});
  }
  if(item.situacao == 'AP') {
      var aprov = discipline.aprovacoes-1;
      var percent = (aprov/(discipline.reprovacoes+aprov))*100;
      Courses.update({nome: item.disciplina, createdBy: currentUserId },{$set:{aprovacoes:aprov, perc_ap:percent.toFixed(2)}} );
    }
  else {
    var reinc = discipline.reincidencia;
    var percent = discipline.perc_reic;
    var countReinc = Records.find({rga: item.rga, disciplina:item.disciplina, situacao:item.situacao , createdBy: currentUserId }).count();
    if(countReinc==2) {
      reinc--;
      percent = (reinc/alunos)*100;
      percent = percent.toFixed(2);
    }
    Courses.update({nome: item.disciplina},{$set:{reprovacoes:aprov, perc_reic:percent}} );
  }
}
