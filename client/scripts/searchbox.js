import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import "../../imports/modules/queries";

Session.set('showRegister', true);
Session.set('courseName', '');

Template.searchbox.onRendered(function(){
  loadingAutoComplete();
});

Template.searchbox.onCreated(() => {
  //Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent  = new ReactiveVar(true);
  Template.instance().semesterdisciplinesuggested = new ReactiveVar(0);
});

Template.searchbox.helpers({
  showStudents :function(){
      return Session.get('showRegister');
  }
});

Template.searchbox.events({
  'submit form': function (event) {
    event.preventDefault();
    const name = $('[name=search]').val();
    //Template.instance().courseName.set(name);
    Session.set('courseName', name);
    var radioValue = event.target.group1.value;

    if (radioValue == 'a') {
      Session.set('showRegister', true);
    } else if(radioValue == 'd') {
      Session.set('showRegister', false);
    }
    /*console.log(Session.get('courseName'));
    console.log(Courses.find().map(function(x) {
       return { value: x.nome, data: x.codigo};
    }));*/
  },

  'click .a': function(){
      Template.instance().isStudent.set(true);
      Session.set('showRegister',true);
      loadingAutoComplete();
  },

  'click .d': function(){
      Template.instance().isStudent.set(false);
      Session.set('showRegister',false);
      loadingAutoComplete();
  }
});
