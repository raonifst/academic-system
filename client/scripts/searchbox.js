import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import "../../imports/modules/queries";
import {CoursesDAG} from "../../lib/classes/coursesdag";
import {incrementYearSemester} from "../../imports/modules/auxiliar";
import {getSuggestionsToStudent} from "../../imports/modules/queriesstudents";

Session.set('showRegister', true);
Session.set('query', '');

/*-------------------- HOME --------------------*/
Template.home.helpers({
  showStudents() {
    return Session.get('showRegister');
  }
});

/*-------------------- SEARCHBOX --------------------*/
Template.searchbox.onRendered(function(){
  Session.set('showRegister', true);
  loadingAutoComplete();
});

Template.searchbox.onCreated(() => {
  //Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent  = new ReactiveVar(true);
  Template.instance().semesterdisciplinesuggested = new ReactiveVar(0);
  Template.instance().suggestionsSortOption = new ReactiveVar(1);
});

Template.searchbox.helpers({
  showStudents() {
    return Session.get('showRegister');
  }
});

Template.searchbox.events({
  'submit form': function (event) {
    event.preventDefault();
    const query = event.target.search.value;
    const radioValue = event.target.group1.value;

    //Template.instance().courseName.set(query);
    Session.set('query', query);
    if (!query || query == "")
      return;
    if (radioValue == 'a') {
      // TODO ao final da implementação de sugestão de disciplinas, REMOVER este bloco de testes

      // ***** Início de bloco de teste *****

      const optValue = event.target.group2.value;
      const maxCredits = event.target.maxcreditspergroup.value;
      /*
      console.log("Aluno selecionado: " + query);
      console.log("Disciplinas do aluno:");
      var recordsList = Records.find({ nome: query, situacao: "AP" }).fetch();
      console.log(recordsList);
      var recordsDoneList = recordsList.map(function (o) { return o.disciplina });
      console.log(recordsDoneList);
      console.log("Todas as disciplinas:");
      console.log(Courses.find().fetch());
      console.log("Disciplinas ainda não cursadas:");
      var coursesNotDone = Courses.find({ nome: { $nin: recordsDoneList } }).fetch();
      console.log(coursesNotDone);
      console.log("Grafo de todas as disciplinas:");
      var allCoursesGraph = new CoursesDAG(Courses.find().fetch());
      console.log(allCoursesGraph);
      console.log("Grafo das disciplinas não cursadas:");
      var studentCoursesGraph = new CoursesDAG(coursesNotDone, false);
      console.log(studentCoursesGraph);
      var suggestions = studentCoursesGraph.groupBy();
      console.log("Sugestões (ordenação = " + optValue + "):");
      const cY = Meteor.user().currentYear;
      const cS = Meteor.user().currentSemester;
      console.log("------------------------------");
      for (var i = 0; i < suggestions.length; i++) {
        const tmp = incrementYearSemester(cY, cS, i);
        console.log(tmp.year + "/" + tmp.semester);
        suggestions[i].forEach(e => console.log(e));
        console.log("------------------------------");
      }
      */
      console.log("SUGESTÕES NO HELPER "
                  + "(ordenação = " + optValue + ", max. créditos = " + maxCredits + "):");
      console.log("------------------------------");
      var anotherSuggestions = getSuggestionsToStudent(maxCredits, optValue);
      for (var j = 0; j < anotherSuggestions.length; j++) {
        console.log(anotherSuggestions[j].period);
        anotherSuggestions[j].list.forEach(e => console.log(e.nome));
        console.log("------------------------------");
      }

      // ****** Fim de bloco de teste ******

      Session.set('showRegister', true);
    } else if(radioValue == 'd') {
      Session.set('showRegister', false);
    }
  },

  'click .a': function(event) {
      Template.instance().isStudent.set(true);
      Session.set('query', '');
      Session.set('showRegister', true);
      $('#autocomplete-input').val('');
      $('#autocomplete-label').removeClass('active');
      loadingAutoComplete();
  },

  'click .d': function(event) {
      Template.instance().isStudent.set(false);
      Session.set('query', '');
      Session.set('showRegister', false);
      $('#autocomplete-input').val('');
      $('#autocomplete-label').removeClass('active');
      loadingAutoComplete();
  }
});
