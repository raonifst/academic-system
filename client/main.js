import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import {check} from 'meteor/check'
import {Accounts} from 'meteor/accounts-base'


import './uploadacademicrecord.html';
import './main.html';
import './uploadacademicrecord.js'
import './uploadcurricularstructure.html'
import './uploadcurricularstructure.js'

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'home',
  template: 'home'
});


Router.route('/login');

Router.route('/changepass', {
  name: 'changepass',
  template: 'changepass',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});


Template.menuItems.events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});

Template.login.events({
  'submit form': function (event) {
    event.preventDefault();
  }
});

Template.changepass.events({
  'submit form': function (event) {
    event.preventDefault();
    const newPassword = $('[name=password]').val();
    if (!Meteor.userId())
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    Meteor.call('changeUserPassword', newPassword);
    Bert.alert('Senha alterada!', 'success', 'growl-top-right');
    Router.go('home');
  }
});

$.validator.setDefaults({
  rules: {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 3
    }
  },
  messages: {
    email: {
      required: "Você deve digitar um email.",
      email: "Você digitou email inválido."
    },
    password: {
      required: "Você deve inserir uma Senha.",
      minlength: "Sua senha deve ter pelo menos {0} caracteres."
    }
  }
});

Template.login.onRendered(function () {
  var validator = $('.login').validate({
    submitHandler: function (event) {
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function (error) {
        if (error) {
          if (error.reason === "User not found") {
            validator.showErrors({
              email: 'Usuário não cadastrado.'
            });
          }
          if (error.reason === "Incorrect password") {
            validator.showErrors({
              password: 'Senha incorreta.'
            });
          }
        } else {
          if (Router.current().route.getName() === "login") {
            Router.go("home");
          }
        }
      });
    }
  });
});

Meteor.logout(function(err){
  console.log(err);
});
