const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
// Connect
const connection = (closure) => {
    //console.log("we are  connected");
    return MongoClient.connect('mongodb://localhost:27017/chatapp', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};
// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};



// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', api);


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.post('/users', (req, res) => {
    //console.log(req.body)
    let insertData = {
        emailid:req.body.email,
        shortName:req.body.shortname,
        chatType:'initiator',

    }
    connection((db) => {
        db.collection('tempusers')
        .findOne({"emailid":req.body.email},(err,user)=>{
            //console.log(user)
            if(user==[] || user == null ){
                db.collection('tempusers').insert(insertData,{w:1} ,(err)=>{
                               
                }); 
                res.send({message:'Registering', chtype:'initiator', bool_type: true});
            }else{
                res.send({message:'Already registered', bool_type:false});
            }
        })
            
    });
});

app.post('/checkid',  (req, res) => {
    //console.log(req.body.sessionid);
    connection((db) => {
        db.collection('tempusers')
        .findOne({"sessionid":req.body.sessionid},(err,user)=>{
            //console.log(user)
            if(user==[] || user == null ){               
                res.send({bool_val:false});
            }else{
                //console.log(user.sessionOtp)
                if(user.sessionOtp==undefined){
                    let val = Math.floor(1000 + Math.random() * 9000);
                    let setitem = user;
                    setitem.sessionOtp = val;
                    let id = user._id;
                    db.collection('tempusers').updateOne({"_id":objectId(id)},{$set:setitem},(err)=>{
                        res.send({bool_val:true});
                    });
                }else{
                    res.send({bool_val:true});
                }
                
                //db.collection('sessionid').updateOne({"_id":objectId('59d7521384fb6b6b35627b8e')},{$set: setitem},(err)=>{});
                
                //console.log(val);
                
            }
        });            
    });
});

app.post('/checkotp', (req, res)=>{
    //console.log(res);
    connection((db)=>{
        //console.log(req.body)
        db.collection('tempusers').findOne({"sessionid":req.body.sessionid,"sessionOtp":parseInt(req.body.sendotp)},(err,user)=>{
            //console.log(user)
            if(user==[] || user == null ){
                res.send({bool_type:false})
            }else{
                let id = user._id;
                let participantsList = [];
                             
                if(req.body.chatype=='initiator'){                    
                    let setitem=user;
                    setitem.onlineStatus=1;                    
                    
                    db.collection('tempusers').updateOne({"_id":objectId(id)},{$set:setitem},(err)=>{ });
                    
                    db.collection('tempusers').findOne({"sessionid":req.body.sessionid,"sessionOtp":parseInt(req.body.sendotp)},(err,user)=>{
                        participantsList.push({
                            emai_id:user.emailid,
                            short_name:user.shortName,
                            onlineStatus:user.onlineStatus
                        });
                        //console.log("************************")
                        //console.log(participantsList)
                        for(let i = 0 ; i <user.participants.length; i++){
                            participantsList.push(user.participants[i])
                        }
                        //console.log("=========================")
                        //console.log(participantsList)
                      //  console.log('in if')
                        res.send({auth_type:true,sessionid:user.sessionid, sessionotp:user.sessionOtp, participantsList:participantsList})
                        io.emit('participantData',{auth_type:true, participantsList:participantsList,sessionid:user.sessionid, sessionotp:user.sessionOtp}); 
                        
                    });
                    
                }else{
                   
                    db.collection('tempusers')
                    .find({"sessionid":req.body.sessionid,"sessionOtp":parseInt(req.body.sendotp)})
                    .toArray((err,result)=>{
                        let setitem = result[0];
                        //console.log('participants in else condition');  
                        //console.log(req.body.emailid)                   
                        for(let i = 0; i< result[0].participants.length; i++){
                            //console.log('------------- '+result[0].participants[i].emai_id)
                            if(result[0].participants[i].emai_id == req.body.emailid){
                                //console.log('email condition if check');                              
                                setitem.participants[i].onlineStatus = 1;
                                setitem.participants[i].short_name = req.body.shortname
                                break;
                            }
                        }
                        //console.log(setitem)
                        db.collection('tempusers').updateOne({"_id":objectId(id)},{$set:setitem},(err)=>{
                            
                        })
                        db.collection('tempusers').findOne({"sessionid":req.body.sessionid,"sessionOtp":parseInt(req.body.sendotp)},(err,user)=>{
                            participantsList.push({
                                emai_id:user.emailid,
                                onlineStatus:user.onlineStatus,
                                short_name:user.shortName
                            });
                            for(let i = 0 ; i <user.participants.length; i++){
                                participantsList.push(user.participants[i])
                            }
                            
                           // console.log('participants list');
                            //console.log(participantsList)  
                            //console.log('in else')
                            res.send({auth_type:true, sessionid:user.sessionid, sessionotp:user.sessionOtp, participantsList:participantsList})
                            io.emit('participantData',{auth_type:true, sessionid:user.sessionid, sessionotp:user.sessionOtp, participantsList:participantsList}); 
                        })
                        
                        
                    })
                }
                
            }
        });
    })
});

app.post('/postparticipants', (req, res) => {
    const email = req.body.emailid;
    //console.log(req.body);
    var item = {
        participants:req.body.lists,
    }
    connection((db) => {
        db.collection('sessionid').find({}).toArray(
            (err,result)=>{
                var val =  result[0].session_id;
                let setitem= {
                    "session_id": parseInt(val)+1
                }
                db.collection('sessionid').updateOne({"_id":objectId('59d7521384fb6b6b35627b8e')},{$set: setitem},(err)=>{});
                item.sessionid = parseInt(val)+1;
                db.collection('tempusers').updateOne({"emailid":email},{$set: item},(err)=>{
                    res.send({currentsesid:parseInt(val)+1});
                });
            }
        )
       
    })
    
})
app.post('/usermessage',(req,res)=>{
    //console.log(req.body);
    let insertData = req.body.data;
    //console.log(insertData.sessionid, insertData.sessionotp)
    connection((db) => {
        db.collection('chatlists').insert(insertData,{w:1} ,(err)=>{
            db.collection('chatlists')
            .find({"sessionid":insertData.sessionid,"sessionotp":insertData.sessionotp})
            .toArray((err,result)=>{
                res.send({result});
                console.log(result)
                io.emit('messageData',{result});
            });
        });

    })

});
//Set Port

const port = process.env.PORT || '3000';
app.set('port', port);


io.on('connection',(socket)=>{
    var name;
    socket.on('set-name', function(_name) {
        name = _name;
        console.log('user connected '+ name);
    });
    
    // var userId;
    // socket.on('username', function(id) {
    //   userId = id;
    //   // ...
    // });
    // console.log(userId)
    

    socket.on('disconnect',()=>{
        console.log('user disconnected '+name)
        console.log("DISCONNECTED "+name);
        // console.log(userId)
    })
})

server.listen(port, () => console.log(`Running on localhost:${port}`));