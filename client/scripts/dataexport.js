import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import Exporter from "../../imports/modules/exporter";

/*-------------------- EXPORT COURSES --------------------*/
Template.dataexport.helpers({
  uploaded() {
    /*const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }):null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure
    if (true)*/ return 'btn-export  waves-effect waves-light';
    /*else */ return 'disabled';
  }
});

Template.dataexport.events({
  'click .btn-export': function(type) {
    if (this.type == 'records')
      console.log('exportar records');
    else if (this.type == 'courses')
      console.log('exportar courses');
  }
});
