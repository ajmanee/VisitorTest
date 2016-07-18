VisitorList = new Mongo.Collection ('visitors');

if (Meteor.isClient){


 Template.vistorsTemp.helpers({
   'visitor' : function () {
     var currentUserId = Meteor.userId ()
     return VisitorList.find({ createdBy: currentUserId},{sort: {score: -1, name: 1}});
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
      var visitorId = this._id;
      Session.set('selectedVisitor', visitorId);

    },
    'click .increment' : function (){
      alert('Are you sure to increment This visitor');
      var selectedVisitor = Session.get('selectedVisitor');
      Meteor.call('updateScore', selectedVisitor , 5);
    },
    'click .decrement' : function (){
      alert('Are you sure to decrement This visitor');
      var selectedVisitor = Session.get('selectedVisitor');
      //VisitorList.update({_id: selectedVisitor}, {$inc: {score: -5}}); // visitorList
      Meteor.call('updateScore', selectedVisitor , -5);
    },
    'click .remove' : function (){
      alert('Are you sure to remove This visitor');
      var selectedVisitor = Session.get('selectedVisitor');
      //VisitorList.remove({_id : selectedVisitor }) // this is a mongo statment without metod to remove from mongo
      Meteor.call('removeVisitor', selectedVisitor);
    }


  });


Template.addVisitor.events({
  'submit form' : function(){
    event.preventDefault();
    var visitorNameVar = event.target.visitorName.value;
    var visitorScoreVar = event.target.visitorScore.value;
    Meteor.call('createVisitor', visitorNameVar , Number (visitorScoreVar));
    event.target.visitorName.value = ""; // We use this to clear the text box
    event.target.visitorScore.value = ""; // We use this to clear the text box
    }
});

Meteor.subscribe('theVisitors'); // this to subscripe in the publish above

}




if (Meteor.isServer){
  // Publish will let you know what to see in the db even from console
  // So we define to show from Visiton collection but only which are belong to logged in user
  Meteor.publish('theVisitors', function(){
    var currentUserId = this.userId;
    return VisitorList.find({createdBy : currentUserId});
});
}



Meteor.methods({
  'createVisitor' : function (visitorNameVar , visitorScoreVar) {
    check (visitorNameVar,String);
    check (visitorScoreVar, Number);// This to check the variable is Number
    var currentUserId = Meteor.userId();
    if (currentUserId){
      VisitorList.insert({
        name: visitorNameVar,
        score: visitorScoreVar,
        createdBy: currentUserId
      });
    }

  },
  'removeVisitor' : function (selectedVisitor){
    check(selectedVisitor , String);
    var currentUserId = Meteor.userId();
    if (currentUserId){
      VisitorList.remove({_id : selectedVisitor, createdBy: currentUserId});
    }

  },
  'updateScore' : function (selectedVisitor ,scoreValue){
    check(selectedVisitor, String);
    check(scoreValue, Number);
    var currentUserId = Meteor.userId();
    if (currentUserId){
      VisitorList.update( {_id : selectedVisitor, createdBy: currentUserId},
        { $inc: {score : 5} });
    }
  }
});
