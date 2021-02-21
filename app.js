require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const findOrCreate = require('mongoose-findorcreate');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const aws = require('aws-sdk');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var username_1;
//MongoDB Schema
const orderSchema = {
    username : String,
    orderId: String,
    Name : String,
    CompanyName : String,
    typeOfWork:String,
    Duedate:Date,
    PhoneNumber : Number,
    timeStamp: Date,
    comper : Number,
    Feedback:Number,
    completed:Number,
    comdate:Date
}
 const userSchema = new mongoose.Schema({
     Firstname : String,
     Lastname:String,
     email : String,
     password : String,
     googleId : String,
     image:Array
 });
 const user_nameSchema = {
     Name : String,
     mailId:String
 }
 const testiSchema = {
     Feedback :String,
     nos :Number,
     workid:String
 }
//  SESSION
app.use(session({
    secret: "WEWILLwinanytimeinJesus.",
    resave: false,
    saveUninitialized: false
}));
//  passport_INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

//  GOOGLE_LOGIN
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://stark-earth-88670.herokuapp.com/auth/google/wricks",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
},
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        User.findOrCreate({ googleId: profile.id,username:profile.displayName ,image:profile.photos }, function (err, user) {
            return cb(err, user);
        });
    }
));

// Mongoose_DB_CONECTION_WRICKSDB
mongoose.connect('mongodb+srv://admin-wricks:ml54RwEIUJh0GIaa@cluster0.wn2vf.mongodb.net/WRICKSDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

//  MONGODB_PLUGIN
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// MongoDB Collection
const Order = mongoose.model('Order', orderSchema);
const User = new mongoose.model("User", userSchema);
const User_name = mongoose.model("User_name",user_nameSchema);
const Testi = mongoose.model("Testi",testiSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//  Home_route_GET_REQUEST
app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        username_1 = req.user.username;
        if (req.user.username ==="Wricks Admin"){
            res.redirect("/admin");
        }
        // User_name.find({}, function(err, found){
        //     found.forEach(function(found,err){
        //         if(found.mailId===req.user.username){
        //             var uN = found.Name;
        //          res.render("index1", { "Var": 1, "Username": uN });
        //         }
                else{
                    res.render("index1", { "Var": 1, "Username": req.user.username });
                }
        //     })
            
        // });
    }
    else {
        res.render("index1", { "Var": 0 }) 
    }
});

// Home_route_POST_REQUEST
app.post("/", function (req, res) {
    var first = req.body.fname;
    var second = req.body.sname;
    var mail = req.body.mail;
    var data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: second,
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = 'https://us10.api.mailchimp.com/3.0/lists/0b75678197';
    const options = {
        method: "POST",
        auth: "mahershalal:3a08360877998aa58c1becbfd5602009-us10"
    };
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/public/success.html");
        } else {
            res.sendFile(__dirname + "/public/failure.html");
        }

        response.on("data", function (data) {
            // console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

// GET_REQUEST FOR GOOGLE BUTTON
app.get("/auth/google",
    passport.authenticate('google', { scope: ['profile'] })
);
app.get("/auth/google/wricks",
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
 


// GET_REQUEST_FOR_REGISTER
app.get("/register", function (req, res) {
    res.render("register");
});

// GET_REQUEST_FOR_LOGIN
app.get("/login", function (req, res) {
    res.render("login");
});

// POST_REQUEST_FOR_REGISTER

app.post("/register", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                const user_name = new User_name({
                    Name: req.body.FirstName + " " + req.body.SecondName,
                    mailId:req.body.username
                });
                user_name.save();
                res.redirect("/");
            });
        }
    });
});

// POST_REQUEST_FOR_LOG_IN
app.post('/login',function(req,res){
    const user = new User({
    username: req.body.username,
    password: req.body.password
});

req.login(user, function (err) {
    if (err) {
        console.log(err);
    } else {
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    }
});
});
// LOG_OUT_POST_REQUEST
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

// TESTIMONIAL_GET_REQUEST


// TESTIMONIAL_POST_REQUEST
app.get("/testi", function (req, res) {
    Order.find({},function(err,fu){
    Testi.find({}, function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.render("testimonials", { "newe": orders , "newed":fu })
        }
    })
})
})

