Template.layout.events({
  'click .logout': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
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
