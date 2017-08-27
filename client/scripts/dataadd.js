import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

import { Meteor } from 'meteor/meteor';
import {Course} from "../../imports/modules/course";
import {AcademicRecord} from "../../imports/modules/academicrecord";

Template.modaladd.onRendered(function() {
  $(document).ready(function(){
    $('.modal-trigger').leanModal({
        dismissible: true,
        opacity: .5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%',
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
    if (this.collection == 'Disciplina') {
      const codigo    = event.target.codigo.value;
      const nome      = event.target.nome.value;
      const creditos  = event.target.creditos.value;
      const semestre  = event.target.semestre.value;
      const prereq    = event.target.prereq.value;
      const data      = [new Course(codigo, nome, creditos, semestre, prereq)];
      data[0].convertPrereqToArray();
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
      Meteor.call('uploadCoursesData', data);
    } else {
      const rga         = event.target.rga.value;
      const nome        = event.target.nome.value;
      const disciplina  = event.target.disciplina.value;
      const situacao    = event.target.situacao.value;
      const ano         = event.target.ano.value;
      const semestre    = event.target.semestre.value;
      const data        = [new AcademicRecord(rga, nome, disciplina, situacao, ano, semestre)];
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
      Meteor.call('updateRecordsData', data);
    }
  }
});
