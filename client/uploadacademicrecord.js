import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import Exporter from './exporter';

import './uploadacademicrecord.html';

Template.uploadacademicrecord.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadacademicrecord.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});

Template.uploadacademicrecord.events({
  'change [name="uploadCSV"]'(event, template) {
    template.uploading.set(true);
    Papa.parse(event.target.files[0], {
      header: true,
      complete(results) {
        Meteor.call('updateAcademicRecordData', results.data, (error) => {
          if (error) {
            console.log(error.reason);
            return;
          }
          template.uploading.set(false);
          Bert.alert('Upload completo!', 'success', 'growl-top-right');
        });
      }
    });
  }
});
