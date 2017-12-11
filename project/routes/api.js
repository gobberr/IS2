var express = require('express');
var router = express.Router();
var Corso = require("../model/post");
var geolib = require("geolib");


router.get("/byCoordinates", function(req,res){

    res.contentType("application/json");
    
    var lat = req.query.latitudine;
    var lng = req.query.longitudine;
    
    var subject = req.query.subject;
    var maxDistance=req.query.distance;
    
    Corso.findPosts(subject, function (error, post) {
        if (error || post.length===0) {
            console.log("nessun risultato dalla query");
            var msg = {message: "Nessun Risultato"};
            res.send(msg);
        } else {
            //console.log("query success: subject=" + subject + ", post=" + post);
            if(lat==null||maxDistance=="unl")
                res.send(post);
            else {
                var post2= [];
                var a=0;
                
                for (var i = 0, len = post.length; i < len; i++) {
                    var distance = geolib.getDistance(
                        {latitude: lat, longitude: lng},
                        {latitude: post[i].location.latitude, longitude: post[i].location.longitude}
                    );
                    if(distance<=maxDistance){
                        post2[a]=post[i];
                        a++;
                    }
                }
                res.send(post2);
            }
        }
    });
});

router.get("/allPosts", function(req,res){
    res.contentType("application/json");
    Corso.find({},function(err,post){
        if(err){
            console.log("Errore in /allPosts");
            var msg={message:"Errore nella query"}
            res.send(msg);
        }
            
        else
            res.send(post);
    })
});

module.exports = router;