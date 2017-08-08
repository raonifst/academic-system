import Courses from '../../imports/api/collections/courses'

/*--------------- TABLE CURRICULAR STRUCTURE ---------------*/

Template.tablecurricularstructure.helpers({
  listaDisiciplinas() {
    var currentUserId = Meteor.userId();
    return Courses.find();
  },

  /*uploaded() {
    const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }) : null;
    return user && Users.findOne({ idUser: currentUserId }).courses;
  },*/

  settings() {
    return {
      rowsPerPage: 10,
      showFilter: true,
      fields: [
        { key: 'codigo',    label: 'Codigo',                    cellClass: 'col-md-4' },
        { key: 'nome',      label: 'Nome',                      cellClass: 'col-md-4' },
        { key: 'creditos',  label: 'Créditos',                  cellClass: 'col-md-4' },
        { key: 'perc_ap',   label: 'Aprovações',                cellClass: 'col-md-4' },
        { key: 'perc_reic', label: 'Reincidencia',              cellClass: 'col-md-4' },
        { key: 'perc_reic', label: 'Aprovado pela segunda vez', cellClass: 'col-md-4' },
      ]
    };
  },
});
