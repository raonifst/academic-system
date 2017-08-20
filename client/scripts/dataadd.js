import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records"
import {Meteor} from 'meteor/meteor';


Template.modaladd.onRendered(function() {
  $(document).ready(function(){
    $('.modal-trigger').leanModal({
        dismissible: true,
        opacity: .5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%',
          //Materialize.updateTextFields();
      }
    );
  });
});

Template.modaladd.helpers({
  coursesOrRecords(collection) {
    if (collection == 'Disciplina')
      return 1;
    return 0;
  }
});

Template.add.events({
  'submit #addform': function(event) {
    event.preventDefault();
    const currentUserId = Meteor.userId();
    if (this.collection == 'Disciplina') {
      const data = [{
        codigo:       parseInt(event.target.codigo.value),
        nome:         event.target.nome.value,
        creditos:     parseInt(event.target.creditos.value),
        semestre:     parseInt(event.target.semestre.value),
        prereq:       parseInt(event.target.prereq.value),
        aprovacoes:   0,
        reprovacoes:  0,
        reincidencia: 0,
        aprov2:       0,
        perc_ap:      0,
        perc_reic:    0,
        perc_aprov2:  0,
        alunos:       0,
        createdBy:    currentUserId
      }];
      event.target.nome.value = '';
      event.target.creditos.value = '';
      event.target.semestre.value = '';
      event.target.prereq.value = '';
      event.target.codigo.value = '';
      $(event.target.nome).blur();
      $(event.target.creditos).blur();
      $(event.target.semestre).blur();
      $(event.target.prereq).blur();
      $(event.target.codigo).blur();

      const modal_id = $($('.modal-trigger').leanModal()).attr("href");
      $(modal_id).closeModal();

      //CRIAR METODO GENÉRICO PARA UPLOAD
      Meteor.call('uploadCoursesData', data);
      //Bert.alert("Método ainda não criado! by Courses", 'danger', 'growl-top-right');
    } else {
      const currentUserId = Meteor.userId();
      const data = [{
        rga:        parseInt(event.target.rga.value),
        nome:       event.target.nome.value,
        disciplina: event.target.disciplina.value,
        situacao:   event.target.situacao.value,
        ano:        parseInt(event.target.ano.value),
        semestre:   parseInt(event.target.semestre.value),
        createdBy:  currentUserId
      }];
      event.target.rga.value = '';
      event.target.nome.value = '';
      event.target.disciplina.value = '';
      event.target.situacao.value = '';
      event.target.ano.value = '';
      event.target.semestre.value = '';
      $(event.target.rga).blur();
      $(event.target.nome).blur();
      $(event.target.disciplina).blur();
      $(event.target.situacao).blur();
      $(event.target.ano).blur();
      $(event.target.semestre).blur();

      const modal_id = $($('.modal-trigger').leanModal()).attr("href");
      $(modal_id).closeModal();

      //CRIAR METODO GENÉRICO PARA UPLOAD
      Meteor.call('updateRecordsData', data);
    }
  }
});
