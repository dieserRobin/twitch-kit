const TwitchBot = require('twitch-kit');
const Bot = new TwitchBot({
    username: "karpfenthebot",
    oauth: "oauth:XYZ",
    channels: [ "#dieserobin" ]
});

Bot.on('join', (channel) => {
    console.log('Connected to '+channel);
});

Bot.on('message', (chatter) => {

    var prefix = "!";
    var args = chatter.message.split(" ");

    if(chatter.message.charAt(0) === prefix) {

        if(args[0].toLowerCase() === "!hello") { 
            
            Bot.say(`Hello my friend ${chatter.display_name}!`);

        }

        if(args[0].toLowerCase() === "!info") {

            Bot.say(`This Bot was built with the amazing Bot Library, Twitch-Kit. Check it out at: https://www.npmjs.com/package/twitch-kit`);

        } 

    }
    
});
