import {Meteor} from 'meteor/meteor';


// Coleção contendo o histórico acadêmico dos alunos
Records = new Meteor.Collection('record');

// Coleção contendo a estrutura curricular de cada disciplina
CurricularStructure = new Meteor.Collection('curricularstructure');

// Coleção contendo as disciplinas registradas
Disciplines = new Meteor.Collection('disciplines');

// Coleção contendo flags de configuração dos usuários
Users = new Meteor.Collection('usersreg');


// Schema utilizado para validar o csv da estrutura curricular
CurricularStructure.schema = new SimpleSchema({
  codigo: {
    type: Number,
    min: 90000001,
    max: 99999999
  },
  nome: {
    type: String,
    max: 100
  },
  creditos: {
    type: Number,
    min: 2,
    max: 6
  },
  semestre: {
    type: Number,
    min: 1,
    max: 10
  },
  prereq: {
    type: String
  }
});

// Schema utilizado para validar o csv do histórico acadêmico
Records.schema = new SimpleSchema({
  rga: {
    type: Number,
    min: 201420000000
  },
  nome: {
    type: String,
    max: 100
  },
  disciplina: {
    type: String,
    max: 100
  },
  situacao: {
    type: String,
    min: 2,
    max: 3
  },
  ano: {
    type: Number,
    min: 2014
  },
  semestre: {
    type: Number,
    min: 1,
    max: 4
  }
});


CurricularStructure.parser = function(jsonObj) {

  return {
    codigo: parseInt(jsonObj.codigo),
    nome: jsonObj.nome,
    creditos: parseInt(jsonObj.creditos),
    semestre: parseInt(jsonObj.semestre),
    prereq: jsonObj.prereq
  };

};
