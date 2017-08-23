import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password);
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
    event.preventDefault();

    if (event.target.password.value != event.target.password2.value) {
      Bert.alert('Senhas precisam ser iguais', 'danger', 'growl-top-right');
      event.target.oldpassword.value = '';
      event.target.password.value = '';
      event.target.password2.value = '';
      $(event.target.oldpassword).removeClass('valid');
      $(event.target.password).removeClass('valid');
      $(event.target.password2).removeClass('valid');
      $(event.target.oldpassword).blur();
      $(event.target.password).blur();
      $(event.target.password2).blur();;
    } else
    if (event.target.oldpassword.value == event.target.password.value) {
      Bert.alert('Senha precisa ser diferente da senha primária', 'danger', 'growl-top-right');
      event.target.oldpassword.value = '';
      event.target.password.value = '';
      event.target.password2.value = '';
      $(event.target.oldpassword).removeClass('valid');
      $(event.target.password).removeClass('valid');
      $(event.target.password2).removeClass('valid');
      $(event.target.oldpassword).blur();
      $(event.target.password).blur();
      $(event.target.password2).blur();;
    }

    const oldpassword = event.target.oldpassword.value;
    const newpassword = event.target.password.value;

    Accounts.changePassword(oldpassword, newpassword, function (error) {
      if (error) {
        if (error.reason === "User not found")
          Bert.alert('Usuário não cadastrado', 'danger');
        else if (error.reason === "Incorrect password")
          Bert.alert('Senha incorreta', 'danger', 'growl-top-right');
      } else {
        //Meteor.logout();
        Meteor.call('changeFirstLogin');
        Bert.alert('Senha alterada!', 'success', 'growl-top-right');
      }
    });

    $(event.target.oldpassword).removeClass('valid');
    $(event.target.password).removeClass('valid');
    $(event.target.password2).removeClass('valid');
    event.target.oldpassword.value = '';
    event.target.password.value = '';
    event.target.password2.value = '';
    $(event.target.oldpassword).blur();
    $(event.target.password).blur();
    $(event.target.password2).blur();
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
