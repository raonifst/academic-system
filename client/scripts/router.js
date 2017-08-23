Router.configure({
  layoutTemplate: 'layout',
  waitOn() {
    return Meteor.subscribe('user');
  },
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser)
      if (!currentUser.passwordFlag) {
        console.log(currentUser.passwordFlag);
        this.render('changepass');
      } else
        this.next();
    else
      this.render("login");
  }
});

Router.route('/', {
  template: 'home',
  name: 'home',
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser) {
      if (!currentUser.uploadCoursesFlag)
        this.render("estruturacurricular");
      else if (!currentUser.uploadRecordsFlag)
        this.render("historicoacademico");
      else
        this.next();
    } else {
      this.render("login");
    }
  }
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
  }
});

Router.route('/historico-academico', {
  template: 'historicoacademico',
  name: 'historicoacademico',
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser) {
      if (!currentUser.uploadCoursesFlag)
        this.render("estruturacurricular");
      else
        this.next();
    } else {
      this.render("login");
    }
  }
});

/*Router.route('/sla', {
  template: 'upload',
  name: 'upload',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});*/

Router.route('/error', {
  template: 'testes',
  name: 'testes',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/settings', {
  template: 'settings',
  name: 'settings',
  onBeforeAction() {
    if (Meteor.userId()) {
      this.next();
    } else {
      this.render("login");
    }
  }
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
  }
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
  }
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
  }
});
