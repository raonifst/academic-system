import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import "../../imports/modules/queries";
import {CoursesDAG} from "../../lib/classes/coursesdag";
import {incrementYearSemester} from "../../imports/modules/auxiliar";
import {getStudentBy, getSuggestionsToStudent} from "../../imports/modules/queriesstudents";

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
  Session.set('query', '');
  Session.set('showRegister', true);
  loadingAutoComplete();
});

Template.searchbox.onCreated(() => {
  //Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent  = new ReactiveVar(true);
  Template.instance().semesterdisciplinesuggested = new ReactiveVar(0);
  Template.instance().suggestionsSortOption = new ReactiveVar(1);
});

Template.searchbox.onDestroyed(() => {
  Session.set('query', '');
  Session.set('showRegister', true);
  Template.instance().isStudent.set(true);
  Template.instance().semesterdisciplinesuggested.set(0);
  Template.instance().suggestionsSortOption.set(1);
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
    const currentUser = Meteor.user();

    //Template.instance().courseName.set(query);
    Session.set('query', query);
    if (!query || query == "")
      return;
    if (radioValue == 'a') {
      const student = getStudentBy(Session.get('query'));
      if (!currentUser || !student) {
        event.target.search.value = '';
        return;
      }
      // TODO ao final da implementação de sugestão de disciplinas, REMOVER este bloco de testes

      // ***** Início de bloco de teste *****
      const maxCredits = parseInt(event.target.maxcreditspergroup.value);
      const optValue = parseInt(event.target.group2.value);
      Session.set('optValue', optValue);
      Session.set('maxCredits', maxCredits);

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
      /*console.log("SUGESTÕES NO HELPER "
                  + "(ordenação = " + optValue + ", max. créditos = " + maxCredits + "):");
      console.log("------------------------------");
      var anotherSuggestions = getSuggestionsToStudent(maxCredits, optValue);
      for (var j = 0; j < anotherSuggestions.length; j++) {
        console.log(anotherSuggestions[j].period);
        anotherSuggestions[j].list.forEach(e => console.log(e.nome));
        console.log("------------------------------");
      }*/

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

/*-------------------- SUGESTÕES --------------------*/
Template.sugestao.onRendered(() => {
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
});

Template.sugestao.helpers({
  anotherSuggestions(){
    if (Session.get('query')) {
      $(document).ready(function(){
        $('.collapsible').collapsible();
      });
      const maxCredits = Session.get('maxCredits');
      const optValue = Session.get('optValue');
      return getSuggestionsToStudent(maxCredits, optValue);
    }
  },

  settings() {
      return {
          showFilter: false,
          showNavigation: 'never',
          fields: [
            { key: 'nome',      label: 'Nome',         headerClass: 'titleheader2' },

            { key: 'perc_ap',   label: 'AP',   headerClass: 'titleheader2', tmpl: Template.percap,
              cellClass: 'num', fn(value, object, key) { return 100*object.perc_ap; }},

            { key: 'perc_reic', label: 'Reinc.', headerClass: 'titleheader2', tmpl: Template.percreic,
              cellClass: 'num', fn(value, object, key) { return 100*object.perc_ap; }}
          ]
      };
  },
});