// Order_route_GET_REQUEST
app.get('/order', function(req,res){  
});

// Order_route_POST_REQUEST
app.post("/order",function(req,res){
    if(req.isAuthenticated()){

        var n = Math.random();
    var g ="WD"+ Math.floor(n*1000);
    var Fname = req.body.fName;
    var Sname = req.body.sName;
    var Cname = req.body.cname;
    var Work = req.body.wname;
    var duue = req.body.dname;
    var Num = req.body.nname;
    res.render('index', { name: Fname, name1: Sname,name2:Cname,name3:Work,name4:duue,name5:Num,name6:g });
        
        const order = new Order({
            username: req.user.username,
            orderId: g,
            Name: Fname + " " + Sname,
            CompanyName: Cname,
            typeOfWork: Work,
            Duedate: duue,
            PhoneNumber: Num,
            timeStamp : Date(),
            comper:0,
            Feedback:0
        });
        order.save();
    }
    else{
        res.redirect("/login");
    }
});
// POST_REQUEST_FOR_PERCERTAGE
app.post("/WorkPer" , function(req,res){
    mongoose.set('useFindAndModify', false);
    const id =req.body.Work;
    const per={comper:req.body.per}
    Order.findByIdAndUpdate(id,per, function (err,resul) {
      if(err){
          console.log(err);
      }
      else{
          res.redirect("/admin");
      }
    })
})

// POST_REQUEST_FOR_DATE
app.post("/WorkDue", function (req, res) {
    mongoose.set('useFindAndModify', false);
    const id = req.body.Work;
    const per = { Duedate: req.body.due }
    Order.findByIdAndUpdate(id, per, function (err, resul) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin");
        }
    })
})

// POST_REQUEST_FOR_FEEDBACK_ENABLE
app.post("/feede", function (req, res) {
    
    console.log(req.body);
    
    mongoose.set('useFindAndModify', false);
    const id = req.body.fed1;
    const per = {Feedback: 1 }
    if(per===1){
        console.log();
        
    }
    Order.findByIdAndUpdate(id, per, function (err, resul) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin");
        }
    })
})

// POST_REQUEST_FOR_FEEDBACK_ENABLE
app.post("/feedd", function (req, res) {

    mongoose.set('useFindAndModify', false);
    const id = req.body.fed1;
    const per = { Feedback: 0 }
    if (per === 1) {
        // console.log();
    }
    Order.findByIdAndUpdate(id, per, function (err, resul) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin");
        }
    })
})

// GET_REQUEST_FOR_LOGIN
app.get("/profile", function (req, res) {
    if(req.isAuthenticated()){
        Order.find({username:req.user.username},function(err,found){
            if(err){
                console.log(err);
                
            }else{    
               res.render("personal", { "UN": req.user.username, vaar:found, "image":req.user.image });
            }
            
        })
       
    
    }
    
});

// GET_REQUEST_FOR_LOGIN
app.post("/freply", function(req,res){
   const testi = new Testi ({
       Feedback : req.body.fees,
       nos:req.body.kk,
       workid:req.body.kkk
   })
    testi.save(function(err){
        if(err){
            console.log(err);
        }
        else{

            res.redirect("/profile")
        }
    });
})
app.get("/agree",function(req,res){
    res.render("agree");
})
// ADMIN_PANNEL
app.get("/admin",function(req,res){
    
            var i = 0
            User.find({}, function (err, found) {
                if (err) {
                    console.log(err);
                }
                else {
                    i = found.length;
                }
            })
            Order.find({}, function (err, orders) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("admin", { newListItems: orders, noof: i })
                }
            })
})
app.get("/comple",function(req,res){
    Order.find({}, function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.render("completed", { newListItems: orders })
        }
    })
})
app.post("/delete",function(req,res){
    if(req.body.com === "COMPLETED"){
        const UniqueId = req.body.checkbox;
        const per = { completed: 1 ,comdate: Date()}
        if (per === 1) {
            // console.log();
        }
        Order.findByIdAndUpdate(UniqueId, per, function (err, resul) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/admin");
            }
        })
    }
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("Server started on port");
});
