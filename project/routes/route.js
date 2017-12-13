var express = require('express');
var router = express.Router();
const pug = require('pug');
var User = require("../model/user");
var Corso = require("../model/post");
var Review = require("../model/review");
var Message = require("../model/message");
var path = require('path'); 
var fs = require('fs');
var formidable = require('formidable');
var geolib = require('geolib');
var api = require("./api");

//var bodyparser = require('body-parser');

router.get("/", function(req,res,next){
    isLoggedIn(req,res, function(logged) {
        //console.log("logged"+logged);
        res.status(200).send(pug.renderFile("views/index.pug", {logged: logged}));
    });
});




//quando carica la prima volta la pagina di ricerca, non ci sono parametri e non visualizza annunci
router.get("/cerco", function(req,res){
    isLoggedIn(req,res, function(logged) {       
        var subject = "";
        Corso.findPosts(subject, function (error, post) {
            if (error || post.length===0) {
                //console.log("nessun risultato dalla query");
                res.send(pug.renderFile("views/cerco.pug", {values: [], logged: logged}));
            } else {
                res.send(pug.renderFile("views/cerco.pug", {values: post, logged: logged}));
            }
            res.end();
        });
    });
});

//quando riceve una richiesta e ricarica la pagina con i risultati
//ricerca un annuncio per materia e zona (con filtro distanza)
//SE non viene specificata la materia, visualizza tutti gli annunci nella zona selezionata (tenendo conto del filtro distanza)
//SE non viene specificata la zona, visualizza tutti gli annunci con la materia specificata
router.post("/cerco", function(req,res){
    isLoggedIn(req,res, function(logged) {  
        
        var lat = req.body.latitudine;
        var lng = req.body.longitudine;
        
        var subject = req.body.subject;
        if (subject=="Tutte") subject="";
        var maxDistance=req.body.distance;
        
        Corso.findPosts(subject, function (error, post) {
            if (error || post.length===0) {
                console.log("nessun risultato dalla query");
                res.send(pug.renderFile("views/cerco.pug", {values: [], logged: logged}));
            } else {
                //console.log("query success: subject=" + subject + ", post=" + post);
                if(lat==""||maxDistance=="unl")
                    res.send(pug.renderFile("views/cerco.pug", {values: post, logged: logged}));
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
                    res.send(pug.renderFile("views/cerco.pug", {values: post2, logged: logged}));
                }
            }
        });
    });
});

router.get("/login", function(req,res) {
    isLoggedIn(req,res, function(logged) {        
        res.send(pug.renderFile("views/login.pug", {error: req.query.error, logged: logged}));
        res.end();
    });
});

router.post("/login", function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;    
    // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    User.authenticate(email, password, function (error, user) {
        if (error || !user) {
            res.redirect('/login?error=true');
        } 
        else {
            req.session.userId = user._id;
			req.session.emailUser = user.email;
            return res.redirect('/');
        }
    });
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } 
            else 
            {
                return res.redirect('/');
            }
        });
    }
});

router.post("/sendRequest", function(req,res){
    isLoggedIn(req,res, function(logged) {        
        if(!logged) return res.redirect("/login");
        User.findById(req.session.userId).exec(function(error,user){
            if(error)
                console.log(error);
            else{
                var messageData = {
                    contact: user.email,
                    sender: user._id,
                    reciver: req.body.reciverId,
                    post: req.body.postId,
                    recived: false
                }
                Message.create(messageData, function (error, message) {
                    if (error) {
                        return console.log(error);
                    }
                    else {
                        console.log("Richiesta inviata");
                        return res.redirect('/successfullyRequest');
                    }
                });
            }
        });
    });
});

router.get("/registrati", function(req,res){
    isLoggedIn(req,res, function(logged) {
        console.log(pug.renderFile("views/registration.pug", {logged: logged}));       
        res.send(pug.renderFile("views/registration.pug", {logged: logged}));
    });
});

