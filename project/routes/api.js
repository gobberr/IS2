var express = require('express');
var router = express.Router();
var Corso = require("../model/post");
var geolib = require("geolib");


router.get("/byCoordinates", function(req,res){

    res.contentType("application/json");
    
    
    
    var lat = "";
    var lng = "";
    var maxDistance = "";
    var subject = "";
    
    if(req.query.latitudine)
        lat = req.query.latitudine;
    if(req.query.longitudine)
        lng = req.query.longitudine;
    if(req.query.distance)
        maxDistance=req.query.distance;
    if(req.query.subject)
        subject = req.query.subject;
    Corso.findPosts(subject, function (error, post) {
        if (error || post.length===0) {
            //console.log("nessun risultato dalla query");
            var msg = {message: "Nessun Risultato dalla materia"};
            res.send(msg);
        } else {
            
            if((lat!=""&&(lng==""||maxDistance==""))||(lng!=""&&(lat==""||maxDistance==""))||(maxDistance!=""&&(lng==""||lat==""))){
                var msg = {error: "Campo latitudine, longitudine o distanza mancante"};
                res.send(msg);
            }
            else if((lat==""||lng==""||maxDistance=="")&&subject!=""){
                res.send(post);
            }
            else if((lat==""||lng==""||maxDistance=="")&&subject==""){
                var msg = {error: "Campo materia, latitudine, longitudine o distanza mancante"};
                res.send(msg);
            }
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
                if(a==0){
                    var msg = {message: "Nessun risultato dalle coordinate"};
                    res.send(msg);
                }
                else{
                    
                    res.send(post2);
                }
            }
        }
    });
});

router.get("/allPosts", function(req,res){
    res.contentType("application/json");
    Corso.find({},function(err,post){
        /*if(err){
            //console.log("Errore in /allPosts");
            var msg={message:"Errore nella query"}
            res.send(msg);
        }
            
        else*/
            res.send(post);
    })
});

module.exports = router;