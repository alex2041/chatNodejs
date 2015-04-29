var User = require('../schema/user').User;
var e = require('../ext/error');
module.exports = function(app){
    app.get('/login', function(req, res, next){
        res.render('login', {title:'Login'});
    });
    
    app.post('/login', function(req, res, next){
        var login = req.body.login;
        var pass = req.body.password;
        User.findOne({name: login}, function(err, curUser){
            if(err) next(err);
            if(curUser){
                if(curUser.checkPassword(pass)){
                    req.session.user = curUser._id;
                    res.status(302);
                    res.setHeader("Location", "/");
                    res.end();
                }else{
                    next(e.setError(401));
                }
            }else{
                next(e.setError(401));
            }
        });
    });
    
    app.get('/register', function(req, res, next){
        res.render('register', {title:'Register'});
    });
    
    app.post('/register', function(req, res, next){
        var login = req.body.login;
        var pass = req.body.password;
        var passwordconfirm = req.body.passwordconfirm;
        
        if(pass = passwordconfirm){
            var newuser = new User({
                name: login,
                password: pass
            });
            newuser.save(function(err){
                if(err) console.dir(err);
                
                User.findOne({name: login}, function(err, curUser){
                if(err) next(err);
                if(curUser){
                    if(curUser.checkPassword(pass)){
                        req.session.user = curUser._id;
                        res.status(302);
                        res.setHeader("Location", "/");
                        res.end();
                    }else{
                        next(e.setError(401));
                    }
                }else{
                    next(e.setError(401));
                }
                });
                
            });
        }
    });
    
    app.get('/users/:id', function(req, res, next){
        User.findById(req.param('id'), function(err, users){
            if(err) next(err);
            if(users === null) next(e.setError(404.1, 'User not found'));
            res.json(users);
        });
    });
    
    app.get('/users', function(req, res, next){
        User.find({}, function(err, users){
            if(err) next(err);
            res.json(users);
        });
    });
    
    app.get('/', function(req, res, next){
        if(req.session.user){
            User.findById(req.session.user, function(err, user){
                if(err) next(err);
                res.render('index', {title:'chat', name: user.name});
            });
        }else{
            res.render('login', {title:'chat', name:'Гость'});  
        }
    });
    
    app.get('/logout', function(req, res, next){
        req.session.destroy(function(err) {
            if(err) next(err);
            res.status(302);
            res.setHeader("Location", "/");
            res.end();
        });
    });
};


/*
var express = require('express');
var router = express.Router();

 GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/