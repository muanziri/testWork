const express=require('express');
const mongoose=require('mongoose')
const app =express()
const http= require('http').Server(app)
const io = require('socket.io')(http);

const DB="mongodb+srv://muna:muna@cluster0.c997r.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(DB,{ useNewUrlParser:true,useUnifiedTopology:true})
  .then((results)=>{

    
   console.log('connected....');
  })
  .catch((err)=>{
      console.warn(err)
  })

app.set('view engine','ejs');

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
app.get('/userLoggin',(req,res)=>{
  funcToLoggin('Munaziri Bienaime',"15/07/2023","13:00","PC120")
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