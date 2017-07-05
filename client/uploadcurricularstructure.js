import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './uploadcurricularstructure.html'

Meteor.subscribe('disciplines');

Template.uploadcurricularstructure.onCreated(() => {
  Template.instance().uploading = new ReactiveVar( false );
});


Template.uploadcurricularstructure.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  'listaDisiciplinas': function(){
          var currentUserId = Meteor.userId();
          return Disciplines.find();
          //console.log(D)
          //return Disciplines.find(({ createdBy: currentUserId },
            //                      { sort: {codigo: 1, nome: 1} }));
  }
});


Template.uploadcurricularstructure.events({

  'change [name="uploadCSV"]': function ( event, template ) {

    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete( results, file ) {

        Meteor.call( 'uploadCurricularStruture', results.data, ( error, response ) => {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
          }
        });

      }
    });

  }

});
