var db = require("../models");

module.exports = (app) => {
    app.post("/login/", (req,res) => {

       console.log(req);
       console.log(res);
    });
    
};