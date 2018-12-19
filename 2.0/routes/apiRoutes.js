var db = require("../models");
var keys = require("../keys");
var key = keys.riot.id;
var request = require("request");
module.exports = (app) => {
    app.post("/findsumm", (req,res) => {
        var name = req.body.summonerName;
        request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+name+'?api_key='+key, (err, response, body) =>{
            if(err) throw err;
            if(response.statusCode === 200) {
                console.log('api summoner call worked');
                var summoner = JSON.parse(body);
                console.log(summoner);
                db.Summoner.findAll({where: {accID: summoner.accountId}}).then((summoners) => {
                    if (summoners.length === 0) {
                        db.Summoner.create({
                            summName: summoner.name,
                            summID: summoner.id,
                            summIcon: summoner.profileIconId,
                            summLvl: summoner.summonerLevel,
                            accID: summoner.accountId,
                            revisDate: summoner.revisionDate
                        }).then((result) =>{
                            var summonerInfo = result;
                            res.render('profile',summonerInfo);
                        });
                    } else {
                        db.Summoner.update({
                            summName: summoner.name,
                            summID: summoner.id,
                            summIcon: summoner.profileIconId,
                            summLvl: summoner.summonerLevel,
                            accID: summoner.accountId,
                            revisDate: summoner.revisionDate
                        },{where: {accID: summoner.accountId}}).then((upsums) => {
                            console.log(upsums);
                            if(upsums[0] === 1) {
                                return db.Summoner.findAll({where: {accID: summoner.accountId}}).then((upsum) => {
                                    var updatedSummoner = upsum[0].dataValues;
                                    res.render('profile',updatedSummoner);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    app.post("/masteries", (req,res) => {
        var sumid = req.body.id;
        request('https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/'+sumid+'?api_key='+key,(err,response, body) => {
            if(err) throw err;
            if(response.statusCode == 200) {
                console.log('api masteries worked');
                console.log(body);
                res.json(body);
            }
        });
    })
    
};