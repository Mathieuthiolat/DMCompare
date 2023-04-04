const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const { JsonRpc } = require('eosjs');
const https = require('https');
const fetch = require('node-fetch');

//const resultRace = require('./result/selection_result.json')
require('./routes')(app,path);
app.use(express.static(__dirname + '/front-end'));
var waxRpc = "https://atomic.wax.eosrio.io/atomicassets/v1/";
const rpcList = ["https://api.waxsweden.org","https://wax.eu.eosamsterdam.net"];

app.get('/getDMAssets/:user_name',function(req,res){
    var user = req.params.user_name

    getDMStakedAssets(user).then((assets) => {
        res.send(assets);
    })
});


app.get('/getAssetsDetail/:assets',function(req,res){
    var assets = req.params.assets
    getAssetInfo(assets).then((details) => {
        res.send(details);
    })
});

async function getDMStakedAssets(user){
    return new Promise((resolve) => {
        var rpc = new JsonRpc(rpcList[0], { fetch });
        const json = rpc.get_table_rows({
            json: true,               // Get the response as json
            code: 'wombatmaster',      // Contract that we target
            scope: user,         // Account that owns the data
            table: 'staked',        // Table name
            limit: 200
        });
        resolve(json)
    })
}

/* swager : https://test.wax.api.atomicassets.io/docs/ */
async function getAssetInfo(asset_id) {
    return new Promise((resolve) => {

        https.get('https://wax.api.atomicassets.io/atomicassets/v1/assets/'+asset_id, resp => {
            let data = '';
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data))
            });

        }).on("error", (err) => {
            console.log(new Date().toLocaleTimeString("fr-FR")+" SERVER SIDE : "+err.message,"./logs/error.log")
        });
    })
}



//add the router
app.use('/', router);
//app.listen(process.env.port || 8080);
const PORT = 8081;
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))