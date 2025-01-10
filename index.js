const express = require("express");
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');

 SECRET_KEY ="sivasaimokara";
const users =[];

app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/index.html")
})
app.post("/signup",logger,function(req,res){
    const username = req.body.username;
    const password= req.body.password;
   

    users.push({
        username: username,
        password:password
    })

    res.json({
        message:"You Are Signed In"
    })
})



app.post("/signin",logger,function(req,res){
    const username = req.body.username;
    const password= req.body.password;
   
    const foundUser = users.find((u)=> u.username===username&&u.password===password)

    if(foundUser){
        const token =jwt.sign({
            username:username
        },SECRET_KEY);

        
        res.json({
          token: token
        })
    }else{
        res.status(403).send({
                  message:"Invalid UseName And Password"
        })
    }

})

function auth(req,res,next){
    const token = req.headers.token;
    const decodedInformaion= jwt.verify(token,SECRET_KEY);
    
    if(!decodedInformaion.username){
  res.json({
    message:"You are not Logged In"
  })
    }else{
        req.username=decodedInformaion.username;
        next();
    }

}


app.get("/me",auth,logger,function(req,res){
   
    let foundUser= null;
    for(let i =0;i<users.length;i++){
        if(users[i].username===req.username){
            foundUser=users[i];
        }
    }
    
        res.json({
            username:foundUser.username,
            password:foundUser.password
        })
    
})

function logger(req,res,next){
    console.log(req.method+"reaquest");
    next();
}

app.listen(3000)