Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  // TODO escolher adequadamente quais serão os subscribes necessários em todas as routes
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser && !currentUser.passwordFlag) {
      Bert.alert("É necessário trocar a senha padrão", 'warning', 'growl-top-right');
      this.render('changepass');
    } else
      this.next();
  }
});

Router.route('/', {
  template: 'home',
  name: 'home',
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser) {
      if (!currentUser.uploadCoursesFlag) {
        Bert.alert("É necessário fazer upload da Estrutura Curricular", 'warning', 'growl-top-right');
        this.render("estruturacurricular");
      } else if (!currentUser.uploadRecordsFlag) {
        Bert.alert("É necessário fazer upload do Histórico Acadêmico", 'warning', 'growl-top-right');
        this.render("historicoacademico");
      } else
        this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/estrutura-curricular', {
  template: 'estruturacurricular',
  name: 'estruturacurricular',
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
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
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser) {
      if (!currentUser.uploadCoursesFlag) {
        Bert.alert("É necessário fazer upload da Estrutura Curricular", 'warning', 'growl-top-right');
        this.render("estruturacurricular");
      } else
        this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/error', {
  template: 'testes',
  name: 'testes',
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
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
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
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
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
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
  waitOn() {
    return [Meteor.subscribe('courses'), Meteor.subscribe('records'), Meteor.subscribe('user')];
  },
  onBeforeAction() {
    if (!Meteor.userId()) {
      this.next();
    } else {
      this.render("home");
    }
  }
});
