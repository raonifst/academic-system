import {Meteor} from 'meteor/meteor'
import Courses from '../../api/collections/courses'
import Records from '../../api/collections/records'

Meteor.publish('courses', function () {
  return Courses.find({ createdBy: this.userId });
});

Meteor.publish('records', function () {
  return Records.find({ createdBy: this.userId });
});
