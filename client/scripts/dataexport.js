import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";

/*-------------------- EXPORT COURSES --------------------*/
Template.exportdata.helpers({
  uploaded() {
    /*const currentUserId = Meteor.userId();
    const user = (currentUserId)? Users.findOne({ idUser: currentUserId }):null;
    return user && Users.findOne({ idUser: currentUserId }).uploadedCurricularStructure*/
    return true;
  }
});

Template.exportdata.events({
  'click .btn-export': function(type) {
    if (this.type == 'records')
      console.log('exportar records');
    else if (this.type == 'courses')
      console.log('exportar courses');
  }
});
