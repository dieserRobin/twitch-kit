# Twitch Kit

With this package, you can easily build a powerful Twitch Bot.

# Installation Info

`npm install twitch-kit`

# Getting started

```
const TwitchBot = require('twitch-kit');
const Bot = new TwitchBot({
    username: "karpfenthebot",
    oauth: "oauth:XYZ",
    channels: [ "#dieserobin" ]
});


/**
    This Event will be called when the Bot connects to a Twitch Chat.
    The Channel String will look like this:

    #dieserobin
 */

Bot.on('join', (channel) => {
    console.log('Connected to '+channel);
});

/**
    This Event will be called if a Message is sent into the Chat.
    The Chatter Object will look like this:

    { 
        badge_info: null,
        badges: { broadcaster: 1, 'glhf-pledge': 1 },
        client_nonce: 'b48dcd7b5a3bb765b7c86fe64b797b15',
        color: '#FF0000',
        display_name: 'dieserobin',
        emotes: null,
        flags: null,
        id: '2d8a3377-4d03-4796-aef5-82c7dbf40a76',
        mod: true,
        room_id: 144258400,
        subscriber: false,
        tmi_sent_ts: 1594847963605,
        turbo: false,
        user_id: 144258400,
        user_type: null,
        channel: '#dieserobin',
        message: '123',
        username: 'dieserobin' 
    }

    NOTE: A user counts as Moderator if he is Broadcaster.
 */

Bot.on('message', (chatter) => {
    /**
        To send an Message you can use:
        Bot.say('Message', '#channel');
    
        To Timeout a User you can type:
        Bot.timeout(username, duration, reason, #channel);
    
        To Untimeout:
        Bot.removeTimeout(username,channel);

        To Ban a User you can do almost the same:
        Bot.ban(username, reason, #channel);

        To unban:
        Bot.removeBan(username, channel);

        To Activate Follower Chat you can type:
        Bot.followerChat(state<TRUE = ACTIVATE, FALSE = DEACTIVATE>, #channel, duration<OPTIONAL>);

        To Activate Subscriber Chat you can type:
        Bot.subscriberChat(state<TRUE = ACTIVATE, FALSE = DEACTIVATE>, #channel);

        To Activate Unique Chat you can type:
        Bot.uniqueChat(state<TRUE = ACTIVATE, FALSE = DEACTIVATE>, #channel);

        To Activate Slow Chat you can type:
        Bot.slowChat(state<TRUE = ACTIVATE, FALSE = DEACTIVATE>, #channel, delay);

        To Clear the Chat you can type:
        Bot.clearChat(#channel);

        To Give an User Moderator Role you can type:
        Bot.setMod(username, channel);

        To remove:
        Bot.removeMod(username, channel);

        To Give an User VIP Role you can type:
        Bot.setVIP(username, channel);

        To remove:
        Bot.removeVIP(username, channel);

        To Set the Color of the Bot write:
        Bot.setColor(color);

        To Update the Stream Title type:
        Bot.updateTitle(title, channel);

        To Update the Game type:
        Bot.updateGame(game, channel);

        To Get Informations about a Channel type:
        Bot.getChannel(channel);
    */

    if(chatter.message.toLowerCase().includes("asshole")) {
        Bot.timeout(chatter.username, 600, 'Insult');
    }

    if(chatter.message.includes('!ping')) {
        Bot.say(chatter.username + ", PONG!")
    }
});

/**
    This Event will be called if a Error occurs.
 */

Bot.on('error', (err) => {
    console.log(err);
})

/**
    This Event is only for Development purposes and shows you every Response the Twitch Server sends, you don't need to use.
 */

Bot.on('ircdata', (data) => console.log(data));

/**
    This Event will be called if an User gets an timeout in the Chat.
    The Event Object look like this:

    { 
        ban_duration: 60,
        room_id: 144258400,
        target_user_id: 187990039,
        tmi_sent_ts: 1594848491208,
        type: 'timeout',
        channel: '#dieserobin',
        target_username: 'mrscalo' 
    }
 */

Bot.on('timeout', (event) => {
    Bot.say(`The User ${event.target_username} got an Timeout for ${event.ban_duration}.`);
})

/**
    This Event will be called if an User gets an Ban in the Chat.
    The Event Object look like this:

    { 
        room_id: 144258400,
        target_user_id: 187990039,
        tmi_sent_ts: 1594848674269,
        type: 'ban',
        channel: '#dieserobin',
        target_username: 'mrscalo' 
    }
 */

Bot.on('ban', (event) => {
    Bot.say(`The User ${event.target_username} was banned.`);
})
/**
    NEW

    This Event will be called if a Message gets Deleted in the Chat.
    The Event will look like this:

    {
        type: "delete",
        target_username: "shortbyte",
        channel: "dieserobin",
        room_id: "144258400" // May be Empty because Twitch does not send this Information all the times.,
        tmi_sent_ts: "1594848674269",
        msg_id: "MSG ID"
    }
*/
Bot.on('messagedeletion', (event) => {
    Bot.say(`The Message "${event.msg_id} from ${event.target_username} was deleted."`);
});


```

