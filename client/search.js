Template.search.onCreated(() => {
  Template.instance().courseName = new ReactiveVar('');
  Template.instance().isStudent = new ReactiveVar(true);
  Template.instance().countStudentsWhoMustEnrollInACourse = new ReactiveVar(0);
  Template.instance().countStudentsWhoHavePrerequisitesForACourse = new ReactiveVar(0);
});
Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
});
function hash2array(map) {
  let array = [];
  Object.keys(map).forEach(function(key){
    array.push(map[key]);
  });
  return array;
}
/*Funcao auxiliar para queries*/
function auxStudentsWhoMustEnrollInACourse(courseName){

    let studentsApprovedInCourse = [];
    Records.find({disciplina: courseName, situacao: "AP"}, {_id: 0}).forEach(
                  function(rec){studentsApprovedInCourse.push(rec.rga)
                });

    var map = {};

    Records.find( { 'rga': {'$nin': studentsApprovedInCourse}}, { sort: { rga: 1 } } ).forEach(
                   function(rec){
                     if(!map[rec.rga]) {
                        map[rec.rga] = {
                           nome: rec.nome,
                           rga: rec.rga
                       }
                     }
                   });

    return hash2array(map);
}

Template.search.helpers({
  isStudent: function() {
    return Template.instance().isStudent.get();
  },

  settings: function () {
      return {
          rowsPerPage: 10,
          showFilter: true,
          fields: [
            { key: 'rga', label: 'RGA' , cellClass: 'col-md-4'},
            { key: 'nome', label: 'Nome' , cellClass: 'col-md-4'}
          ]
      };
  },

  countStudentsWhoMustEnrollInACourse: function() {
    Template.search.__helpers.get('studentsWhoMustEnrollInACourse').call();
    return Template.instance().countStudentsWhoMustEnrollInACourse.get();
  },
  countStudentsWhoHavePrerequisitesForACourse: function() {
    Template.search.__helpers.get('studentsWhoHavePrerequisitesForACourse').call();
    return Template.instance().countStudentsWhoHavePrerequisitesForACourse.get();
  },


  studentsWhoHavePrerequisitesForACourse: function(){

    let courseName = Template.instance().courseName.get();
    //console.log(courseName)
    if(courseName != '') {
      let candidates = auxStudentsWhoMustEnrollInACourse(courseName);
      //console.log(courseName)
      courseId = Disciplines.findOne({nome: courseName}, {fields:{_id:1}});
      courseId = courseId==null?'':courseId._id;
      //console.log(courseId);
      let prereq = CurricularStructure.findOne({idDisciplina: courseId}, {fields: {prereq: 1}});
      prereq = prereq == null?[]:prereq.prereq;
    var map = {};
    //console.log(prereq)
    candidates.forEach(function(student) {
      let count = 0;
      prereq.forEach(function(code) {

        courseName = Disciplines.findOne({_id: code}, {fields: {nome: 1}}).nome;
        let exist = Records.findOne({rga: student.rga, disciplina: courseName, situacao: "AP"}, {_id: 0});
        if(exist)
          count = count + 1;
      });

      if(count == prereq.length) {

        map[student.rga] = {
           nome: student.nome,
           rga: student.rga
       }
      }
    });
      let result = hash2array(map);
      Template.instance().countStudentsWhoHavePrerequisitesForACourse.set(result.length);
      return result;
    }
    else { Template.instance().countStudentsWhoHavePrerequisitesForACourse.set(0);return [{}]};
  },

  studentsWhoMustEnrollInACourse: function(){
      let courseName = Template.instance().courseName.get();
      if(courseName == '') {
        Template.instance().countStudentsWhoMustEnrollInACourse.set(0);
        return [{}];
      }
      let result = auxStudentsWhoMustEnrollInACourse(courseName);
      Template.instance().countStudentsWhoMustEnrollInACourse.set(result.length);
      return result;
  }


})
Template.search.events({
  'keyup [name="search"]' ( event, template ) {
    let value = event.target.value.trim();
    if ( value !== '' && event.keyCode === 13 ) {
      Template.instance().courseName.set( value );
    }

    if ( value === '' ) {
      Template.instance().courseName.set( value );
    }
  }
});
