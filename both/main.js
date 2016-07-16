VisitorList = new Mongo.Collection ('visitors');

if (Meteor.isServer){
  console.log( "server from both")
};

if (Meteor.isClient){
 Template.vistorsTemp.helpers({
   'visitor' : function () {
     return VisitorList.find({}, {sort: {score: -1, name: 1}});
   },
   'selectedClass' : function() {
     var visitorId = this._id ;
     var selectedVisitor = Session.get('selectedVisitor');
     if (visitorId == selectedVisitor){
      return "selected"
    }
  },
    'selectedVisitor' : function (){
    var selectedVisitor = Session.get('selectedVisitor');
      return VisitorList.findOne({_id : selectedVisitor});
   }

      });





  Template.vistorsTemp.events({
    'click .visitorli' : function() {
      var playerId = this._id;
      Session.set('selectedVisitor', playerId);

    },
    'click .increment' : function (){
      alert('Are you sure to increment This visitor');
      var selectedVisitor = Session.get('selectedVisitor');
      VisitorList.update({_id: selectedVisitor}, {$inc: {score: 5}});

    },
    'click .decrement' : function (){
      alert('Are you sure to decrement This visitor');
      var selectedVisitor = Session.get('selectedVisitor');
      VisitorList.update({_id: selectedVisitor}, {$inc: {score: -5}});
    },
    'click .remove' : function (){
      alert('Are you sure to remove This visitor');
      var selectedVisitor = Session.get('selectedVisitor');
      VisitorList.remove({_id : selectedVisitor })

    }


  });

Template.addVisitor.events({
  'submit form' : function(){
    event.preventDefault();
    var visitorNameVar = event.target.visitorName.value;
    var visitorScoreVar = event.target.visitorScore.value;
    VisitorList.insert({
      name : visitorNameVar,
      score : visitorScoreVar
    });
    event.target.visitorName.value = ""; // We use this to clear the text box
    }
});

    }
