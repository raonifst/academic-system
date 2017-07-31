/* Publicações do servidor devem ser declaradas aqui */

import {Meteor} from 'meteor/meteor';


Meteor.publish('userStats', function () {
  return Users.find({ idUser: this.userId });
});


Meteor.publish('courses', function () {
  return Courses.find({});
});
