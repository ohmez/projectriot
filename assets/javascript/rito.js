var config = {
    apiKey: "",
    authDomain: "projectriot-50a62.firebaseapp.com",
    databaseURL: "https://projectriot-50a62.firebaseio.com",
    projectId: "projectriot-50a62",
    storageBucket: "projectriot-50a62.appspot.com",
    messaginSenderId: "1028060856912"
};
firebase.initializeApp(config);
var db = firebase.database();
var sumName = '';

db.ref().on("value", function(snap) {
    console.log(snap.val());

});

$(document).ready(function() {
    var newS = $("<div>").attr(
    {style: "margin:auto;position:relative;margin-left:45%;margin-top: 40%;"});
    newS.append(
        $("<h3/>").text("Enter Summoner Name"), 
        $("<form/>", {
            action: '#',
            method: '#'
        }).append( $("<input/>", {
            type: "text",
            id: 'sname',
            name: 'sumName',
            placeholder: 'SomeSummonerName'}), 
            $("<br>"),
            $("<input/>", {
                type: "submit",
                id: 'submit',
                value: 'submit',
                style: "margin:auto; margin-left: 10%;"
            })
    ));
    $("body").append(newS);
});
function getSumm() {
    var aKey = "?api_key=RGAPI-d84f5dd1-ee49-42ce-8ed1-b14f94efd588";
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
    })
};
$(document).on("click", "#submit", function() {
    console.log($("input#sname").val());
    sumName = "/"+ $("input#sname").val().trim();
    console.log(sumName.length);
    console.log(sumName);
    // setTimeout(getSumm(),200);
});