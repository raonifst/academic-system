import {Meteor} from 'meteor/meteor';

// Coleção contendo o histórico acadêmico dos alunos
Records = new Meteor.Collection('record');

// Coleção contendo a estrutura curricular de cada disciplina
CurricularStructure = new Meteor.Collection('curricularstructure');

// Coleção contendo as disciplinas registradas
Disciplines = new Meteor.Collection('disciplines');
