require("dotenv").config();
var keys = require("./keys");
var request = require('request');
var fs = require('fs');
var key = keys.riot.id;
var format = 'utf8';
var file = 'yourSumm.txt';
var yourSummoner = {};
var yourMasteries = {};
var config = {
    apiKey: keys.riot.id,
    authDomain: "projectriot-50a62.firebaseapp.com",
    databaseURL: "https://projectriot-50a62.firebaseio.com",
    projectId: "projectriot-50a62",
    storageBucket: "projectriot-50a62.appspot.com",
    messaginSenderId: "1028060856912"
};
function log(content) {
    fs.appendFile(file,content, format, (err) => {
    if(err) throw err;
  })  
}; 
function getSumm(name) {
request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+name+'?api_key='+key,(err, response, body) => {
    if (err) throw err;
    // console.log(response);
    var results = JSON.parse(body);
    // console.log(results);
    // yourSummoner.id = results.id;
    // yourSummoner.accountId = results.accountId;
    // yourSummoner.name = results.name;
    // yourSummoner.icon = results.profileIconId;
    // yourSummoner.revision = results.revisionDate;
    // yourSummoner.level = results.summonerLevel;
    yourSummoner = results;
    log(JSON.stringify(results,null,2));
    // console.log(yourSummoner);
    getMastery(yourSummoner.id);
})
};
// var riot = new Riot(keys.riot);
// console.log(yourSummoner);

// {
//     "playerId": 29394585,
//     "championId": 76,
//     "championLevel": 6,
//     "championPoints": 187476,
//     "lastPlayTime": 1532064343000,
//     "championPointsSinceLastLevel": 165876,
//     "championPointsUntilNextLevel": 0,
//     "chestGranted": true,
//     "tokensEarned": 2
//   }
function getMastery(id) { 
    request('https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/'+id+'?api_key='+key,(err,response,body) => {
        if(err) throw err;
        yourSummoner.masteries = [];
        var mastery = yourSummoner.masteries;
        var results = JSON.parse(body);
        for(x=0; x<results.length; x++) {
            mastery[x] = {
                championId: results[x].championId,
                championLevel: results[x].championLevel,
                championPoints: results[x].championPoints,
                lastPlayTime: results[x].lastPlayTime,
                championPointsSinceLastLevel: results[x].championPointsSinceLastLevel,
                championPointsUntillNextLevel: results[x].championPointsUntillNextLevel,
                chestGranted: results[x].chestGranted,
                tokensEarned: results[x].tokensEarned
            }

        }
        // console.log(results);
        log(JSON.stringify(results[0],null,2));
        yourMasteries = results;
        console.log(yourSummoner);
        // console.log(yourMasteries);
        // read();
    })
};

//  getMastery(parseFloat(yourSummoner.id));

console.log('end of initial load');
getSumm('ohme');
function read() {
fs.readFile('yourSumm.txt', format,(err,data) => {
    if(err) throw err;
    // data = data.slice(1);
    // data = data.split("*").join(",");

    // data = JSON.parse(data,null,2);
   
    // var results = JSON.parse(data);

    // var results = JSON.stringify(data);
    // var test = JSON.parse(results);
    console.log(data);
})
};