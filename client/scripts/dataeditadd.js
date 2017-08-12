import Courses from "../../imports/api/collections/courses";
import Records from "../../imports/api/collections/records"

Template.modaladd.helpers({
  coursesOrRecords(collection) {
    if (collection == 'Disciplina')
      return 1;
    return 0;
  }
});

Template.addcourse.events({
  'submit form': function(event) {
    event.preventDefault();
    console.log(event.target.codigo.value);
  }
});
