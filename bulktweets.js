TweetList = new Meteor.Collection("tweetlist");

if (Meteor.isClient) {

  Template.tweetform.tweetlist = function () {
    var userId = Meteor.userId()
    if (Meteor.user() && TweetList.findOne({user: userId})) {
      console.log('saved exists')
      var textarea = TweetList.findOne({user: userId}).textarea;
    } else {
      var textarea = "I'm using Bulk Tweets to automate tweeting :D";
    }
    return textarea
  };

  Template.content.users = function () {
    return Meteor.users.find();
  };


  Template.tweetform.events({
    'click #save-button' : function(event) {
      save_textarea(event);
    },
    'keyup #tweet-list' : function(event) {
      save_textarea(event);
    },
    'change #tweet-list' : function(event) {
      save_textarea(event);
    },
    
  });

  Template.tweetform.events({
    'click #tweet-button' : function (event) {
      // template data, if any, is available in 'this'
      console.log("You pressed the button");
      var tweetText = $('#tweet-list').val();
      tweet_randomly(tweetText);
    }
  });
}

function save_textarea (event) {
  var textarea = $('#tweet-list').val();
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



function tweet_randomly (tweetText) {
  var tweets = tweetText.split('\n');
  tweets = _.reject(tweets, function(item) {
    return item === "";
  })
  var tweetIndex = _.random(0, tweets.length-1)
  var tweet = tweets[tweetIndex];
  console.log(tweet);
  Meteor.call("postTweet", tweet, function(err,result) {
      if(!err) {
          console.log(tweet +" posted");
      }
      else {
        console.log(err);
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

  // currentUserId = null;
  // Meteor.publish(null, function() {
  //     currentUserId = this.userId;
  // });


  var twitter = new TwitterApi();
  Meteor.methods({
      postTweet: function (text) {
          // console.log(Meteor.user());
          if(Meteor.user()) {
            console.log('there is a user')
            twitter.postTweet(text);
            return true;
          }
          else {
            console.log('not logged in')
            return false;
          }
      }
  });

  // var tweetCron = new Cron(1000);
  // tweetCron.addJob(6, function() {
  //   console.log('tick');
  //   var userId = currentUserId
  //   console.log(currentUserId)
  //   if (TweetList.findOne({user: userId})) {
  //     console.log('logged in with list')
  //     var textarea = TweetList.findOne({user: userId}).textarea;
  //     tweet_randomly(textarea);
  //   } 
  // })


}
