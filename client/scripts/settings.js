/*--------------- LAYOUT HELPERS ---------------*/

Template.navbar.helpers({
  navbarFixed() {
    if (1)
      return 'navbar-fixed';
    else return '';
  },

  menuFixed() {
    if (1)
      return 'fixed';
    else return '';
  },
});

/*--------------- SETTINGS NAVBAR ---------------

Template.settingsNavbar.helpers({
  settings() {
    console.log(Settings.find().fetch());
    return Settings.find();
  },

  navbarchecked() {
    //console.log(this._id, this.navbarchecke);
    if(this.navbarchecked){
      return 'checked';
    } else {
      return '';
    }
  },
});

Template.settingsNavbar.events({
  'change .checkbox': function(event){
    console.log(this._id, this.navbarchecke);
    if (this.navbarchecke) {
      //Settings.update({ _id: this._id }, { $set: { navbarFixed: false }});
    } else {
      //Settings.update({ _id: this._id }, { $set: { navbarFixed: true }});
    }
  },
});
*/
