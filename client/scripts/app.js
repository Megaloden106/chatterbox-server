<<<<<<< HEAD
// YOUR CODE HERE:

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  friends: new Set,
  rooms: new Set
};

app.init = function() {
  this.fetch();
  // add username to profile
  $('.currentUser')[0].textContent = window.location.search.split('=')[1];
};

app.send = function(message) {
  debugger;
  
  
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  
};

app.fetch = function() {
  this.clearMessages();
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function(obj) {
      console.log(obj);
      obj.results.forEach(value => {
        app.renderMessage(value);
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
  
};

app.clearMessages = function() {
  // clear feed
  $('#chats').empty();
};

app.renderMessage = function(message) {
  var post = document.createElement('div');
  $(post).addClass('message');
  
  //Need to make Time Safeeeee
  // var time;
  // if (message.createdAt < message.updatedAt) {
  //   time = message.updatedAt;
  // } else {
  //   time = message.createdAt;
  // } 
  
  var user = document.createElement('p');
  $(user).addClass('username');
  var userText = document.createTextNode(message.username);
  $(user).append(userText);
  $(post).append(user);
  
  var roomname = document.createElement('p');
  $(roomname).addClass('roomname');
  var roomText = document.createTextNode(message.roomname);
  $(roomname).append(roomText);  
  $(post).append(roomname);
  console.log(roomText.value);
  let roomSize = this.rooms.size;
  this.rooms.add(roomText.wholeText);
  //if size of rooms increase, add option
  if (this.rooms.size > roomSize) {
    var opt = document.createElement('option');
    opt.textContent = roomText.wholeText;
    opt.value = roomText.wholeText;
    if(document.getElementById('select')){
      document.getElementById('select').appendChild(opt);
    }
    // buttons
    
    var roomButton = document.createElement('button');
    roomButton.innerText = roomText.wholeText;
    roomButton.value = roomText.wholeText;
    document.getElementsByClassName('rooms')[0].appendChild(roomButton);
    $(roomButton).click(this.renderRoom.bind());
  }
    
  var text = document.createElement('div');
  $(text).addClass('text');
  var textText = document.createTextNode(message.text);
  $(text).append(textText);
  $(post).append(text);
    
  // var time = document.createElement('p');
  // $(time).addClass('time');
  // var timeText = document.createTextNode(time);
  // $(time).append(timeText);  
  // $(post).append(time);
  
  $('#chats').append(post);
  $(user).click(this.handleUsernameClick.bind(this));
  // this.renderRoom();
  
};

app.renderRoom = function(room) {
  // filter messages by room
  // clear messages
  // populate with messages with matching
  
  var messages = document.getElementsByClassName('message');
  for (var i =0; i < messages.length; i++) {
    if (messages[i].children[1].innerText !== event.target.innerText) {
      debugger;
      messages[i].remove();
      i--;
    }
  }
  
  // var post = document.createElement('div');
  // post.append('<p></p>');
  // $('#roomSelect').append(post);

};

app.handleUsernameClick = function() {
  var size = this.friends.size;
  
  if (event === undefined) {
    return 'Click on a friend!';
  }
  
  this.friends.add(event.target.innerHTML);
  if (this.friends.size === size) {
    this.friends.delete(event.target.innerHTML);
    // remove friend fron friendList div
      // remove friend node
    document.getElementsByClassName(event.target.innerText)[0].remove();
  } else {
    // add to friendList div
    //format friend node
    var friendNode = document.createElement('div');
    $(friendNode).addClass(`${event.target.innerHTML}`)
    document.getElementById('friendList').appendChild(friendNode);
    //give friend node onclick event to sort feed
    document.getElementsByClassName(event.target.innerText)[0].click(this.sortByFriend.bind());
    
    var friendName = document.createElement('h5');
    friendName.innerText = event.target.innerText;
    document.getElementsByClassName(event.target.innerHTML)[0].appendChild(friendName);
    
  }
  
  //iterate through messages
  //if username is in friends add class friend;
  var messages = document.getElementsByClassName('message');
  for (var i =0; i < messages.length; i++) {
    if (this.friends.has(messages[i].children[0].innerText)) {
      $(messages[i].children[2]).addClass('friend');
    } else if($(messages[i].children[2]).hasClass('friend')) {
      $(messages[i].children[2]).removeClass('friend');
    }
  }
  
  
};

app.handleSubmit = function() {
  debugger;
  // write a message
  // click submit button
  // send message to server using this.send
  // update Data
  if(document.getElementsByName('roomname')[0].value==="Create New Room"){
    var roomNameValue = document.getElementsByName('newRoom')[0].value;
  }else{
    var roomNameValue = document.getElementsByName('roomname')[0].value;
  }
  
  var message = {
    username: window.location.search.split('=')[1],
    text: document.getElementsByName('text')[0].value,
    roomname: roomNameValue, // TODO
  };
  this.send(message);
  
  document.getElementsByName('text')[0].value = '';
  this.fetch();
  
};

app.sortByFriend = function() {
  // go through messages
  // delete nodes that don't have matching username
  var messages = document.getElementsByClassName('message');
  
  for (var i = 0; i < messages.length; i++) {
    if (messages[i][0] !== event.target.innerText) {
      messages[i].remove();
      i--;
    }
  }
}
=======

var app = {

  //TODO: The current 'handleUsernameClick' function just toggles the class 'friend'
  //to all messages sent by the user
  server: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  lastMessageId: 0,
  friends: {},
  messages: [],

  init: function() {
    // Get username
    app.username = window.location.search.substr(10);

    // Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(function() {
      app.fetch(true);
    }, 3000);
  },

  send: function(message) {
    app.startSpinner();

    // POST the message to the server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // Clear messages input
        app.$message.val('');

        // Trigger a fetch to update the messages, pass true to animate
        app.fetch();
      },
      error: function (error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },

  fetch: function(animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: { order: '-createdAt' },
      success: function(data) {
        // Don't bother if we have nothing to work with
        if (!data.results || !data.results.length) { return; }

        // Store messages for caching later
        app.messages = data.results;

        // Get the last message
        var mostRecentMessage = data.results[data.results.length - 1];

        // Only bother updating the DOM if we have a new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // Update the UI with the fetched rooms
          app.renderRoomList(data.results);

          // Update the UI with the fetched messages
          app.renderMessages(data.results, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessages: function(messages, animate) {
    // Clear existing messages`
    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(messages)) {
      // Add all fetched messages that are in our current room
      messages
        .filter(function(message) {
          return message.roomname === app.roomname ||
                 app.roomname === 'lobby' && !message.roomname;
        })
        .forEach(app.renderMessage);
    }

    // Make it scroll to the top
    if (animate) {
      $('body').animate({scrollTop: '0px'}, 'fast');
    }
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          // Add the room to the select menu
          app.renderRoom(roomname);

          // Store that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    app.$roomSelect.append($option);
  },

  renderMessage: function(message) {
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    // Create a div to hold the chats
    var $chat = $('<div class="chat"/>');

    // Add in the message data using DOM methods to avoid XSS
    // Store the username in the element's data attribute
    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

    // Add the friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // Add the message to the UI
    app.$chats.append($chat);

  },

  handleUsernameClick: function(event) {

    // Get username from data attribute
    var username = $(event.target).data('username');

    if (username !== undefined) {
      // Toggle friend
      app.friends[username] = !app.friends[username];

      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

      // Add 'friend' CSS class to all of that user's messages
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function(event) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;

        // Add the room to the menu
        app.renderRoom(roomname);

        // Select the menu option
        app.$roomSelect.val(roomname);
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.roomname = app.$roomSelect.val();
    }
    // Rerender messages
    app.renderMessages(app.messages);
  },

  handleSubmit: function(event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);

    // Stop the form from submitting
    event.preventDefault();
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};
>>>>>>> d845bbad78c96b5d8832bf5feed219b5920963b4
