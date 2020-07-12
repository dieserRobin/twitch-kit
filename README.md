# Twitch Kit

With this package, you can easily build a powerful Twitch Bot.

# Installation Info

`npm install twitch-kit`

# Getting started

```
const TwitchBot = require('twitch-kit');
const Bot = new TwitchBot({
    username: "karpfenthebot",
    oauth: "oauth: TOKEN",
    channels=["dieserobin"],
    port=443,
    pubsub=true,
    topics=['channel-points-channel-v1']
})

Bot.on("join", channel => {
    Bot.say("Hello World!");
})

Bot.on("error", error => {
    console.log(error);
})

Bot.on("message", chatter => {
    console.log("Hello "+chatter.username);
})

Bot.on("data", data => {
    console.log(data);
})
```

# License
This Project is licensed under the MIT License, read more in the [License](LICENSE) file.

This Package was built by [Robin Klein](https://robin.software).
