//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const path = require("path");
const _=require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: "this is our secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-101:test123@cluster0.ijtgy.mongodb.net/webDB",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false  });


   // sechemas




const signupSchema=new mongoose.Schema({
  username:String,
  email:String,
  pass:String
});

signupSchema.plugin(passportLocalMongoose);


const projectSchema=new mongoose.Schema({
  project_title:String,
  project_admin:String,
  project_use:String,
  projet_discrpition:String
});

const profileSchema=new mongoose.Schema({
  id:Number,
  first_name:String,
  last_name:String,
  email:String,
  age:Number,
  organization:String,
  title:String,
  address:String,
  contact:Number,
  joining:Number,
  remark:String
});

const marksSchema = new mongoose.Schema({
  profile_id:String,
  exam_date:Date,
  exam_name:String,
  exam_subject:String,
  exam_marks:Number
});

const salarySchema = new mongoose.Schema({
  profile_id:String,
  deposit_date:Date,

  salary_rs:Number
});


const leaveSchema = new mongoose.Schema({
  date_from:Date,
  date_to:Date,
  profile_id:String,
});





              // models

const Login= new mongoose.model("login",signupSchema);

passport.use(Login.createStrategy());
passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

const Project= new mongoose.model("project",projectSchema);

const Profile= new mongoose.model("profile",profileSchema);

const Mark= new mongoose.model("mark",marksSchema);

const Salary= new mongoose.model("salary",salarySchema);

const Leave= new mongoose.model("leave",leaveSchema);
         // all the variables




var text;
var access;
var usertype;
var title;
var admin;
var username;
var type;
var name;
var mail;
var entry_type;
var profile_type;
var project_title;
var usage;
var id=[];
var i=0;



            // get req




app.get("/",function(req,res)
{
  res.render("index.ejs");
});

app.get("/sign_in",function(req,res)
{
  res.render("sign_in.ejs");
});


app.get("/home",function(req,res)
{
  res.redirect("/");
});


app.get("/sign_up",function(req,res)
{
  res.render("sign_up.ejs");
});


app.get("/user",function(req,res){

if(req.isAuthenticated()){
  console.log("/user");
  Project.countDocuments({project_admin:username},function(err,tech){

    if(!err){
      if(tech>0)
      {
        Project.find({project_admin:username},function(err,t){
          if(err){
            console.log(err);
          }else{
            res.render("user-home.ejs",
            {name:_.capitalize(username),mail:mail,entry_type:"welcome",access:"yes",data:t});
          }

        }).sort([["project_title",1]]);

      }
      else{
        console.log("hell"+tech);

        console.log("no");
        res.render("user-home.ejs",
        {name:_.capitalize(username),mail:mail,entry_type:"welcome",access:"no"});
      }
    }
    else{
      console.log(err);
    }
  });

} else {
  res.redirect("/sign_in");
}

});

