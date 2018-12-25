var db = require("../models");

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
    app.get("/profile", (req,res) => {
        res.render("profile", {errMsg: 'please select summoner first'})
    });
};