router.post("/registrazione", function(req,res,next){
    if (req.body.password !== req.body.confpassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    
    if (req.body.email && req.body.nome && req.body.cognome && req.body.password && req.body.confpassword) {
        var domain;
        var userData = {
            email: req.body.email,
            name: req.body.nome,
            surname: req.body.cognome,            
            password: req.body.password,
            passwordConf: req.body.confpassword,
        }
        domain = userData.email.split("@");
        if(domain[1]==="unitn.it"|| domain[1]==="studenti.unitn.it"||domain[1]==="alumni.unitn.it")
        {
            User.create(userData, function (error, user) {
                if (error) {
                    return next(error);
                }
                else {
                    req.session.userId = user._id;
                    console.log("utente creato e sessione avviata");
                    return res.redirect('/successfullyRegistered');
                }
            });
        }
        else
            res.send("Email non valida");
    }

});


router.get("/pubblico", function(req,res) {
    isLoggedIn(req,res, function(logged) {
        res.send(pug.renderFile("views/pubblico.pug", {utente : new User, recensioni : [], posts : [], logged: logged}));
    });
});

router.post("/pubblico", function(req,res) {
    isLoggedIn(req,res, function(logged) {
        var userpublic = req.body.userpublic;
        
        User.findById(userpublic, function(error, user) {
            if(error || !user) {
                //console.log(error);
                res.send(pug.renderFile("views/pubblico.pug", {utente : new User, imageDir: "", recensioni : "", posts : [], media : 0, numero : 0, logged: logged}));
            } else {
                var imageDir="default.png";
                if (fs.existsSync(__dirname + '/../public/upload/' + user._id + ".jpeg")) {
                    imageDir=user._id+".jpeg";
                }
                Review.findReviewOf(userpublic, function(error, rs) {
                    
					if (error || rs.length===0) {
						Corso.findUserPosts(user._id, function(error, post){
                            if (error || !post) {
                                //console.log(error);
                                res.send(pug.renderFile("views/pubblico.pug", {utente : user, imageDir: imageDir, recensioni : "", posts : [], media : 0, numero : 0, logged: logged}));
                            } else {
                                //console.log(post);
                                res.send(pug.renderFile("views/pubblico.pug", {utente : user, imageDir: imageDir, recensioni : "", posts : post, media : 0, numero : 0, logged: logged}));
                                //res.end();
                            }
                            
                        });
					} else {
                        Review.avg(user._id, function(error, media) {
							if (error) {
                                console.log(error);
                                Corso.findUserPosts(user._id, function(error, post){
                                    if (error || !post) {
                                        //console.log(error);
                                        res.send(pug.renderFile("views/pubblico.pug", {utente : user, imageDir: imageDir, recensioni : rs, posts : [], media : 0, numero : 0, logged: logged}));
                                    } else {
                                        //console.log(post);
                                        res.send(pug.renderFile("views/pubblico.pug", {utente : user, imageDir: imageDir, recensioni : rs, posts : post, media : 0, numero : 0, logged: logged}));
                                    }
                                });
                            } 
                            else {
								var sum = 0;
								var count = media.length;
								for(var i=0; i<media.length; i++) {
									sum += media[i].vote;
                                }
                                Corso.findUserPosts(user._id, function(error, post){
                                    if (error || !post) {
                                        //console.log(error);
                                        res.send(pug.renderFile("views/pubblico.pug", {utente : user, imageDir: imageDir, recensioni : rs, posts : [], media : Math.round((sum/count) * 100) / 100, numero : media.length, logged: logged}));
                                    } else {
                                        //console.log(post);
                                        res.send(pug.renderFile("views/pubblico.pug", {utente : user, imageDir: imageDir, recensioni : rs, posts : post, media : Math.round((sum/count) * 100) / 100, numero : media.length, logged: logged}));
                                    }
                                });
							}
						});
                        
                    }
                });
            }
        });
    });
});

router.get("/account", function(req,res,next){
    isLoggedIn(req,res, function(logged) {
        if(!logged) return res.redirect("/login");
        Message.findMessages(req.session.userId, function (error, messages) {
            if (error) {
                console.log(error);
            } else {
                var nNotifications=0;
                for(var x=0; x<messages.length;x++){
                    if (!messages[x].recived)
                        nNotifications++;
                }
                User.findById(req.session.userId)
                .exec(function (error, user) {
                    if (error) {
                        return next(error);
                    } 
                    else {
                        if (user === null) {
                            return next(error);
                        } 
                        else {
                            var imageDir="default.png";
                            if (fs.existsSync(__dirname + '/../public/upload/' + user._id + ".jpeg")) {
                                imageDir=user._id+".jpeg";
                            }
                            res.send(pug.renderFile("views/account.pug", {numero_telefono: user.telephone, email: user.email, skills: user.skills, imageDir: imageDir, descrizione: user.description, pippo:req.query.error_size, pluto:req.query.error_ext, nNotifications: nNotifications, logged: logged}));
                        }
                    }
                });
            }
        });
    });
});

router.post("/account", function(req,res){
    isLoggedIn(req,res, function(logged) {
        if(!logged) return res.redirect("/login");
        Message.findMessages(req.session.userId, function (error, messages) {
            if (error) {
                console.log(error);
            } else {
                var nNotifications=0;
                for(var x=0; x<messages.length;x++){
                    if (!messages[x].recived)
                        nNotifications++;
                }
                var form = req.body.formid;
                if(form=="form-1")
                {
                    //var tel = req.body.telephone;
                    
                User.findByIdAndUpdate(req.session.userId, {telephone: req.body.new_telephone}).exec();
                }
                else if(form=="form-2")
                User.findByIdAndUpdate(req.session.userId, {email: req.body.email}).exec();
                
                else if(form=="form-3")
                {
                
                        User.findById(req.session.userId).exec(function(error,user){
                            if(error)
                                console.log(error);
                            else{
                                bcrypt.compare(req.body.old_password, user.password, function(err,response){
                                    if(response==true)
                                        if(req.body.new_password1==req.body.new_password2){
                                            user.password=req.body.new_password1;
                                            user.save();
                                        }

                                });
                            }
                        });
                    
                
                }
                else if(form=="form-4")
                User.findByIdAndUpdate(req.session.userId, {description: req.body.descrizione}).exec();
                
                
                else if(form=="form-5")
                User.findByIdAndUpdate(req.session.userId, {$push: {skills: req.body.competenza}}).exec();
                
                else if(form=="form-6")
                User.findByIdAndUpdate(req.session.userId, {$pull: {skills: req.body.delskill}}).exec();
                
                User.findById(req.session.userId)
                .exec(function (error, user) {
                    if (error) {
                    // return next(error);
                    } 
                    else {
                        if (user === null) {
                            //return next(error);
                        } 
                        else {
                            var imageDir="default.png";
                            if (fs.existsSync(__dirname + '/../public/upload/' + user._id + ".jpeg")) {
                                imageDir=user._id+".jpeg";
                            }
                            res.send(pug.renderFile("views/account.pug", {numero_telefono: user.telephone, email: user.email, imageDir: imageDir, skills: user.skills, descrizione: user.description, nNotifications: nNotifications, logged: logged}));
                        }
                    }
                });
            }
        }); 
    });   
});

router.get("/chiSiamo", function(req,res) {
    isLoggedIn(req,res, function(logged) {
        res.send(pug.renderFile("views/chiSiamo.pug", {logged: logged}));
        res.end();
    });
});

router.get("/offro", function(req,res){
    isLoggedIn(req,res, function(logged) {
        if(!logged) return res.redirect("/login");        
        res.send(pug.renderFile("views/offro.pug", {logged: logged}));
    });
});

router.post("/offro", function(req,res){
    isLoggedIn(req,res, function(logged) {
        User.findById(req.session.userId)
        .exec(function (error, user) {
            if(!logged) return res.redirect("/login");
            var postData = {
                userId: user._id,
                userName: user.name+" "+user.surname,
                subject: req.body.subject,
                text: req.body.text,
                location: {latitude: req.body.latitudine, longitude: req.body.longitudine},
                deleted: false    
            }
            Corso.create(postData, function (error, user) {
                if (error) {
                    return console.log(error);
                }
                else {
                    console.log("post creato!");
                    return res.redirect('/successfullyCreatedPost');
                }
            });   
            //res.send(pug.renderFile("views/offro.pug"));
        });
    });
});

router.post("/ritorna", function(req,res){
	var subject = req.body.subject;
	
	Corso.findPosts(subject, function (error, post) {
        if (error || post.length===0) {
			res.send(pug.renderFile("views/cerco.pug", {values: []}));
        } else {
			res.send(pug.renderFile("views/cerco.pug", {values: post}));
        }
    });
});

router.get("/annuncio", function(req,res){
    isLoggedIn(req,res, function(logged) {        
        res.send(pug.renderFile("views/annuncio.pug", {logged: logged}));
    });
});

router.post("/annuncio", function(req,res){
      isLoggedIn(req,res,function(logged){
		  var user = req.body.utente;
          var anntxt = req.body.anntxt;
          var postId = req.body.postId;
          var ritorna = req.body.ritorna;
          var latitude = req.body.latitude;
          var longitude = req.body.longitude;
		  var recensioni = [];
		  
		  
		  User.findById(user, function(error, em) {
		  	if (error || !em) {
				console.log("\nnessun risultato dalla query utenti");
				res.send(pug.renderFile("views/annuncio.pug", {recensioni : recensioni, imageDir: "", utente : new User, anntxt : anntxt, postId: postId, ritorna : ritorna, media : 0, numero : 0, latitude: latitude, longitude: longitude, logged : logged}));
		  	} else {
                var imageDir="default.png";
                if (fs.existsSync(__dirname + '/../public/upload/' + em._id + ".jpeg")) {
                    imageDir=em._id+".jpeg";
                }
				Review.findReviewOf(user, function(error, rs) {
					if (error || rs.length===0) {
						console.log("\nnessun risultato dalla query recensioni");
						res.send(pug.renderFile("views/annuncio.pug", {recensioni : recensioni, imageDir: imageDir, utente : em, anntxt : anntxt, postId: postId, ritorna : ritorna, media : 0, numero : 0, latitude: latitude, longitude: longitude, logged:logged}));
                    } else {
						Review.avg(user, function(error, media) {
							if (error) {
								console.log(error);
								res.send(pug.renderFile("views/annuncio.pug", {recensioni : rs, imageDir: imageDir, utente : em, anntxt : anntxt, postId: postId, ritorna : ritorna, media : 0, numero : 0, latitude: latitude, longitude: longitude, logged:logged}));
							} else {
								var sum = 0;
								var count = media.length;
								for(var i=0; i<media.length; i++) {
									sum += media[i].vote;
								}
								res.send(pug.renderFile("views/annuncio.pug", {recensioni : rs, imageDir: imageDir, utente : em, anntxt : anntxt, postId: postId, ritorna : ritorna, media : Math.round((sum/count) * 100) / 100, numero : media.length, latitude: latitude, longitude: longitude, logged:logged}));
							}
						});
                    }
				});
			}
		  });
	});
});

router.post("/recensione", function(req,res){
    isLoggedIn(req,res,function(logged){
        if(!logged) return res.redirect("/login");
        var user=JSON.parse(req.body.utente);
        User.findById(req.session.userId, function(error, em) {
            var reviewData = {
                reviewer: req.session.userId,
                revised: user._id,
                userName: em.name+" "+em.surname,
                vote: req.body.r,
                text: req.body.text         
            }
            Review.create(reviewData, function (error, user) {
                if (error) {
                    return console.log(error);
                } else {
                    console.log("recensione creata!");
                    res.redirect("/cerco");
                }
            });
        });
    });
});

router.post("/addreview", function(req,res){
    isLoggedIn(req,res,function(logged){
        if(!logged) return res.redirect("/login");    
        var utente = req.body.utente;
        
        res.send(pug.renderFile("views/add_recensione.pug", {utente: utente, logged: logged}));
    });
});

router.post('/upload', function (req, res) {
    
        var form = new formidable.IncomingForm();    
        var b=false;
        var user_id = req.session.userId;
        //console.log("user id: " + user_id);
        var fileType;
	    form.on('file', function (name, file) {
	    	fileType = file.type.split('/').pop();
	    	//console.log(fileType);
		});

        var MAX_UPLOAD_SIZE = 5242880; // max dim 5 mb 
        form.on('progress', function(bytesReceived, bytesExpected) {
            if(!b){
            if (bytesReceived > MAX_UPLOAD_SIZE) {
                console.log('File troppo grande, massimo 5 MB');  
                res.redirect("/account?error_size=true");
                b=true;
                //maxDimension = true;
                //res.send(pug.renderFile("views/account.pug", {maxDimension : maxDimension}));
            }}
        });
        if(!b){
            form.parse(req, function (err, fields, files) 
            {
                var extension = path.extname(files.file_upload.name);
                console.log("trying to upload file with extension: " + extension);
                if((extension == ".jpg") || (extension == ".jpeg")){
                    var oldpath = files.file_upload.path;
                    var newpath = __dirname + '/../public/upload/' + user_id + "." + fileType;
                    console.log("upload succesful!");
                    fs.rename(oldpath, newpath, function (err) 
                    {
                        if (err) throw err;
                        //succesful = true;                
                        //res.send(pug.renderFile("views/account.pug", {succesful : succesful}));
                        res.redirect("/account");                        
                    });
            }
            else{
                console.log("upload NOT succesful because of file extension not allowed!");
                //res.send(pug.renderFile("views/account.pug", {extension : extension}));
                res.redirect("/account?error_ext=true");                
            }
        }); 
    }
});



router.get("/successfullyRegistered", function(req,res){
    isLoggedIn(req,res,function(logged){
        var text="Registrazione avvenuta con successo."
        res.send(pug.renderFile("views/success.pug", {
            text: text, logged: logged
        }));
    });
});

router.get("/successfullyRequest", function(req,res){
    isLoggedIn(req,res,function(logged){
        var text="Richiesta ripetizioni avvenuta con successo."
        res.send(pug.renderFile("views/success.pug", {
            text: text, logged: logged
        }));
    });
});

router.get("/successfullyCreatedPost", function(req,res){
    isLoggedIn(req,res,function(logged){
        var text="Post creato con successo."
        res.send(pug.renderFile("views/success.pug", {
            text: text, logged: logged
        }));
    });
});

router.post("/messages", function(req,res){
    isLoggedIn(req,res,function(logged){
        if(!logged) return res.redirect("/login");
        Message.findMessages(req.session.userId, function (error, messages) {
            if (error || messages.length===0) {
                console.log("nessun risultato dalla query");
                res.send(pug.renderFile("views/notifications.pug", {messages: [], nNotifications: req.body.nNotifications, logged: logged}));
            } else {
                res.send(pug.renderFile("views/notifications.pug", {messages: messages, nNotifications: req.body.nNotifications, logged: logged}));
            }
        });
    });
});

router.get("/messages", function(req,res){
    isLoggedIn(req,res,function(logged){
        if(!logged) return res.redirect("/login");
        Message.findMessages(req.session.userId, function (error, messages) {
            if (error || messages.length===0) {
                console.log("nessun risultato dalla query");
                res.send(pug.renderFile("views/notifications.pug", {messages: [], nNotifications: 0, logged: logged}));
            } else {
                res.send(pug.renderFile("views/notifications.pug", {messages: messages, nNotifications: 0, logged: logged}));
            }
        });
    });
});

router.post("/messages", function(req,res){
    isLoggedIn(req,res,function(logged){
        if(!logged) return res.redirect("/login");
        Message.findMessages(req.session.userId, function (error, messages) {
            if (error || messages.length===0) {
                console.log("nessun risultato dalla query");
                res.send(pug.renderFile("views/notifications.pug", {messages: [], nNotifications: req.body.nNotifications, logged: logged}));
            } else {
                res.send(pug.renderFile("views/notifications.pug", {messages: messages, nNotifications: req.body.nNotifications, logged: logged}));
            }
        });
    });
});

router.post("/setMessagesReaded", function(req,res){
    isLoggedIn(req,res,function(logged){
        if(!logged) return res.redirect("/login");
        Message.update({}, {recived: true}, {multi: true}, function(err) { 
            res.redirect('/messages');
        });
    });
});

router.use("/api", api);


function isLoggedIn(req, res, callback) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
        if (error) {
            return callback(false);
        } 
        else {
            if (user === null) {
                return callback(false);
            }
            else {
                return callback(true);
            }
        }
    });
}
module.exports = router;
