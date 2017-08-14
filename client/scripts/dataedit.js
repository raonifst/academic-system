import { Session } from 'meteor/session';

Template.edit.onRendered(function() {
  $(document).ready(function() {
    $('.modal-trigger').leanModal({
      dismissible: true,
      opacity: .5,
      inDuration: 300,
      outDuration: 200,
      startingTop: '4%',
      endingTop: '10%',
      complete() {
        console.log("Complete");
        Materialize.updateTextFields(); // BUG: Atualiza os campos value
      },
      ready(modal, trigger) {
        console.log("Ready");
        Materialize.updateTextFields();
      },
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
  },
});

Template.editcourse.helpers({
  edit(){
    return Session.get('editing');
  },
});

Template.editrecord.helpers({
  edit(){
    return Session.get('editing');
  },
});

Template.edit.events({
  'submit form': function(event) {
    event.preventDefault();
    if (!(this.rga)) {
      console.log(event.target.codigo.value);
      console.log(event.target.nome.value);
      console.log(event.target.creditos.value);
      console.log(event.target.semestre.value);
      console.log(event.target.prereq.value);
      /*event.target.nome.value = '';
      event.target.creditos.value = '';
      event.target.semestre.value = '';
      event.target.prereq.value = '';
      event.target.codigo.value = '';*/
    } else {
      console.log(event.target.rga.value);
      console.log(event.target.nome.value);
      console.log(event.target.disciplina.value);
      console.log(event.target.situacao.value);
      console.log(event.target.ano.value);
      console.log(event.target.semestre.value);
      /*event.target.rga.value = '';
      event.target.nome.value = '';
      event.target.disciplina.value = '';
      event.target.situacao.value = '';
      event.target.ano.value = '';
      event.target.semestre.value = '';*/
    }
  },

  'click .edit': function(event) {
    event.preventDefault();
    Session.set('editing', this);
  },
});