# Docs

## Events

## join

This Event will be called when the Bot connects to a Twitch Chat.
The Channel String will look like this:

#dieserobin

### message

This Event will be called if a Message is sent into the Chat.
The Chatter Object will look like this:

```
    { 
        badge_info: null,
        badges: { broadcaster: 1, 'glhf-pledge': 1 },
        client_nonce: 'b48dcd7b5a3bb765b7c86fe64b797b15',
        color: '#FF0000',
        display_name: 'dieserobin',
        emotes: null,
        flags: null,
        id: '2d8a3377-4d03-4796-aef5-82c7dbf40a76',
        mod: true,
        room_id: 144258400,
        subscriber: false,
        tmi_sent_ts: 1594847963605,
        turbo: false,
        user_id: 144258400,
        user_type: null,
        channel: '#dieserobin',
        message: '123',
        username: 'dieserobin' 
    }
```
NOTE: A user counts as Moderator if he is Broadcaster.

### timeout

This Event will be called if an User gets an timeout in the Chat.
The Event Object look like this:
```
{ 
    ban_duration: 60,
    room_id: 144258400,
    target_user_id: 187990039,
    tmi_sent_ts: 1594848491208,
    type: 'timeout',
    channel: '#dieserobin',
    target_username: 'mrscalo' 
}
```

### ban

This Event will be called if an User gets an Ban in the Chat.
The Event Object look like this:
```
{ 
    room_id: 144258400,
    target_user_id: 187990039,
    tmi_sent_ts: 1594848674269,
    type: 'ban',
    channel: '#dieserobin',
    target_username: 'mrscalo' 
}
```

### error 

This Event is only for Development purposes and shows you every Response the Twitch Server sends, you don't need to use.

### ircdata

This Event is only for Development purposes and shows you every Response the Twitch Server sends, you don't need to use this.

### messagedeletion

NEW
```
This Event will be called if a Message gets Deleted in the Chat.
The Event will look like this:

{
    type: "delete",
    target_username: "shortbyte",
    channel: "dieserobin",
    room_id: "144258400" // May be Empty because Twitch does not send this Information all the times.,
    tmi_sent_ts: "1594848674269",
    msg_id: "MSG ID"
}
```

## Functions

### say

Send Message to Channel

Parameters: 
- Message: String (>= 500)
- Channel Name: String

### timeout

Timeout a specific User in Channel

Parameters:
- Username: String
- Duration: String
- Reason: String
- Channel Name: String

### ban

Ban a specific User in a Channel

Parameters:
- Username: String
- Reason: String
- Channel Name: String

### removeTimeout

Untimeout a specific User in a Channel

Parameters:
- Username: String
- Channel Name: String

### removeBan

Unban a specific User in a Channel

Parameters:
- Username: String
- Channel Name: String

### followerChat

Set Chat to Only Follower Chat

Parameters:
- State: Boolean
- Channel Name: String
- Duration <OPTIONAL>: Number

### subscriberChat

Set Chat to Only Subscriber Chat

Parameters:
- State: Boolean
- Channel Name: String

### uniqueChat

Set Chat to Unique Mode

Parameters: 
- State: Boolean
- Channel Name: String

### slowChat

Set Chat in Slow Mode

Parameters: 
- State: Boolean
- Channel Name: String
- Delay: Number

### clearChat

Clear the Chat

Parameters:
- Channel Name: String

### setMod

Add a new Mod to Channel (Requires Broadcaster)

Parameters:
- Username: String
- Channel Name: String

### removeMod

Remove a Mod from Channel (Requires Broadcaster)

Parameters:
- Username: String
- Channel Name: String

### setVIP

Add a new VIP to Channel (Requires Broadcaster)

Parameters:
- Username: String
- Channel Name: String

### removeVIP

Remove a VIP from Channel (Requires Broadcaster)

Parameters:
- Username: String
- Channel Name: String

### setColor

Set Color of Bot

Parameters:
- Color: String

### updateTitle

Update Stream Title (Requires Editor)

Parameters: 
- Title: String
- Channel Name: String

### updateGame

Update Stream Game (Requires Editor)

Parameters: 
- Game: String
- Channel Name: String

### getChannel

Get Channel Information

Parameters:
- Channel Name: String

# License
This Project is licensed under the MIT License, read more in the [License](LICENSE) file.

This Package was built by [Robin Klein](https://robin.software).
