var db = require("../models");
var keys = require("../keys");
var key = keys.riot.id;
var request = require("request");
var jsonfile = require("../public/champion.json");
var champions = JSON.parse(JSON.stringify(jsonfile.data));
module.exports = (app) => {
    app.post("/findsumm", (req,res) => {
        var name = req.body.summonerName;
        request('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+name+'?api_key='+key, (err, response, body) =>{
            if(err) throw err;
            if(response.statusCode === 200) {
                console.log('api summoner call worked');
                var summoner = JSON.parse(body);
                var utcSeconds = summoner.revisionDate;
                var d = new Date(0);
                d.setUTCMilliseconds(utcSeconds);
                summoner.revisionDate = d;
                console.log(summoner);
                db.Summoner.findAll({where: {id: summoner.id}}).then((summoners) => {
                    if (summoners.length === 0) {
                        db.Summoner.create({
                            profileIconId: summoner.profileIconId,
                            name: summoner.name,
                            puuid: summoner.puuid,
                            summonerLevel: summoner.summonerLevel,
                            revisionDate: summoner.revisionDate,
                            id: summoner.id,
                            accountId: summoner.accountId
                        }).then((result) =>{
                            var summonerInfo = result.dataValues;
                            res.render('profile',summonerInfo);
                        });
                    } else {
                        db.Summoner.update({
                            profileIconId: summoner.profileIconId,
                            name: summoner.name,
                            puuid: summoner.puuid,
                            summonerLevel: summoner.summonerLevel,
                            revisionDate: summoner.revisionDate,
                            id: summoner.id,
                            accountId: summoner.accountId
                        },{where: {id: summoner.id}}).then((upsums) => {
                            console.log(upsums);
                            if(upsums[0] === 1) {
                                db.Summoner.findAll({where: {id: summoner.id}}).then((upsum) => {
                                    var updatedSummoner = upsum[0].dataValues;
                                    res.render('profile',updatedSummoner);
                                });
                            }
                        });
                    }
                });
            } if (response.statusCode === 404) {
                res.render('home',{errMsg: 'Please provide valid summoner name'});
            }
        });
    });
    app.post("/masteries", (req,res) => {
        var sumid = req.body.id;
        request('https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'+sumid+'?api_key='+key,(err,response, body) => {
            if(err) throw err;
            if(response.statusCode == 200) {
                console.log('api masteries worked');
                var masteries = JSON.parse(body);
                var edited = [];
                for(x=0; x<masteries.length; x++) {
                    var utcSeconds = masteries[x].lastPlayTime;
                    var d = new Date(0);
                    d.setUTCMilliseconds(utcSeconds);
                    masteries[x].lastPlayTime = d; 
                    for(var prop in champions) {
                        if(Number(champions[prop].key) === masteries[x].championId) {
                            masteries[x].championName = champions[prop].name;
                        }
                    }
                    edited.push(masteries[x]);
                }
                db.Mastery.bulkCreate(edited)
                .then(()=> {
                    return db.Mastery.findAll().then(results => res.json(results));
                })
                .catch((err) => {
                    console.log(err,request.body);
                })
            } else {
                console.log(response);
            }
        });
    })
    
};