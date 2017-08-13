Router.configure({ layoutTemplate: 'layout' });

Router.route('/', {
  template: 'home',
  name: 'home',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/estrutura-curricular', {
  template: 'estruturacurricular',
  name: 'estruturacurricular',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/historico-academico', {
  template: 'historicoacademico',
  name: 'historicoacademico',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/sla', {
  template: 'upload',
  name: 'upload',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/error', {
  template: 'testes',
  name: 'testes',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/settings', {
  template: 'usersettings',
  name: 'usersettings',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/about', {
  template: 'about',
  name: 'about',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  },
});

Router.route('/login', {
  template: 'login',
  name: 'login',
  onBeforeAction() {
    if (!Meteor.userId()) {
      this.next();
    } else {
      this.render("home");
    }
  },
});

Router.route('/recuperar', {
  template: 'recpsw',
  name: 'recpsw',
  onBeforeAction() {
    if (!Meteor.userId()) {
      this.next();
    } else {
      this.render("home");
    }
  },
});

Router.route('/registrar', {
  template: 'reg',
  name: 'reg',
  onBeforeAction() {
    if (!Meteor.userId()) {
      this.next();
    } else {
      this.render("home");
    }
  },
});
