import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'

import './uploadacademicrecord.html';

Template.uploadacademicrecord.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.uploadacademicrecord.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});

Template.uploadacademicrecord.events({
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Meteor.call( 'updateAcademicRecordData', results.data, ( error, response ) => {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload completo!', 'success', 'growl-top-right' );
          }
        });
      }
    });
  }
});
