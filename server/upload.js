import {Meteor} from 'meteor/meteor';

/* Formato dos dados das coleções (exemplo):

 Disciplines:
 {
   _id: HYXZ
   codigo: 90000007,
   nome: CÁLCULO I,
   creditos: 4
 }
 {
   _id: XYZ8
   codigo: 90000008,
   nome: CÁLCULO II,
   creditos: 4
 }

 CurricularStructure:
 {
   _id: ...
   idDisciplina: HYXZ
   semestre: 1,
   prereq: [ ]
 }
 {
   _id: ...
   idDisciplina: XYZ8
   semestre: 2,
   prereq: [ HYXZ ]
 }
 */

Meteor.methods({

  uploadCurricularStruture(data) {

    /* Variável de controle resultCode: retorna os seguintes resultados:
    0 -> Todos os itens foram inseridos sem erros;
    1 -> Todos os itens foram inseridos, itens repetidos foram encontrados e ignorados;
    2 -> Itens em formato errado foram encontrados e não foram inseridos.
     */
    var resultCode = 0;
    const currentUser = Meteor.userId();

    data.forEach(item => {

      const existCurr = Courses.find({
        codigo: item.codigo,
        createdBy: currentUser
      }).count();
      // Pré-condição: Verifica se os items já estão no banco de dados
      if (existCurr !== 0) {
        resultCode = 1;
        return; // Equivalente ao "continue" em um laço "for" explícito
      }

      // Array de pré-requisitos:
      // Deve conter os IDs das disciplinas pré-requisitos da disciplina em questão na estrutura
      // curricular.
      var prereqArray = [];

      item.prereq.forEach(function (item) {
        const discipline = Courses.findOne({ codigo: item });
        if (discipline != null)
          prereqArray.push(discipline._id);
        else {
          resultCode = 2;
        }
      });

      if (resultCode == 2) return;
      //Inserindos dados na Collection de disciplinas
      Courses.insert({
        codigo: item.codigo,
        nome: item.nome,
        creditos: item.creditos,
        aprovacoes:0,
        reprovacoes:0,
        reincidencia:0,
        aprov2:0,
        perc_ap:'-',
        perc_reic:'-',
        perc_aprov2:'-',
        alunos:0,
        semestre: item.semestre,
        prereq: prereqArray,
        createdBy: currentUser
      });

    });
    return resultCode;
  }

});
