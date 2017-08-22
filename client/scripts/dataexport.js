import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records";
import Exporter from "../../imports/modules/exporter";
import { Meteor } from 'meteor/meteor'

Template.dataexport.helpers({
  uploaded(type) {
    const currentUser = Meteor.user();
    if (currentUser)
      if ((type == 'courses' && currentUser.uploadCoursesFlag) ||
          (type == 'records' && currentUser.uploadRecordsFlag))
            return 'btn-export  waves-effect waves-light';
    return 'disabled';
  },
});

Template.dataexport.events({
  'click .btn-export': function(type) {
    if (this.type == 'records') {
      const collection = Records.find().fetch();
      Exporter.records((collection), 'records');
    }
    else if (this.type == 'courses') {
      const collection = Courses.find().fetch();
      Exporter.courses((collection), 'courses');
    }
  }
});

Template.dataexample.events({
  'click .btn-example': function(type) {
    Exporter.csvexample(this.type);
  }
});
