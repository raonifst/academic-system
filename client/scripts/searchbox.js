import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import "../../imports/modules/queries";

Session.set('showRegister', true);
Session.set('courseName', '');

Template.searchbox.onRendered(function(){
  Session.set('showRegister', true);
  loadingAutoComplete();
});

Template.searchbox.onCreated(() => {
  //Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent  = new ReactiveVar(true);
  Template.instance().semesterdisciplinesuggested = new ReactiveVar(0);
});

Template.home.helpers({
  showStudents :function(){
      return Session.get('showRegister');
  }
});

Template.searchbox.events({
  'submit form': function (event) {
    event.preventDefault();
    const name = event.target.search.value;
    const radioValue = event.target.group1.value;

    //Template.instance().courseName.set(name);
    Session.set('courseName', name);
    if (radioValue == 'a') {
      // TODO ao final da implementação de sugestão de disciplinas, remover este bloco de testes

      // ***** Início de bloco de teste *****

      console.log("Aluno selecionado: " + name);
      console.log("Disciplinas do aluno:");
      var recordsList = Records.find({ nome: name }).fetch();
      console.log(recordsList);
      var recordsDoneList = recordsList.map(function (o) { return o.disciplina; });
      console.log(recordsDoneList);
      console.log("Todas as disciplinas:");
      console.log(Courses.find().fetch());
      console.log("Disciplinas ainda não cursadas:");
      console.log(Courses.find({ nome: { $nin: recordsDoneList } }).fetch());

      // ****** Fim de bloco de teste ******

      Session.set('showRegister', true);
    } else if(radioValue == 'd') {
      Session.set('showRegister', false);
    }
  },

  'click .a': function(event){
      Template.instance().isStudent.set(true);
      Session.set('courseName', '');
      Session.set('showRegister', true);
      $('#autocomplete-input').val('');
      $('#autocomplete-label').removeClass('active');
      loadingAutoComplete();
  },

  'click .d': function(){
      Template.instance().isStudent.set(false);
      Session.set('courseName', '');
      Session.set('showRegister', false);
      $('#autocomplete-input').val('');
      $('#autocomplete-label').removeClass('active');
      loadingAutoComplete();
  }
});
