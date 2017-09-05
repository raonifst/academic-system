import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import Settings from "../../imports/modules/settings";
import BertMsg from "../../imports/modules/bertmessages";

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password, function(error) {
    if (error) {
      if(error.reason === "Incorrect password")
      Bert.alert(BertMsg.password.errorIncorrectPassword, 'danger', 'growl-top-right');
      if (error.reason === "User not found")
      Bert.alert(BertMsg.login.errorUserNotFound, 'danger', 'growl-top-right');
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
  'click .exit': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('/');
  }
});

Template.changepass.events({
  'submit #changepassform': function(event) {
    Settings.changePassword(event, true);
  }
});

Template.navigation.events({
  'click .exit': function(event) {
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

Template.formpassword.events({
  'submit form': function (event) {
    event.preventDefault();
    let myEmail = event.target.email.value;
    Accounts.forgotPassword({ email: myEmail }, function(error) {
      if (error) {
        if (error.message === 'User not found [403]')
          Bert.alert(BertMsg.login.errorEmailNotFound, 'danger', 'growl-top-right');
        else
          Bert.alert(BertMsg.errorUnknown, 'danger', 'growl-top-right');
      } else {
        Bert.alert(BertMsg.login.successRecover, 'success', 'growl-top-right');
      }
    });
  }
});

Template.resetpass.events({
  'submit #resetpassform':function(event){
    event.preventDefault();
    const newpassword = event.target.password.value;
    const newpasswordconfirm = event.target.passwordconfirm.value;
    const passcondition =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;

    if (!passcondition.test(newpassword)){
      Bert.alert(BertMsg.password.errorIncorrectPassword, 'danger', 'growl-top-right');
    } else if (newpassword != newpasswordconfirm) {
      Bert.alert(BertMsg.password.errorMatchPasswords, 'danger', 'growl-top-right');
    } else {
      Accounts.resetPassword(Accounts._resetPasswordToken, newpassword, function(error) {
        if (error) {
          Bert.alert(BertMsg.errorUnknown, 'danger', 'growl-top-right');
        } else {
          Bert.alert(BertMsg.password.success, 'success', 'growl-top-right');
          Accounts._resetPasswordToken = null;
          Meteor.call('changeFirstLogin');
          Router.go("home");
        }
      });
    }
  }
});
