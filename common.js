import {Meteor} from 'meteor/meteor';

// Coleção contendo o histórico acadêmico dos alunos
Records = new Meteor.Collection('record');

// Coleção contendo a estrutura curricular de cada disciplina
CurricularStructure = new Meteor.Collection('curricularstructure');

// Coleção contendo as disciplinas registradas
Disciplines = new Meteor.Collection('disciplines');

schemaCurrDisc = new SimpleSchema({
  codigo: {
    type: Number,
    min: 90000001,
    max: 99999999,
    label: "Código da disciplina"},
  nome: {
    type: String,
    label: "Nome da disciplina"
  },
  creditos: {
    type: Number,
    min: 2,
    max: 6,
    label: "Créditos da disciplina"
  },
  semestre: {
    type: Number,
    min: 1,
    max: 10,
    label: "Semestre da disciplina"
  },
  prereq: {
    type: String,
    label: "Pré-requisitos da disciplina"
  }
});