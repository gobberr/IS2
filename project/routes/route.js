var express = require('express');
var router = express.Router();
const pug = require('pug');
var test = require("./test");
var User = require("../model/user");
var Corso = require("../model/post");
var Review = require("../model/review");
var path = require('path'); 
var fs = require('fs');
var formidable = require('formidable');
var geolib = require('geolib');

//var bodyparser = require('body-parser');

router.get("/", function(req,res,next){
    isLoggedIn(req,res, function(logged) {
        console.log("logged"+logged);
        res.write(pug.renderFile("views/index.pug", {logged: logged}));
    });
});

router.post("/addreview", function(req,res){
	var utente = req.body.utente;
	var anntxt = req.body.anntxt;
	var ritorna = req.body.ritorna;
	
	res.write(pug.renderFile("views/add_recensione.pug", {utente: utente, ritorna : ritorna, anntxt : anntxt}));
});

//quando carica la prima volta la pagina di ricerca, non ci sono parametri e non visualizza annunci
router.get("/cerco", function(req,res){
    isLoggedIn(req,res, function(logged) {       
        res.write(pug.renderFile("views/cerco.pug", {values: [], logged: logged}));
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
        var maxDistance=req.body.distance;
        console.log("lat: " + lat + " lng: " + lng);
        
        Corso.findPosts(subject, function (error, post) {
            if (error || post.length===0) {
                console.log("nessun risultato dalla query");
                res.write(pug.renderFile("views/cerco.pug", {values: [], logged: logged}));
            } else {
                //console.log("query success: subject=" + subject + ", post=" + post);
                if(lat==""||maxDistance=="unl")
                    res.write(pug.renderFile("views/cerco.pug", {values: post, logged: logged}));
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
                    res.write(pug.renderFile("views/cerco.pug", {values: post2, logged: logged}));
                }
            }
        });
    });
});

router.get("/login", function(req,res) {
    isLoggedIn(req,res, function(logged) {        
        res.write(pug.renderFile("views/login.pug", {error: req.query.error, logged: logged}));res.end();
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

router.get("/registrati", function(req,res){
    isLoggedIn(req,res, function(logged) {        
        res.write(pug.renderFile("views/registration.pug", {logged: logged}));
    });
});

router.get("/pubblico", function(req,res) {
	res.write(pug.renderFile("views/pubblico.pug", {utente : new User, recensioni : [], posts : []}));
});

router.post("/pubblico", function(req,res) {
	var userpublic = req.body.userpublic;
	var reviewpublic = req.body.reviewpublic;
	//console.log(userpublic + ", " + reviewpublic);
	
	User.findByEmail(userpublic, function(error, user) {
		if(error || !user) {
			console.log(error);
			res.write(pug.renderFile("views/pubblico.pug", {utente : new User, recensioni : reviewpublic, posts : []}));
		} else {
			//console.log(user);
			Corso.findUserPosts(userpublic, function(error, post){
				if (error || !post) {
					console.log(error);
					res.write(pug.renderFile("views/pubblico.pug", {utente : user, recensioni : reviewpublic, posts : []}));
				} else {
					//console.log(post);
					console.log(user);
					console.log(reviewpublic);
					console.log(user.skills.length);
					res.write(pug.renderFile("views/pubblico.pug", {utente : user, recensioni : reviewpublic, posts : post}));
				}
			});
		}
	});
});

router.get("/account", function(req,res,next){
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
                res.write(pug.renderFile("views/account.pug", {numero_telefono: user.telephone, email: user.email, skills: user.skills, descrizione: user.description }));
                res.end();
            }
        }
    });
    
});

router.post("/account", function(req,res){
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
                    console.log();
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
                res.write(pug.renderFile("views/account.pug", {numero_telefono: user.telephone, email: user.email, skills: user.skills, descrizione: user.description }));
                res.end();
            }
        }
    });    
});

router.get("/chiSiamo", function(req,res) {
    isLoggedIn(req,res, function(logged) {
        res.write(pug.renderFile("views/chiSiamo.pug", {logged: logged}));
        res.end();
    });
});

router.get("/offro", function(req,res){
    isLoggedIn(req,res, function(logged) {
        if(!logged) return res.redirect("/login");        
        res.write(pug.renderFile("views/offro.pug", {logged: logged}));
    });
});

