var db = require("../models");
var keys = require("../keys");
var key = keys.riot.id;
var request = require("request");
var jsonfile = require("../public/champion.json");
var champions = JSON.parse(JSON.stringify(jsonfile.data));

module.exports = (app) => {
    app.get("/", (req,res) => {
        res.render("home", {
            title: "My_Rito"
        });
    });
    app.post("/profile", (req,res) => {
        var sum = req.body;
        res.render("profile", {
            name: sum.name,
            summonerLevel: sum.summonerLevel,
            profileIconId: sum.profileIconId,
            revisionDate: sum.revisionDate,
            id: sum.id,
            title: '' + sum.name + "'s rito"
        });
        res.location('/profile');
    });
    app.get("/stats/:sumname", (req,res) => {
        var sum = {};
        sum.name = req.params.sumname;
        request('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+sum.name+'?api_key='+key, (err, response, body) =>{
            if(err) throw err;
            if(response.statusCode === 200) {
                console.log('api summoner call worked');
                var summoner = JSON.parse(body);
                var utcSeconds = summoner.revisionDate;
                var d = new Date(0);
                var u = new Date();
                d.setUTCMilliseconds(utcSeconds);
                summoner.revisionDate = d;
                sum.revisionDate = summoner.revisionDate;
                sum.profileIconId = summoner.profileIconId;
                sum.puuid = summoner.puuid;
                sum.summonerLevel = summoner.summonerLevel;
                sum.revisionDate = summoner.revisionDate;
                sum.id = summoner.id;
                sum.accountId = summoner.accountId;
                sum.updated = u.toDateString();
                sum.name = summoner.name.trim();
                request('https://na1.api.riotgames.com/lol/league/v4/positions/by-summoner/'+sum.id+'?api_key='+key,(err,response,body) => {
                    if(err) throw err;
                    if(response.statusCode === 200) {
                        var a = JSON.parse(body);
                        sum.solo = a[1];
                        sum.solo.wr = (a[1].wins/a[1].losses).toFixed(2);
                        sum.flex = a[0];
                        sum.flex.wr = (a[0].wins/a[0].losses).toFixed(2);
                        console.log(sum);
                        request('https://na1.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key='+key, (err,response,body) => {
                            if(err) throw err;
                            if(response.statusCode === 200) { 
                                body = JSON.parse(body);
                                var masters = body.entries;
                                console.log(masters[0]);
                                var masterWr = [];
                                for (x=0; x<masters.length; x++ ) {
                                    //loop
                                    var out = (masters[x].wins/masters[x].losses).toFixed(2);
                                    masterWr.push(out);
                                }
                                var total = 0;
                                for (x=0; x<masterWr.length; x++) {
                                    total += parseInt(masterWr[x]);
                                }
                                var avg = total/masterWr.length;
                                console.log(total);
                                console.log('total above then average mster WR');
                                console.log(avg);
                                var soloFr = Math.ceil((1-((avg-sum.solo.wr)*5).toFixed(2))*5);
                                var flexFr = Math.ceil((1-((avg-sum.flex.wr)*5).toFixed(2))*5);
                                sum.solo.fr = soloFr;
                                sum.flex.fr = flexFr;
                                res.render("qwikstats", sum);
                            }
                        }) // end masters stats api call
                    }
                }) // end ranked league api call
            }
        }) // end summoner api call
    });
};