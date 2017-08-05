Router.configure({layoutTemplate: 'layout'});

Router.route('/', {
  template: 'home',
  name: '-h',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/estrutura-curricular', {
  template: 'estruturacurricular',
  name: '-ec',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/historico-academico', {
  template: 'historicoacademico',
  name: '-ha',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/error', {
  template: 'testes',
  name: '-t'
});

Router.route('/settings', {
  template: 'settings',
  name: '-s',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});