router.post("/offro", function(req,res){
    isLoggedIn(req,res, function(logged) {
        if(!logged) return res.redirect("/login");
        var postData = {
            email: req.body.email,
            subject: req.body.subject,
            text: req.body.text,
            location: {latitude: req.body.latitudine, longitude: req.body.longitudine}       
        }
        Corso.create(postData, function (error, user) {
            if (error) {
                return next(error);
            }
            else {
                console.log("post creato!");
                return res.redirect('/test/successfullyRegistered');
            }
        });   
        //res.write(pug.renderFile("views/offro.pug"));
    });
});

router.post("/ritorna", function(req,res){
	var subject = req.body.subject;
	
	Corso.findPosts(subject, function (error, post) {
        if (error || post.length===0) {
			res.write(pug.renderFile("views/cerco.pug", {values: []}));
        } else {
			res.write(pug.renderFile("views/cerco.pug", {values: post}));
        }
    });
});

router.get("/annuncio", function(req,res){
    isLoggedIn(req,res, function(logged) {        
        res.write(pug.renderFile("views/annuncio.pug", {logged: logged}));
    });
});

router.post("/annuncio", function(req,res){
      isLoggedIn(req,res,function(logged){
		  var user = req.body.utente;
		  var anntxt = req.body.anntxt;
		  var ritorna = req.body.ritorna;
		  var recensioni = [];
		  
		  
		  User.findByEmail(user, function(error, em) {
		  	if (error || !em) {
				console.log("\nnessun risultato dalla query utenti");
				res.write(pug.renderFile("views/annuncio.pug", {recensioni : recensioni, utente : new User, anntxt : anntxt, ritorna : ritorna, media : 0, numero : 0, logged : logged}));
		  	} else {
				Review.findReviewOf(user, function(error, rs) {
					if (error || rs.length===0) {
						console.log("\nnessun risultato dalla query recensioni");
						res.write(pug.renderFile("views/annuncio.pug", {recensioni : recensioni, utente : em, anntxt : anntxt, ritorna : ritorna, media : 0, numero : 0, logged:logged}));
					} else {
						Review.avg(user, function(error, media) {
							if (error) {
								console.log(error);
								res.write(pug.renderFile("views/annuncio.pug", {recensioni : recensioni, utente : em, anntxt : anntxt, ritorna : ritorna, media : 0, numero : 0, logged:logged}));
							} else {
								var sum = 0;
								var count = media.length;
								for(var i=0; i<media.length; i++) {
									sum += media[i].vote;
								}
								res.write(pug.renderFile("views/annuncio.pug", {recensioni : recensioni, utente : em, anntxt : anntxt, ritorna : ritorna, media : sum/count, numero : media.length, logged:logged}));
							}
						});
					}
				});
			}
		  });
	});
});

router.post("/recensione", function(req,res){
	var reviewData = {
		reviewer: req.session.emailUser,
        revised: req.body.utente,
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

router.post('/upload', function (req, res) {
    
        var form = new formidable.IncomingForm();    
        var b=false;

        var MAX_UPLOAD_SIZE = 5242880; // max dim 5 mb 
        form.on('progress', function(bytesReceived, bytesExpected) {
            if(!b){
            if (bytesReceived > MAX_UPLOAD_SIZE) {
                console.log('File troppo grande, massimo 5 MB');  
                res.redirect("/test/account?error_size=true");
                b=true;
                //maxDimension = true;
                //res.write(pug.renderFile("views/account.pug", {maxDimension : maxDimension}));
            }}
        });
        if(!b){
        form.parse(req, function (err, fields, files) 
        {
            var extension = path.extname(files.file_upload.name);
            console.log("trying to upload file with extension: " + extension);
            if((extension == ".png") || (extension == ".jpg") || (extension == ".jpeg")){
                var oldpath = files.file_upload.path;
                var newpath = __dirname + '/../upload/' + files.file_upload.name;
                console.log("upload succesful!");
                fs.rename(oldpath, newpath, function (err) 
                {
                    if (err) throw err;
                    //succesful = true;                
                    //res.write(pug.renderFile("views/account.pug", {succesful : succesful}));
                    res.redirect("/test/account");                        
                });
            }
            else{
                console.log("upload NOT succesful because of file extension not allowed!");
                //res.write(pug.renderFile("views/account.pug", {extension : extension}));
                res.redirect("/test/account?error_ext=true");                
            }
        }); 
    }   
		}); 
});

router.use("/test", test);

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