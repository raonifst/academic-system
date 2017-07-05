import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
//testando
import {check} from 'meteor/check'
import {Accounts} from 'meteor/accounts-base'


import './uploadacademicrecord.html';
import './main.html';
import './uploadacademicrecord.js'
import './uploadcurricularstructure.html'
import './uploadcurricularstructure.js'
import './exportercurricularstructure.html';
import './exportercurricular.js'
import './exporter.js'

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'home',
  template: 'home',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});


Router.route('/login');
Router.route('/uploadcurricularstructure', {
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});
Router.route('/uploadacademicrecord', {
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});
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

                if (password === '123') {
                    Bert.alert('Altere sua senha no primeiro login', 'warning', 'growl-top-right', 'fa-warning');
                    Router.go("changepass");
                }
                else {
                    Router.go("home");
                }
            }
        }
      });
    }
  });
});
//teste - rafael

Template.changepass.onRendered( function(){
    var validator = $('.login').validate({
        submitHandler:function(event){
            const newPassword = $('[name=password]').val();
                Meteor.call('changeUserPassword',newPassword,function(error){
                    if(error){
                      validator.showErrors({
                        password:error.reason
                      })

                    }
                    else{
                        Bert.alert('Senha alterada!', 'success', 'growl-top-right');
                        Router.go('home');
                    }

                });

        }

    });

  });

  Template.home.onRendered(function(){
    if(Meteor.userId()){
        if(CurricularStructure.find().count()==0){
          Bert.alert('Upload de matriz curricular das disciplinas requerido!', 'warning', 'growl-top-right', 'fa-warning');
          // Router.go("uploadcurricularstructure");
        }
        if (Records.find().count()==0){
          Bert.alert('Upload de matriz curricular dos alunos requerido!', 'warning', 'growl-top-right', 'fa-warning');
          // Router.go("uploadacademicrecord");
        }
    }
  });



Meteor.logout(function(err){
  console.log(err);
});
