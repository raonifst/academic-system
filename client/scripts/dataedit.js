import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import BertMsg from "/imports/modules/bertmessages";

import { Session } from 'meteor/session';

Template.modaledit.onRendered(function() {
  $(document).ready(function() {
    $('.modal-trigger').leanModal({
      dismissible: true,
      opacity: .5,
      inDuration: 300,
      outDuration: 200,
      startingTop: '4%',
      endingTop: '10%',
    });
  });
});

Template.modaledit.helpers({
  coursesOrRecords(){
    if (!(this.rga))
      return 1;
    return 0;
  },

  edit(){
    return Session.get('editing');
  }
});

Template.editcourse.helpers({
  edit(){
    return Session.get('editing');
  }
});

Template.editrecord.helpers({
  edit(){
    return Session.get('editing');
  }
});

Template.edit.helpers({
  empty(){
    var empty = (Records.find().count() == 0) ? 1 : 0;
    console.log('empty', empty);
    return empty;
  },

  isCourses(){
    var isCourses = (this.rga > 0) ? 0 : 1;
    console.log(isCourses);
    return isCourses;
  }
})

Template.edit.events({
  /*'submit form': function(event) {
    event.preventDefault();
    if (!(this.rga)) {
      console.log(event.target.codigo.value);
      console.log(event.target.nome.value);
      console.log(event.target.creditos.value);
      console.log(event.target.semestre.value);
      console.log(event.target.prereq.value);
      $(event.target.codigo).removeClass('valid');
      $(event.target.nome).removeClass('valid');
      $(event.target.creditos).removeClass('valid');
      $(event.target.semestre).removeClass('valid');
      $(event.target.prereq).removeClass('valid');
      $(event.target.nome).blur();
      $(event.target.creditos).blur();
      $(event.target.semestre).blur();
      $(event.target.prereq).blur();
      $(event.target.codigo).blur();

      const modal_id = $($('.modal-trigger').leanModal()).attr("href");
      $(modal_id).closeModal();
      Bert.alert("Só atualizar! by Courses", 'danger', 'growl-top-right');
    } else {
      console.log(event.target.rga.value);
      console.log(event.target.nome.value);
      console.log(event.target.disciplina.value);
      console.log(event.target.situacao.value);
      console.log(event.target.ano.value);
      console.log(event.target.semestre.value);
      $(event.target.rga).removeClass('valid');
      $(event.target.nome).removeClass('valid');
      $(event.target.disciplina).removeClass('valid');
      $(event.target.situacao).removeClass('valid');
      $(event.target.ano).removeClass('valid');
      $(event.target.semestre).removeClass('valid');
      $(event.target.rga).blur();
      $(event.target.nome).blur();
      $(event.target.disciplina).blur();
      $(event.target.situacao).blur();
      $(event.target.ano).blur();
      $(event.target.semestre).blur();

      const modal_id = $($('.modal-trigger').leanModal()).attr("href");
      $(modal_id).closeModal();
      Bert.alert("Só atualizar! by Records", 'danger', 'growl-top-right');
    }
  },*/

  'click .edit': function(event) {
    event.preventDefault();
    var empty = (Records.find().count() == 0) ? 1 : 0;
    if (!this.rga && !empty)
      Bert.alert(BertMsg.courses.errorNotEmptyRecordsOnRemove, 'danger', 'growl-top-right');
    Session.set('editing', this);
  },

  'keyup #codigo': function(event) {
      Courses.update({ _id: this._id }, { $set: { codigo: parseInt(event.target.value) }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }

  },

  'keyup #nome': function(event) {
    if (!this.rga)
      Courses.update({ _id: this._id }, { $set: { nome: event.target.value }});
    else
      Records.update({ _id: this._id }, { $set: { nome: event.target.value }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #creditos': function(event){
    Courses.update({ _id: this._id }, { $set: { creditos: parseInt(event.target.value) }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #semestre': function(event){
    if (!this.rga)
      Courses.update({ _id: this._id }, { $set: { semestre: parseInt(event.target.value) }});
    else
      Records.update({ _id: this._id }, { $set: { semestre: parseInt(event.target.value) }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #prereq': function(event){
    Courses.update({ _id: this._id }, { $set: { prereq: event.target.value }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #rga': function(event){
    Records.update({ _id: this._id }, { $set: { rga: parseInt(event.target.value) }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #disciplina': function(event){
    Records.update({ _id: this._id }, { $set: { disciplina: event.target.value }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #situacao': function(event){
    Records.update({ _id: this._id }, { $set: { situacao: event.target.value }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },

  'keyup #ano': function(event){
    Records.update({ _id: this._id }, { $set: { ano: parseInt(event.target.value) }});
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      if ($(event.target).hasClass('valid'))
        $(event.target).removeClass('valid');
    }
  },
});
