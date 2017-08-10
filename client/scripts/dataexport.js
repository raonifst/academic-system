import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import Exporter from "../../imports/modules/exporter";
import { Meteor } from 'meteor/meteor'

Template.dataexport.helpers({
  uploaded(type) {
    const currentUser = Meteor.userId();
    if (currentUser)
      if ((type == 'courses' &&
          Meteor.users.findOne({_id: currentUser}).uploadCoursesFlag) ||
          (type == 'records' &&
          Meteor.users.findOne({ _id: currentUser }).uploadRecordsFlag))
            return 'btn-export  waves-effect waves-light';
    return 'disabled';
  },
});

Template.dataexport.events({
  'click .btn-export': function(type) {
    if (this.type == 'records')
      console.log('exportar records');
    else if (this.type == 'courses')
      console.log('exportar courses');
  }
});
