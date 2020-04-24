 const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var port = process.env.PORT || 3000
const fs = require('fs')

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views') )
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret: 'shush',resave:false,saveUninitialized:false}))


app.listen(port, function(){
    console.log('server is running')
})

app.get('/', function(req,res){
    res.render('login')
})

app.get('/action',function(req,res){
    res.render('action')
})

app.get('/conjuring',function(req,res){
    res.render('conjuring')
})

app.get('/darkknight',function(req,res){
    res.render('darkknight')
})

app.get('/drama',function(req,res){
    res.render('drama')
})

app.get('/fightclub',function(req,res){
    res.render('fightclub')
})

app.get('/godfather',function(req,res){
    res.render('godfather')
})

app.get('/godfather2',function(req,res){
    res.render('godfather2')
})

app.post('/home',function(req,res){
   var obj2={
       username : req.body.username,
       password : req.body.password
   }
   var v2 = fs.readFileSync('usernames.json')
   if(v2==''){
    res.send('<p> Wrong username or password <p>')
   }
   else{
   var Bool2 = check2(obj2,JSON.parse(v2)) 
   if(Bool2){
    req.session.username = req.body.username
    res.render('home')
   }
   else{
       res.send('<p> Wrong username or password <p>')
   }
   }
})

app.get('/horror',function(req,res){
    res.render('horror')
})

app.get('/registration',function(req,res){
    res.render('registration')
})

app.get('/scream',function(req,res){
    res.render('scream')
})

app.post('/search',function(req,res){
   var movies= [{name:'The Conjuring',page:'conjuring'},{name:'The Dark Knight',page:'darkknight'},{name:'Fight Club',page:'fightclub'},{name:'The Godfather',page:'godfather'},{name:'The Godfather: part II',page:'godfather2'},{name:'Scream',page:'scream'}]
   var sr = []
   for(let i=0;i<movies.length;i++){
       var m = movies[i].name
       var s = req.body.Search
       var mlc= m.toLowerCase()
       var slc= s.toLowerCase()
       if(mlc.includes(slc)){
        sr.push(movies[i])
       }
   } 
   if(sr.length==0){
       res.send('<p> Movie not found <p>')
   }
   else{
    res.render('searchresults',{
      tasks2: sr  
    })
    }
})

app.get('/watchlist',function(req,res){
   var v4 = fs.readFileSync('usernames.json')
   var v41= JSON.parse(v4)
   var wl = []
   for(let i=0;i<v41.length;i++){
    if(v41[i].username==req.session.username){
        wl = v41[i].watchlist
        res.render('watchlist',{
        tasks : wl
    })
    }
    }
})

app.post('/add',function(req,res){
    var v3 = fs.readFileSync('usernames.json')
    var Bool3  = checkwatchlist(req.session.username,JSON.parse(v3),req.body.addtowatchlist)
    if(Bool3){
        res.send('<p> Watchlist already contains this movie <p>')
    }
    else{
       v31 = JSON.parse(v3)
       for(let i=0;i<v31.length;i++){
        if(v31[i].username==req.session.username){
            v31[i].watchlist.push(req.body.addtowatchlist)
            fs.writeFileSync('usernames.json',JSON.stringify(v31))
            var v4 = fs.readFileSync('usernames.json')
            var v41= JSON.parse(v4)
            var wl = []
            for(let i=0;i<v41.length;i++){
             if(v41[i].username==req.session.username){
                 wl = v41[i].watchlist
                 res.render('watchlist',{
                 tasks : wl
             })
             }
             }
        }
       }
    }
})

app.post('/register',function(req,res){
    var obj={
     username: req.body.username,
     password: req.body.password,
     watchlist: []
    }
    if(fs.readFileSync('usernames.json')==''){
        var arr=[] 
        arr.push(obj)
        fs.writeFileSync('usernames.json',JSON.stringify(arr))
        res.send('<p>  Registeration successful   </p>')
        
    }
    else{
            
        var v = fs.readFileSync('usernames.json')
        var bool= check(obj,JSON.parse(v))
        if(bool){
            res.send('<p>  Registeration successful   </p>')
        }else{

            res.send('<p> Registeration error </p>')
        }
    }
    
   
})

function check(user,file){
    
    for(let i=0;i<file.length;i++){
        
        if(file[i].username==user.username){
            return false
        }
   
    }
        file.push(user)
        fs.writeFileSync('usernames.json',JSON.stringify(file))
        return true;
        
}

function check2(user,file){
    for(let i =0 ;i<file.length;i++){
        if((file[i].username==user.username) && (file[i].password==user.password)){
            return true
        }
    }
    return false
}

function checkwatchlist(username,file,movie){
    for(let i=0 ; i<file.length;i++){
        if(file[i].username == username){
            for(let j=0;j<file[i].watchlist.length;j++){
                if(file[i].watchlist[j]==movie){
                    return true
                }
            }
        }
    }
    return false
}