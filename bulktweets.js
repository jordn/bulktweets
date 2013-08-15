TweetList = new Meteor.Collection("tweetlist");

if (Meteor.isClient) {

  Template.tweetform.tweetlist = function () {
    var userId = Meteor.user()._id
    if (Meteor.user() && TweetList.findOne({user: userId})) {
      var userId = Meteor.userId();
      var textarea = TweetList.findOne({user: userId}).textarea
    } else {
      var textarea = "I'm using Bulk Tweets to automate tweeting :D";
    }
    return textarea
  };



  Template.content.users = function () {
    return Meteor.users.find();
  };



  Template.tweetform.events({
    'click #save-button' : function (event) {
      var textarea = $('#tweetlist').val();
      console.log(textarea);
      if (Meteor.user()) {
        var userId = Meteor.userId();
        if (TweetList.findOne({user: userId})) {
          var tweetListId = TweetList.findOne({user: userId})._id
          console.log('updating')
          TweetList.update({_id: tweetListId}, {user: userId, textarea: textarea});
        } else {
          TweetList.insert({user: userId, textarea: textarea});
        }
      } else {
        console.log('Must be logged in to save')
      }; 
    }
  });


  Template.tweetform.events({
    'click #tweet-button' : function (event) {
      // template data, if any, is available in 'this'
      console.log("You pressed the button");
      var tweetText = $('#tweetlist').val();
      var tweets = tweetText.split('\n');
      tweets = _.reject(tweets, function(item) {
        return item === "";
      })

      var tweetIndex = _.random(0, tweets.length-1)
      var tweet = tweets[tweetIndex];
      console.log(tweet);
      Meteor.call("postTweet", tweet, function(err,result) {
          if(!err) {
              alert(tweet +" posted");
          }
          else {
            console.log(err);
          }
      }); 
    }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // if (TweetList.find().count() === 0) {
    //   TweetList.insert({textarea: 'Tweet 1'});
    // }
  });
  var twitter = new Twitter();
  Meteor.methods({
      postTweet: function (text) {
          if(Meteor.user())
            twitter.postTweet(text);
            return true;
      }
  });


}
