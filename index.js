const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const userModel = require("./Models/user")

app.set("view engine","ejs")
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
  res.render("register");
})
   
app.post("/create",function(req,res){
  let {name,email,password,age}=req.body;

  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
      let createdUser = await userModel.create({
      name:name,
      email:email,
      password:hash,
      age:age
    })
    let token = jwt.sign({email},"nnnnsnsnsns");
res.cookie("token",token);
    // res.send(createdUser);
    res.redirect("/login");
    })
  })
})
app.get("/logout",function(req,res){
  res.cookie("token","");
  res.redirect("/")
})

app.get("/login",(req,res)=>{
  res.render("login")
})
app.post("/login",async (req,res)=>{
  let user = await userModel.findOne({email:req.body.email});
  if(!user) return res.send("User not found");
  
   bcrypt.compare(req.body.password,user.password,(err,result)=>{
   if(err) return res.send("Error comparing passwords");
   if(result) {
    let token = jwt.sign({email:user.email},"nncnncncnnc");
    res.cookie("token",token);
    res.send("login Successfully");
  }
   else res.send("can't login");
   console.log(result)
   })
})


app.listen(3000);