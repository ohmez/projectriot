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
                        console.log(a);
                        if(a.length > 1) {
                            if(a[0].queueType === 'RANKED_FLEX_SR'){
                                sum.solo = a[1];
                                sum.solo.wr = (a[1].wins/a[1].losses).toFixed(2);
                                sum.solo.games = (a[1].wins + a[1].losses);
                                sum.flex = a[0];
                                sum.flex.wr = (a[0].wins/a[0].losses).toFixed(2);
                                sum.flex.games = (a[0].wins + a[0].losses);
                            } else {
                                sum.flex = a[1];
                                sum.flex.wr = (a[1].wins/a[1].losses).toFixed(2);
                                sum.flex.games = (a[1].wins + a[1].losses);
                                sum.solo = a[0];
                                sum.solo.wr = (a[0].wins/a[0].losses).toFixed(2);
                                sum.solo.games = (a[0].wins + a[0].losses);
                            }
                        } else {
                            if(a[0].queueType ==='RANKED_FLEX_SR' ) {
                                sum.flex = a[0];
                                sum.flex.wr = (a[0].wins/a[0].losses).toFixed(2);
                                sum.flex.games = (a[0].wins + a[0].losses);
                            } else {
                                sum.solo = a[0];
                                sum.solo.wr = (a[0].wins/a[0].losses).toFixed(2);
                                sum.solo.games = (a[0].wins + a[0].losses);
                            }
                        }
                        
                        console.log(sum);
                        request('https://na1.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5?api_key='+key, (err,response,body) => {
                            if(err) throw err;
                            if(response.statusCode === 200) { 
                                body = JSON.parse(body);
                                var masters = body.entries;
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
                                sum.masters = {avg:avg};
                                var flexFr; 
                                var soloFr;
                                if(sum.solo) {
                                    if (sum.solo.wr < 1) {
                                        soloFr = ((avg - sum.solo.wr) * 100).toFixed(1);
                                        soloFr += '% Short of a Positive Win Rate'
                                    }
                                    else {
                                        soloFr = (((avg - sum.solo.wr) + 0.50) * 100).toFixed(1);
                                        soloFr += '% Win rate is a climbing win rate'
                                    }
                                    sum.solo.fr = soloFr;
                                }
                                if(sum.flex) {
                                    if (sum.flex.wr < 1) {
                                        flexFr = ((avg - sum.flex.wr) * 100).toFixed(1);
                                        flexFr += '% Short of a climbing win rate'
                                    }
                                    else {
                                        flexFr = (((avg - sum.flex.wr) + 0.50) * 100).toFixed(1);
                                        flexFr += '% Win rate is a climbing win rate'
                                    }
                                    sum.flex.fr = flexFr;
                                }
                                request('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+sum.accountId+'?api_key='+key, (err,response,body) => {
                                    if(err) throw err;
                                    if(response.statusCode === 200) {
                                        body = JSON.parse(body);
                                        console.log(JSON.stringify(body));
                                        sum.new = JSON.stringify(body);
                                        res.render("qwikstats", sum);
                                    } else {
                                        res.render('home', {errMsg:'something went wrong with fetching matchlist' + response.statusCode});
                                    }
                                });
                            } else {
                                res.render('home',{errMsg:'something went wrong with fetching Masters Stats:' + response.statusCode});
                            }
                        }); // end masters stats api call
                    } else {
                        res.render('home', {errMsg:'something went wrong with fetching ranked stats:' + response.statusCode});
                    }
                }); // end ranked league api call
            } else {
                res.render('home', {errMsg:'something went wrong fetching that summoner name, check spelling and try again' + response.statusCode});
            }
        }); // end summoner api call
    });
}; // end app exports routing. 