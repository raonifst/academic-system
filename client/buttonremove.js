/*Template.buttonremovestructure.helpers({
  records: function () {
    return Records.find();
  }
});*/
Template.buttonremovestructure.events({
  "click .js-clearstructure": function () {
    Meteor.call('clearStructure');
  }
});

/*Template.buttonremoverecords.helpers({
  records: function () {
    return Records.find();
  }
});*/
Template.buttonremoverecords.events({
  "click .js-clearrecords": function () {
    Meteor.call('clearRecords');
  }
});
