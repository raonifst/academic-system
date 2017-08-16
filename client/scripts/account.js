Template.layout.events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});

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
    }
});
