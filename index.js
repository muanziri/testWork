const express=require('express');
const mongoose=require('mongoose')
const cors=require('cors')
const user=require('./models/users')
const computer=require('./models/Computers')
const app =express()
const http= require('http').Server(app)
const io = require('socket.io')(http);

const DB="mongodb+srv://muna:muna@cluster0.c997r.mongodb.net/Test?retryWrites=true&w=majority";
mongoose.connect(DB,{ useNewUrlParser:true,useUnifiedTopology:true})
  .then((results)=>{

    
   console.log('connected....');
  })
  .catch((err)=>{
      console.warn(err)
  })

app.set('view engine','ejs');
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PUSH"],
    credentials: true,
  })
);
app.use('/static',express.static(__dirname+'/static'))
app.use(express.urlencoded({extended: true}));
let funcToLoggin;
let funcToLoggout;
io.on('connection', function(socket){
  funcToLoggin=(Name,Date,Time,pc)=>{
    io.emit('UserLoggin','The user with name: '+Name+' has logged-In on Date: '+Date+' at '+Time+' on pc Number  '+pc)
  }
  funcToLoggout=(Name,Date,Time,pc)=>{
    io.emit('UserLoggout','The user with name: '+Name+' has logged-Out on Date: '+Date+' at '+Time+' on pc Number  '+pc)
  }
  
 
 
})
app.post('/userLoggin',(req,res)=>{
  let data=JSON.parse(req.body.data)
  let UserName=data.userName
  let passCode=data.passCode
  let date=data.userDate
  let time=data.userTime
  let PCNumber=data.PCNumber
  user.findOne({userName:UserName}).then((resp)=>{
   if(resp.userName == null){
  res.json({loginMessage:'No user Found with this Name'})
   }else{
    if(resp.PassCode !== passCode || resp.isLoggedIn == "true"){
      res.json({loginMessage:'Invalid passcode or you are logged-in in another pc'})
    }else{
      user.updateOne(
        { userName: UserName },
        { $addToSet: { logginTimes: "logged in , "+date+" , "+time } },
        function () {
          user.updateOne(
            { userName: UserName },{isLoggedIn: true}, function () {
              res.json({SuccessMessage : "success"})
            if(funcToLoggin !== null){
              funcToLoggin(UserName,date,time,PCNumber)
            }
           computer.findOne({PcNumber:PCNumber}).then((result)=>{
            if(result !== null){
              computer.updateOne({PcNumber:PCNumber},{currentUser:UserName},function(res){
              console.log('updated')
              })
            }
           })
            })
        }
      );
     }
    }
   }
  )
  
})
app.post('/RegesterNewUser',(req,res)=>{
  
  let data=JSON.parse(req.body.data)
  let newUserName=data.newUserName
  let newUsernewPassCode=data.newUsernewPassCode
  user.findOne({userName:newUserName}).then((results)=>{
  if(results== null){
    new user({
      userName:newUserName,
      PassCode:newUsernewPassCode
    }).save().then(()=>{
    res.json({finneshedRegister:"The user with name :"+newUserName+" is registered"})
    })
  }else{
    res.json({isAlreadyRegistered:"The user :"+newUserName+" already exist"})
  }
  })

  // funcToLoggin('Munaziri Bienaime',"15/07/2023","13:00","PC120")
})

app.post('/AdminCodeCheck',(req,res)=>{
  let data=JSON.parse(req.body.data)
  
  let passCode=data.passCode

  user.findOne({userName:"Admin"}).then((resp)=>{
    if(resp.PassCode == passCode){
    res.json({isValid:true})
    }else{
      res.json({isValid:false}) 
    }
  })
})
app.post('/RemoveUser',(req,res)=>{
  let data=JSON.parse(req.body.data)
  let userName=data.userName
  user.findOneAndDelete({userName:userName}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
       res.json({userdelete:'user with name '+userName+" was safely deleted"})
    }
})
})
app.post('/RegisterPc',(req,res)=>{
  let data=JSON.parse(req.body.data)
  let PcNumber=data.registerCode
  computer.findOne({PcNumber:PcNumber}).then((results)=>{
    if(results == null){
      new computer({
        PcNumber:PcNumber
      }).save().then(()=>{
        res.json({isRegistered:true})
      })
    }else{
      res.json({isRegistered:false})
    }
  })
})
app.get('/userLoggout',(req,res)=>{
  funcToLoggout('Munaziri Bienaime',"15/07/2023","13:00","PC120")
})
app.get('/',(req,res)=>{
  res.render('Admin')
})
  http.listen(5000,()=>{
    console.log('heard From 5000')
  })