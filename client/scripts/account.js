Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password);
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
