const http = require('https');

module.exports = {
    async getUserByName(username, auth) {
        if(!username || !auth) return;
        const init = {
            host: 'api.twitch.tv',
            path: '/v5/users?login='+username,
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Authorization': auth
            }
        };
        const callback = async function(response) {
            let result = Buffer.alloc(0);
            response.on('data', function(chunk) {
                result = Buffer.concat([result, chunk]);
            });
            
            response.on('end', async function() {
                result = JSON.parse(result.toString());
                if(result['users']) {
                    return await result['users'][0];
                }
            });
        };

        const req = http.request(init, callback);
        req.end();
    },
    async getChannel(id, auth) {
        if(!id || !auth) return;
        const init = {
            host: 'api.twitch.tv',
            path: '/v5/channels/'+id,
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Authorization': auth
            }
        };
        const callback = async function(response) {
            let result = Buffer.alloc(0);
            response.on('data', function(chunk) {
                result = Buffer.concat([result, chunk]);
            });
            
            response.on('end', async function() {
                return await JSON.parse(result.toString())['users'][0];
            });
        };

        const req = http.request(init, callback);
        req.end();
    },
    async updateTitle(id, title, auth) {
        if(!id || !auth || !title) return;

        const init = {
            host: 'api.twitch.tv',
            path: '/v5/channels/'+id+'/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        };
        const callback = async function(response) {
            let result = Buffer.alloc(0);
            response.on('data', function(chunk) {
                result = Buffer.concat([result, chunk]);
            });
            
            response.on('end', async function() {
                return await JSON.parse(result.toString());
            });
        };

        const req = http.request(init, callback);
        const body = `{"channel":{"status":"${title}"}}`;
        req.write(body);
        req.end();
    },
    async updateGame(id, game, auth) {
        if(!id || !auth || !title) return;

        const init = {
            host: 'api.twitch.tv',
            path: '/v5/channels/'+id+'/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        };
        const callback = async function(response) {
            let result = Buffer.alloc(0);
            response.on('data', function(chunk) {
                result = Buffer.concat([result, chunk]);
            });
            
            response.on('end', async function() {
                return await JSON.parse(result.toString());
            });
        };

        const req = http.request(init, callback);
        const body = `{"channel":{"game":"${game}"}}`;
        req.write(body);
        req.end();
    }
};