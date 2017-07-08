import {Meteor} from 'meteor/meteor';


// Coleção contendo o histórico acadêmico dos alunos
Records = new Meteor.Collection('record');

// Coleção contendo a estrutura curricular de cada disciplina
CurricularStructure = new Meteor.Collection('curricularstructure');

// Coleção contendo as disciplinas registradas
Disciplines = new Meteor.Collection('disciplines');


Users = new Meteor.Collection('usersreg');


// Schema utilizado para validar o csv da estrutura curricular
SchemaCurrDisc = new SimpleSchema({
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
    type: String,
  }
});