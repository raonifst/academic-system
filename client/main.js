import {Template} from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'

import './uploadacademicrecord.html';
import './main.html';
import './uploadacademicrecord.js'
import './uploadcurricularstructure.html'
import './uploadcurricularstructure.js'
import './exporter.html';
import './exportercurricular.js'
import './exporter.js'
import './search.html'
import './search.js'
import './queries.js'

Bert.defaults.hideDelay = 4000;


Meteor.subscribe('record');
Meteor.subscribe('userStats');
Meteor.subscribe('curricularStructure');
Meteor.subscribe('disciplines');

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
Router.route('/search', {
  /*onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }*/
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


Template.login.onCreated(() => {
  Template.instance().validEmail = new ReactiveVar(true);
  Template.instance().validPassword = new ReactiveVar(true);
});

Template.login.helpers({
    validEmail() {
      return Template.instance().validEmail.get();
    },
    validPassword() {
      return Template.instance().validPassword.get();
    },
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

    onkeyup: false,
    keypress: false,

    errorPlacement: function (error, element) {
            Bert.alert(error.text(),'danger' );
    },

    submitHandler: function (event) {
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function (error) {
        if (error) {
          if (error.reason === "User not found") {
            Bert.alert( 'Usuário não cadastrado', 'danger' );

          }
          if (error.reason === "Incorrect password") {
            Bert.alert( 'Senha incorreta', 'danger' );

          }
        } else {
          Meteor.call('isFirstLogin', (error, results) => {
            if (results) {
              Bert.alert('Altere sua senha no primeiro login!',
                'warning', 'growl-top-right', 'fa-warning');
              Router.go("changepass");
            } else {
              Router.go("home");
            }
          });
        }
      });
    }
  });

});


Template.changepass.onRendered( function(){

  var validator = $('.login').validate({

    onkeyup: false,
    keypress: false,

    errorPlacement: function (error, element) {
            Bert.alert(error.text(),'danger' );
    },

    submitHandler:function(event){
      const newPassword = $('[name=password]').val();
      const oldPassword = $('[name=oldpassword]').val();
      Accounts.changePassword(oldPassword, newPassword, function(error){
        if (error) {
          if (error.reason === "User not found") {
            Bert.alert( 'Usuário não cadastrado', 'danger' );

          }
          if (error.reason === "Incorrect password") {
            Bert.alert( 'Senha incorreta', 'danger' );

          }
          /*validator.showErrors({
            password:error.reason
          })*/
        } else {
          Bert.alert('Senha alterada!', 'success', 'growl-top-right');
          Meteor.call('changeFirstLogin');
          Router.go('home');
        }
      });
    }
  });

});


Template.home.onRendered(function(){

  if (Meteor.user()) {
    const tipUploadCurricularStructure = 'Você possui tarefas pendentes. Veja abaixo a lista de' +
      ' configurações!';
    Meteor.call('isFirstLogin', (error, results) => {
      if (!results) {
        const currentUserId = Meteor.userId();
        const user = Users.findOne({ idUser: currentUserId });
        if(!user || !user.changedDefaultPassword ||
          !user.uploadedCurricularStructure || !user.uploadedAcademicRecords)
          Bert.alert(tipUploadCurricularStructure, 'info', 'growl-top-right');
      }
    });
  }

});


Meteor.logout(function(err){
  if (err)
    console.log(err);
});

Template.searchbox.onCreated(() => {
  Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent = new ReactiveVar(true);
  Template.instance().countStudentsWhoMustEnrollInACourse = new ReactiveVar(0);
  Template.instance().countStudentsWhoHavePrerequisitesForACourse = new ReactiveVar(0);
  Template.instance().semesterdisciplinesuggested = new ReactiveVar(0);
});

Template.searchbox.events({
  'submit form': function (event) {
    const name = $('[name=search]').val();
    Template.instance().courseName.set(name);
    event.preventDefault();
  }

});




Template.searchbox.helpers({
  isStudent: function() {
    return Template.instance().isStudent.get();
  },

  settings: function () {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { key: 'rga', label: 'RGA' , cellClass: 'col-md-4'},
            { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'}
          ]
      };
  },

  countStudentsWhoMustEnrollInACourse: function() {
    Template.searchbox.__helpers.get('studentsWhoMustEnrollInACourse').call();
    return Template.instance().countStudentsWhoMustEnrollInACourse.get();
  },
  countStudentsWhoHavePrerequisitesForACourse: function() {
    Template.searchbox.__helpers.get('studentsWhoHavePrerequisitesForACourse').call();
    return Template.instance().countStudentsWhoHavePrerequisitesForACourse.get();
  },

  semesterdisciplinesuggested: function semesterdisciplinesuggested(){
    let courseName = Template.instance().courseName.get();
    let semestersugg;
    if(courseName != '') {
        console.log(courseName)
        let courseId = Disciplines.findOne({nome: courseName}, {fields:{_id:1}});
        courseId = courseId==null?'':courseId._id;
        semestersugg = CurricularStructure.findOne({idDisciplina: courseId}, {fields: {semestre: 1}});
        semestersugg = semestersugg == null?[]:semestersugg.semestre;
        console.log(semestersugg)
  }
  Template.instance().semesterdisciplinesuggested.set(semestersugg);
  	return Template.instance().semesterdisciplinesuggested.get();
  }
,
  studentsWhoHavePrerequisitesForACourse: function(){

    let courseName = Template.instance().courseName.get();
    if(courseName != '') {
      let candidates = auxStudentsWhoMustEnrollInACourse(courseName);
      //console.log(courseName)
      courseId = Disciplines.findOne({nome: courseName}, {fields:{_id:1}});
      courseId = courseId==null?'':courseId._id;
      //console.log(courseId);
      let prereq = CurricularStructure.findOne({idDisciplina: courseId}, {fields: {prereq: 1}});
      prereq = prereq == null?[]:prereq.prereq;
    var map = {};
    console.log(prereq)
    candidates.forEach(function(student) {
      let count = 0;
      prereq.forEach(function(code) {

        courseName = Disciplines.findOne({_id: code}, {fields: {nome: 1}}).nome;
        let exist = Records.findOne({rga: student.rga, disciplina: courseName, situacao: "AP"}, {_id: 0});
        if(exist)
          count = count + 1;
      });

      if(count == prereq.length) {

        map[student.rga] = {
           nome: student.nome,
           rga: student.rga
       }
      }
    });
      let result = hash2array(map);
      Template.instance().countStudentsWhoHavePrerequisitesForACourse.set(result.length);
      return result;
    }
    else { Template.instance().countStudentsWhoHavePrerequisitesForACourse.set(0);return [{}]};
  },

  studentsWhoMustEnrollInACourse: function(){
      let courseName = Template.instance().courseName.get();
      if(courseName == '') {
        Template.instance().countStudentsWhoMustEnrollInACourse.set(0);
        return [{}];
      }
      let result = auxStudentsWhoMustEnrollInACourse(courseName);
      Template.instance().countStudentsWhoMustEnrollInACourse.set(result.length);
      return result;
  }


});
