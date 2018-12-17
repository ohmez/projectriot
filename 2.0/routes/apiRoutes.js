var db = require("../models");
var keys = require("../keys");
var key = keys.riot.id;
var request = require("request");
module.exports = (app) => {
    app.post("/login/", (req,res) => {
        var name = req.body.summonerName;
        request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+name+'?api_key='+key, (err, response, body) =>{
            if(err) throw err;
            if(response.statusCode === 200) {
                console.log('this worked');
                var summoner = JSON.parse(body);
                console.log(summoner);
                db.Summoner.findAll({where: {accID: summoner.accountId}}).then((results) => {
                    if (results.length === 0) {
                        db.Summoner.create({
                            summName: summoner.name,
                            summID: summoner.id,
                            summIcon: summoner.profileIconId,
                            summLvl: summoner.summonerLevel,
                            accID: summoner.accountId,
                            revisDate: summoner.revisionDate
                        }).then((result) =>{
                            console.log(result);
                        });
                    } else {
                        res.send('<p> you already exist in our database<p>');
                    }
                });
            }
        });
    });
    
};