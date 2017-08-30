import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import Settings from "../../imports/modules/settings";

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password, function(error){
    if (error) {
      if(error.reason === "Incorrect password")
      Bert.alert('Senha incorreta', 'danger', 'growl-top-right');
      if (error.reason === "User not found")
      Bert.alert('Usuário não cadastrado', 'danger', 'growl-top-right');
    }
    });
  }
});

Template.layout.helpers({
  changepass() {
    const currentUser = Meteor.user();
    //console.log(currentUser.passwordFlag);
    return currentUser && currentUser.passwordFlag;
  }
});

Template.layout.events({
  'click .exit': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('/');
  }
});

Template.changepass.events({
  'submit #changepassform': function (event) {
    Settings.changePassword(event, true);
  }
});

Template.navigation.events({
    'click .exit': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});

Template.navigation.helpers({
  nome() {
    return Meteor.user().name;
  },

  curso() {
    return Meteor.user().gradProgram;
  }
});

Template.navbar.helpers({
  ano() {
    return Meteor.user().currentYear;
  },

  semestre() {
    return Meteor.user().currentSemester;
  }
});
