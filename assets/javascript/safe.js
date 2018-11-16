var config = {
    apiKey: "",
    authDomain: "projectriot-50a62.firebaseapp.com",
    databaseURL: "https://projectriot-50a62.firebaseio.com",
    projectId: "projectriot-50a62",
    storageBucket: "projectriot-50a62.appspot.com",
    messaginSenderId: "1028060856912"
};

var summonerInfo;
function getSumm() {
    var aKey = "";
    var url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name';
    $.ajax({
        url: url + '/ohme' + aKey,
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
    }).then(function(summoner) {
        console.log(summoner);
        summonerInfo = summoner;
    })
};
module.exports = summonerInfo;