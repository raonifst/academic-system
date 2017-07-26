Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'studentsnocoursed', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});
Template.search.helpers({
  studentsnocoursed() {
    let courseName = Template.instance().searchQuery.get();
    let b = [];
    console.log(courseName);
    let studentsnocoursed = [];
    Records.find().forEach(
      function(p){b.push(p.nome)
      });
    if (courseName) {
    let regex = new RegExp(courseName, 'i');
    Records.find({disciplina: regex, situacao: "AP"}, {_id:0}).forEach(
      function(rec){studentsnocoursed.push(rec.rga)
      });
      let a = [];
      console.log(studentsnocoursed);
      Records.find({'rga':{'$nin':studentsnocoursed}},{sort:{rga:1}}).forEach(
        function(rec){a.push(rec.nome)
        });
        var distinctArray = _.uniq(a)
        //console.log(distinctArray);
        return distinctArray;
      }
      else{
        var distinctArray = _.uniq(b)
        return distinctArray;
      }
      /*_.each(teste, function(h) {
        a.push([h.nome]);
      });*/
      //console.log(a);

  }
});
Template.search.events({
  'keyup [name="search"]' ( event, template ) {
    let value = event.target.value.trim();
    if ( value !== '' && event.keyCode === 13 ) {
      template.searchQuery.set( value );
    }

    if ( value === '' ) {
      template.searchQuery.set( value );
    }
  }
});
