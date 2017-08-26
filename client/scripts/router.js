import {msgRoutes} from "../../imports/modules/bertmessages";

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn() {
    return Meteor.subscribe('user');
  },
  onBeforeAction() {
    const currentUser = Meteor.user();
    if (currentUser && !currentUser.passwordFlag) {
      Bert.alert(msgRoutes.firstLogin, 'warning', 'growl-top-right');
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
        Bert.alert(msgRoutes.uploadCourses, 'warning', 'growl-top-right');
        this.render("estruturacurricular");
      } else if (!currentUser.uploadRecordsFlag) {
        Bert.alert(msgRoutes.uploadRecords, 'warning', 'growl-top-right');
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
        Bert.alert(msgRoutes.uploadCourses, 'warning', 'growl-top-right');
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
    return Meteor.subscribe('user');
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
    return Meteor.subscribe('user');
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
    return Meteor.subscribe('user');
  },
  onBeforeAction() {
    if (!Meteor.userId()) {
      this.next();
    } else {
      this.render("home");
    }
  }
});
