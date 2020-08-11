'use strict'

const tls = require('tls');
const assert = require('assert');
const utils = require('./utils');
const api = require('./api');
const EventEmitter = require('events').EventEmitter;
const WebSocket = require('websocket').w3cwebsocket;
let ws; 

const TwitchBot = class TwitchBot extends EventEmitter {
    constructor({
        username,
        oauth,
        channels=[],
        port=443
    }) {
        super();

        try{
            assert(username);
            assert(oauth);
        } catch(err) {
            throw new Error('invalid arguments');
        }
        this.username = username;
        this.oauth = oauth;
        this.port = port;
        this.channels = channels;
        this.irc = new tls.TLSSocket();
        //this.pubsub = pubsub;
        //this.topics = topics;

        this._connect();
        //if(this.pubsub) {
        //    this.connectSub();
        //}
    }

    async _connect() {
       this.irc.connect({
           host: 'irc.chat.twitch.tv',
           port: this.port
       });
       this.irc.setEncoding('utf-8');
       this.irc.once('connect', () => {
        this.irc.on('error', err => this.emit('error', err));
        this.listen();
        
        this.write("PASS "+this.oauth);
        this.write("NICK "+this.username);

        this.channels.forEach(channel => this.join(channel));

        this.write("CAP REQ :twitch.tv/tags");
        this.write("CAP REQ :twitch.tv/membership");
        this.write("CAP REQ :twitch.tv/commands");

        this.emit('connected');
       });
    }

    async write(message) {
        this.irc.write(message + "\r\n");
    }

    async join(channel) {
        utils.formatCHANNEL(channel);
        this.write("JOIN "+channel);
    }

    async check(text) {
        let res = await utils.checkErrors(text);
        switch (res) {
            case "LOGIN":
                this.irc.emit('error', { message: "Login authentication failed" });
                break;
        
            case "AUTH":
                this.irc.emit('error', { message: "Improperly formatted auth" });
                break;

            case "SPAM":
                this.irc.emit('error', { message: "Your message was not sent because you are sending messages too quickly" });
                break;

            case "OK":
                break;
        }
    }

    async leave(channel) {
        if(!channel && this.channels.length > 0) {
            channel = this.channels[0];
        }

        channel = utils.formatCHANNEL(channel);
        this.write("PART " + channel);
    }

    async listen() {
        this.irc.on('data', data => {
            this.emit('ircdata', data);
            this.check(data);

            /** HeartBeat */
            if(data.includes ('PING :tmi.twitch.tv')) {
                this.irc.write('PONG :tmi.twitch.tv\r\n');
            }

            if(data.includes('PRIVMSG')) {
                const chatter = utils.formatPRIVMSG(data);  
                this.emit('message', chatter);
            }

            if(data.includes('CLEARCHAT')) {
                const event = utils.formatCLEARCHAT(data);
                if(event.type === 'timeout') this.emit('timeout', event);
                if(event.type === 'ban') this.emit('ban', event);
            }

            if(data.includes('USERNOTICE')) {
                const event = utils.formatUSERNOTICE(data);
                if(['sub', 'resub'].includes(event.msg_id)) {
                    this.emit('sub', event);
                }
            }

            if(data.includes(`@${this.username}.tmi.twitch.tv JOIN`)) {
                const channel = utils.formatJOIN(data);
                if(channel) {
                    if(!this.channels.includes(channel)) {
                        this.channels.push(channel);
                    }
                    this.emit('join', channel);
                }
            }

            if(data.includes(`@${this.username}.tmi.twitch.tv PART`)) {
                const channel = utils.formatPART(data);
                if(channel) {
                    if(this.channels.includes(channel)) {
                        this.channels.pop(channel);
                    }
                    this.emit('part', channel);
                }
            }
        });
    }

    async callback(callback, obj) {
        if(callback) {
            obj.ts = new Date();
            callback(obj);
        }
    }

    async say(message, channel, callback) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);
        if(message.length >= 500) {
            this.callback(callback, {
                sent: false,
                message: 'Message to long (>=500)'
            })
        } else {
            this.write('PRIVMSG '+channel+' :'+message);
        }
    }

    async timeout(username, channel, duration=600, reason='') {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/timeout ${username} ${duration} ${reason}`, channel);
    }

    async ban(username, channel, reason='') {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/ban ${username} ${reason}`, channel);
    }

    async emoteChat(state, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        if(state) this.say(`/emoteonly`, channel); else this.say(`/emoteonlyoff`, channel);
    }

    async followerChat(state, channel, duration=null) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        if(state) this.say(`/followers ${duration}`); else this.say(`/followersoff`, channel);
    }

    async subscriberChat(state, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        if(state) this.say(`/subscribers`); else this.say(`/subscribersoff`, channel);
    }

    async uniqueChat(state, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        if(state) this.say(`/uniquechat`, channel); else this.say(`/uniquechatoff`, channel);
    }

    async slowChat(state, channel, delay=10) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        if(state) this.say(`/slow ${delay}`, channel); else this.say(`/slowoff`, channel);
    }

    async clearChat(channel) {
        if(!channel) { 
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/clear`, channel);
    }

    async setMod(username, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/mod ${username}`, channel);
    }

    async removeMod(username, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/unmod ${username}`, channel);
    }

    async setVip(username, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/vip ${username}`, channel);
    }

    async removeVip(username, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/unvip ${username}`, channel);
    }

    async setColor(color) {
        channel = utils.formatCHANNEL(this.channels[0]);
        this.say(`/color ${color}`, channel);
    }

    async removeBan(username, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/unban ${username}`, channel);
    }

    async removeTimeout(username, channel) {
        if(!channel) {
            channel = this.channels[0];
        }
        channel = utils.formatCHANNEL(channel);

        this.say(`/untimeout ${username}`, channel);
    }

    async updateTitle(title, channel) {
        let id = await api.getUserByName(channel, this.oauth)['_id'];
        await api.updateTitle(id, title, this.oauth);
    }

    async updateGame(game, channel) {
        let id = await api.getUserByName(channel, this.oauth)['_id'];
        await api.updateGame(id, game, this.oauth);
    }

    async getChannel(channel) {
        let id = await api.getUserByName(channel)['_id'];
        return await api.getChannel(id, this.oauth);
    } 

    async close() {
        this.irc.destroy();
        this.emit('close');
    }

    async _nonce(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    async _listenPubSub(topics, channel) {
        channel = api.getUserByName(channel, this.oauth);
        let x = [];
        topics.forEach((topic) => {
            x.push(topic+"."+channel['_id']);
        })

        let message = {
            type: 'LISTEN',
            nonce: this._nonce(15),
            data: {
                topics: x,
                auth_token: this.oauth
            }
        };

        if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
    }

}


module.exports = TwitchBot;
