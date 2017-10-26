import { Component, OnInit } from '@angular/core';
import { TempusersService } from 'app/tempusers.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/message.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as io from 'socket.io-client';

@Component({
  templateUrl: './charboard.component.html',
  styleUrls: ['./charboard.component.css']
})
//@HostListener('window:beforeunload', ['$event'])

export class CharboardComponent implements OnInit {
  otpnumber:number;
  emailid;
  form:FormGroup;
  iform:FormGroup;
  socket;
  chType=false;
  participants:any;
  chconfirm:boolean = false;
  messageDetail:any;
  id: number;
  private sub: any;
  constructor(private _usr:TempusersService,private _route: ActivatedRoute, private _msg:MessageService,  private _fb: FormBuilder) {
    this.socket=io().connect();
    this.form = _fb.group({
      "emailid":["",Validators.email],
      "shortname":["",Validators.required],
      "otpnumber":["",Validators.required]
    })
    this.iform = _fb.group({
      "otpnumber":["",Validators.required]
    })
   }
  
  
  submitclick(post){
    console.log(post)
    let chtype = sessionStorage.chtype;
    let sendData={
      sendotp:post.otpnumber,
      chatype:sessionStorage.chtype,
      emailid:post.emailid,
      sessionid:this.id,
      shortname:post.shortname
    }
    if(sessionStorage.chtype!='initiator'){
      sessionStorage.shortname = post.shortname;
      sessionStorage.email = post.emailid;
    }
    console.log(sendData)
    this._usr.checkotp(sendData).subscribe(
      res =>{
        console.log(res)
        sessionStorage.sessionid= res.sessionid;
        sessionStorage.sessionotp= res.sessionotp;
        this.socket.on('participantData',(res)=>{          
          if(sessionStorage.sessionid == res.sessionid && sessionStorage.sessionotp == res.sessionotp){
            console.log(res);
            this.chconfirm = res.auth_type
            this.participants = res.participantsList;
          }
        });
      }
    );
    
     this.socket.emit('set-name',sessionStorage.email);
    

    // socket.on('connect', function () {

    //     person_name = prompt("Welcome. Please enter your name");

    //     socket.emit('NewPlayer', person_name);

    //     socket.on('disconnected', function() {

    //         socket.emit('DelPlayer', person_name);

    //     });

    // });
    
  }
  chatlists:any;
  messageclick(){
    //console.log(this.messageDetail)
    let messageobj:any = {
      message:this.messageDetail,
      shortname:sessionStorage.shortname,
      sessionid:sessionStorage.sessionid,
      sessionotp:sessionStorage.sessionotp
    }
    //console.log(messageobj);

    this._msg.postMessage(messageobj)
    .subscribe(
      res=>{
        console.log(res);
        let datalen= res.result.length-1;
        if(sessionStorage.sessionid == res.result[datalen].sessionid && sessionStorage.sessionotp == res.result[datalen].sessionotp){
          this.chatlists = res.result; 
          console.log(res);
        }
        this.socket.on('messageData',(res)=>{
          console.log(res.result)
          //this.chatlists = res.data  
          let datalen= res.result.length-1;        
          if(sessionStorage.sessionid == res.result[datalen].sessionid && sessionStorage.sessionotp == res.result[datalen].sessionotp){
            this.chatlists = res.result; 
            console.log(res.result);
          }
          
        })
      }
    );
    
    
  }
  // ngOnDestroy(){
  //   let id = localStorage.email
  //   this.socket.emit('username', id);
  // }
  ngOnInit() {
    if(sessionStorage.chtype == 'initiator'){
      this.chType=false
    }else{
      this.chType=true
    }
    
    this.sub = this._route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
   });
  }
  
}
