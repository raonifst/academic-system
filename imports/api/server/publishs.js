import {Meteor} from 'meteor/meteor'
import Courses from '../../api/collections/courses'
import Records from '../../api/collections/records'

Meteor.publish('courses', function () {
  return Courses.find({ createdBy: this.userId });
});

Meteor.publish('records', function () {
  return Records.find({ createdBy: this.userId });
});

Meteor.publish('user', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, {
      fields: {
        name:               1,
        gradProgram:        1,
        currentYear:        1,
        currentSemester:    1,
        passwordFlag:       1,
        uploadCoursesFlag:  1,
        uploadRecordsFlag:  1,
        navbarFixed:        1,
        menuFixed:          1,
      }
    });
  } else {
    this.ready();
  }
});