app.get("/user/add_project",function(req,res){
  if(req.isAuthenticated()){
  res.render("user-home.ejs",
  {name:_.capitalize(username),mail:mail,entry_type:"midway",access:"add-project"});
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/delete_project",function(req,res){
  if(req.isAuthenticated()){
  res.render("user-home.ejs",
  {name:_.capitalize(username),mail:mail,entry_type:"midway",access:"delete_project",title:project_title});
} else {
  res.redirect("/sign_in");
}
});

// project profile

app.get("/user/:project_title",function(req,res){
    if(req.isAuthenticated()){
  console.log(req.params.project_title);
  project_title=req.params.project_title;

  Project.findOne({project_title:project_title},function(err,t){
    if(err){
        console.log(err);
    } else {
      usage=t.project_use;
    }

  });

  Profile.countDocuments({title:req.params.project_title},function(err,tech){

    if(!err){
      if(tech>0)
      {
        console.log("xoxo");
        Profile.find({title:req.params.project_title},function(err,t){
          if(err){
            console.log(err);
          }else{
            console.log(usage);
        res.render("user-home.ejs",
        {name:_.capitalize(username),mail:mail,entry_type:"project_entry",access:"goodbye",profile_type:"tonne",data:t,title:project_title,usage:usage});
      }

    }).sort([["id",1]]);
  }
      else{
        console.log("yooyoyo");
        res.render("user-home.ejs",
        {name:_.capitalize(username),mail:mail,entry_type:"project_entry",access:"goodbye",profile_type:"nil",title:project_title,usage:"not_set"});
      }
    } else{
      console.log(err);
    }

  });
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/:project_title/add_profile",function(req,res){
    if(req.isAuthenticated()){
  console.log("/user/:project_title/add_profile");

  project_title=req.params.project_title;
  res.render("user-home.ejs",
  {name:_.capitalize(username),mail:mail,entry_type:"project_entry",access:"goodbye",profile_type:"add",title:project_title,admin:_.capitalize(username),usage:"not_set"});
} else {
  res.redirect("/sign_in");
}
});


app.get("/user/:title/:email/view",function(req,res){
    if(req.isAuthenticated()){
  Profile.findOne({title:req.params.title,email:req.params.email},function(err,t){
    if(err){
      console.log(err);
    }else{
  res.render("user-home.ejs",
  {name:_.capitalize(username),mail:mail,entry_type:"project_entry",access:"goodbye",profile_type:"veiw",data:t,title:project_title,admin:_.capitalize(username),usage:"not_set"});
}
});
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/delete_profile",function(req,res){
  if(req.isAuthenticated()){
  res.render("user-home.ejs",
  {name:_.capitalize(username),mail:mail,entry_type:"project_entry",access:"goodbye",profile_type:"student",title:project_title});
} else {
  res.redirect("/sign_in");
}
});


app.get("/user/:title/:email/update",function(req,res){
  if(req.isAuthenticated()){
  mail=req.params.email;
  title=req.params.title;

  Profile.findOne({title:req.params.title,email:req.params.email},function(err,t){
    if(err){
      console.log(err);
    }else{
  res.render("user-home.ejs",
  {name:_.capitalize(username),mail:mail,entry_type:"project_entry",access:"goodbye",profile_type:"update",data:t,title:project_title,admin:_.capitalize(username),usage:"not_set"});
}
});
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/:id/view_marks",function(req,res){
    if(req.isAuthenticated()){
  console.log(req.params.id);
  Mark.find({profile_id:req.params.id},function(err,x){
    if(err){
      console.log(err);
    } else{
      console.log("/user/:id/view_marks");
      console.log(x);
      res.render("profile_data.ejs",{name:_.capitalize(username),mail:mail,data:x});
    }
  }).sort([["exam_date",1]]);
} else {
  res.redirect("/sign_in");
}
});





app.get("/user/:id/view_salary",function(req,res){
    if(req.isAuthenticated()){
  console.log(req.params.id);
  Salary.find({profile_id:req.params.id},function(err,x){
    if(err){
      console.log(err);
    } else{
      console.log("/user/:id/view_salary");
      console.log(x);
      res.render("salary_data.ejs",{name:_.capitalize(username),mail:mail,data:x});
    }
  }).sort([["deposit_date",1]]);
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/:id/view_leave",function(req,res){
    if(req.isAuthenticated()){
  console.log(req.params.id);
  Leave.find({profile_id:req.params.id},function(err,x){
    if(err){
      console.log(err);
    } else{
      console.log("/user/:id/view_leave");
      console.log(x);
      res.render("leave_data.ejs",{name:_.capitalize(username),mail:mail,data:x});
    }
  }).sort([["exam_date",1]]);
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/:title/upload_marks",function(req,res){
  if(req.isAuthenticated()){
  Profile.find({title:req.params.title},function(err,t){
    if(err){
      console.log(err);
    }else{
      console.log("/user/:title/upload_marks");
      res.render("data_modification.ejs",{name:_.capitalize(username),mail:mail,data:t,id:id,i:0});
    }
  }).sort([["id",1]]);
} else {
  res.redirect("/sign_in");
}
});

app.get("/user/:title/upload_salary",function(req,res){
  if(req.isAuthenticated()){
  Profile.find({title:req.params.title},function(err,t){
    if(err){
      console.log(err);
    }else{
      console.log("/user/:title/upload_salary");
      res.render("salary.ejs",{name:_.capitalize(username),mail:mail,data:t,id:id,i:0});
    }
  }).sort([["id",1]]);
} else {
  res.redirect("/sign_in");
}
});



app.get("/user/:title/upload_leave",function(req,res){
  if(req.isAuthenticated()){
  Profile.find({title:req.params.title},function(err,t){
    if(err){
      console.log(err);
    }else{
      console.log("/user/:title/upload_leave");
      res.render("leave.ejs",{name:_.capitalize(username),mail:mail,data:t,id:id,i:0});
    }
  }).sort([["id",1]]);
} else {
  res.redirect("/sign_in");
}
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/sign_in");
});

// .sort([["first_name",1]])

            // post req





app.post("/signup",function(req,res){

  Login.register({username: req.body.username,email: req.body.email}, req.body.password,function(err,user){
    if (err){
      console.log(err);

      res.redirect("/sign_up");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        console.log("/signup post");

        res.redirect("/sign_in");
      });

    }
  });

  // Login.countDocuments({username:req.body.una},function(err,c){
  //   if(!err){
  //     if(c>0){
  //         console.log("username exist");
  //         res.redirect("/sign_up");
  //
  //     }
  //     else{
  //
  //       const temp=new Login({
  //         username:req.body.una,
  //         email:req.body.email,
  //         pass:req.body.pass
  //       });
  //       temp.save();
  //       console.log("succesfully signUp");
  //       res.redirect("/sign_in");
  //
  //     }
  //   }
  //   else{
  //     console.log(err);
  //   }
  // });

});

app.post("/signin",function(req,res){
  username=req.body.username;



  const user= new Login({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user,function(err){
    if(err){
      console.log(err);

    } else{
      passport.authenticate("local")(req,res,function(){
        console.log("/signin post");
        Login.findOne({username:req.body.username},function(err,f){
          if(!err){
            if(f){
              mail=f.email;
            }
          }
        })

        res.redirect("/user");
      });
    }
  });
  // Login.countDocuments({username:req.body.user,pass:req.body.pass},function(err,c){
  //   if(!err){
  //     if(c>0){
  //         username=req.body.user;
  //         Login.findOne({username:username},function(err,f){
  //           if(!err){
  //             if(f){
  //               mail=f.email;
  //             }
  //           }
  //         });
  //         res.redirect("/user");
  //
  //     }
  //     else{
  //
  //       console.log("signin failed !!");
  //       res.redirect("/sign_in");
  //
  //     }
  //   }
  //   else{
  //     console.log(err);
  //   }
  // });

});

app.post("/add_project",function(req,res){
  Project.countDocuments({project_title:req.body.project_title},function(err,c){
    if(!err){

        if(c>0){
          console.log("project with this name alredy present");
        }
        else{
          const tempData=new Project({
            project_title:req.body.project_title,
            project_admin:username,
            project_use:req.body.select,
            projet_discrpition:req.body.projet_discrpition
          });
          console.log(req.body.select);
          tempData.save();
          console.log(tempData._id);
          console.log("succesfully added");
          res.redirect("/user");
        }
    }
    else{

      console.log(err);
    }
  });

});

app.post("/delete_project",function(req,res){
  console.log(req.body.project_title);
  console.log(req.body.project_admin);

    Project.deleteOne({project_title:req.body.project_title ,project_admin:req.body.project_admin },
      function(err){
          if(err)
          {
            console.log(err);
          }
          else
          {


            Profile.deleteMany({title:req.body.project_title},function(err){
              if(!err){
                console.log("profile succesfully deleted");
              }
              else{
                console.log(err);
              }
            });


            console.log("successfully deleted");
          }
      });
  res.redirect("/user");
});

app.post("/add_profile",function(req,res){

  var temp_profile=new Profile({
    id:req.body.id,
    first_name:req.body.fname,
    last_name:req.body.lname,
    email:req.body.email,
    age:req.body.age,
    organization:req.body.org,
    title:project_title,
    address:req.body.address,
    contact:req.body.contact,
    joining:req.body.join,
    remark:req.body.remark
  });

  console.log(req.body.id);
  console.log(req.body.fname);
  console.log(req.body.lname);
  console.log(req.body.email);
  console.log(req.body.age);
  console.log(req.body.org);
  console.log(project_title);
  console.log(req.body.address);
  console.log(req.body.address);
  console.log(req.body.join);
  console.log(req.body.remark);

  temp_profile.save();
  res.redirect("/user/"+project_title);

});

app.post("/user/profile/delete",function(req,res){
  console.log("in /user/delete_profile");
  console.log(req.body.delete);
  var checkid=req.body.delete;
  Profile.findById(checkid,function(err,c){
    if(err)
    {
      console.log(err);
    }
    else {
      Profile.findByIdAndRemove(checkid,function(err,t){
        if (err) {
          console.log(err);
        }
        else {
          console.log("successfully deleted the profile");
          res.redirect("/user/"+project_title);

        }
      });

    }
  });

});

app.post("/user/update_profile",function(req,res){
  Profile.updateOne({email:mail,title:title},
    {
      first_name:req.body.fname,
      last_name:req.body.lname,
      email:req.body.email,
      age:req.body.age,
      organization:req.body.org,
      address:req.body.address,
      contact:req.body.contact,
      joining:req.body.join,
      remark:req.body.remark
    },function(err){
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log("successfully updated the profile");
        res.redirect("/user/"+project_title);
      }
    });
});


app.post("/user/upload_leave",function(req,res){
  console.log("/user/upload_leave");
  console.log(req.body.datef);
  console.log(req.body.datet);
  var tempDatef=req.body.datef;
    var tempDatet=req.body.datet;


  console.log(req.body.id);

  var b;
  if(Array.isArray(req.body.id))
  {
  for(b=0; b<req.body.id.length;b++){
    var temp_profile_leave=new Leave({
      profile_id:req.body.id[b],
      date_from:tempDatef[b],
      date_to:tempDatet[b]
    });
    temp_profile_leave.save();
  }
}
else{
  var temp_profile_leave=new Leave({
    profile_id:req.body.id,
    date_from:tempDatef,
    date_to:tempDatet
  });
    temp_profile_leave.save();
}
  res.redirect("/user/"+project_title);
});




app.post("/user/upload_salary",function(req,res){
  console.log("/user/upload_salary");
  console.log(req.body.date);
  var tempDate=req.body.date;


  console.log(req.body.id);
  console.log(req.body.salary);
  var l;
    if(Array.isArray(req.body.id))
    {
  for(l=0; l<req.body.id.length; l++){
    var temp_profile_salary=new Salary({
      profile_id:req.body.id[l],
      deposit_date:tempDate,

      salary_rs:req.body.salary[l]
    });
    temp_profile_salary.save();
  }
}
else{
  var temp_profile_salary=new Salary({
    profile_id:req.body.id,
    deposit_date:tempDate,

    salary_rs:req.body.salary
  });
  temp_profile_salary.save();
}

  res.redirect("/user/"+project_title);
});

app.post("/user/upload_marks",function(req,res){
  console.log("/user/upload_marks");
  console.log(req.body.date);
  var tempDate=req.body.date;
  console.log(req.body.exam_name);
  var exameName=req.body.exam_name;
  console.log(req.body.subject);
  var subject=req.body.subject;
  console.log(req.body.id);
  console.log(req.body.mark);
  var j;
  if(Array.isArray(req.body.id))
  {
  for(j=0; j<req.body.id.length; j++){
    var temp_profile_mark=new Mark({
      profile_id:req.body.id[j],
      exam_date:tempDate,
      exam_name:exameName,
      exam_subject:subject,
      exam_marks:req.body.mark[j]
    });
    temp_profile_mark.save();
  }
}
else{
  var temp_profile_mark=new Mark({
    profile_id:req.body.id,
    exam_date:tempDate,
    exam_name:exameName,
    exam_subject:subject,
    exam_marks:req.body.mark
  });
  temp_profile_mark.save();
}
  res.redirect("/user/"+project_title);
});



app.listen(3000, function() {
  console.log("Server started succesfully");
});
