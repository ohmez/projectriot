var db = require("../models");

module.exports = (app) => {
    app.get("/", (req,res) => {
        res.render("home", {
            title: "My_Rito"
        });
    });
    
};