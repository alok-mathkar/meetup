import { Component, OnInit } from '@angular/core';
import { TempusersService } from 'app/tempusers.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare var $;

@Component({
  
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  form:FormGroup;
  pageUrl: string;
  tempemail:string;
  inputsArray:any;
  participants:any=[];
  checkinput:boolean=true;
  checkSession:boolean=false;
  addemail:boolean = true;
  addusers:boolean=false;
  showEmail:boolean=true;
  alertText:string;
  alertTextBool:boolean=false;
  post:any;
  chkValidate:boolean =false;
  constructor(private _tempuser: TempusersService, private _fb: FormBuilder) {
    this.form = _fb.group({
      "email":["",Validators.email],
      "shortname":["",Validators.required],
      
    })

   }
  
  ngOnInit() {
    this.inputsArray = [1];
  }
  onsubmit(post){    
    let sendData = {
      email:post.email,
      shortname:post.shortname
    }
    sessionStorage.shortname = post.shortname;
    this._tempuser.postTempusers(sendData).subscribe(
      res =>{
        this.showEmail = !(res.bool_type);
        this.addusers = res.bool_type;
        this.alertTextBool = !(res.bool_type);
        this.alertText = res.message;
        sessionStorage.email = post.email;
        sessionStorage.chtype = res.chtype;
        //console.log(res)
      });
  }
  delete(ind){
    if(!(this.inputsArray.length<=1)){      
      this.inputsArray.splice(ind,1);
    }
    

  }
 validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
  onChange(val){
    this.validateEmail(val);
    if(this.validateEmail(val)){
      this.chkValidate =true;
      this.checkDisable(this.chkValidate);
      console.log('email')
      
    }else{
      this.chkValidate =false;
      this.checkDisable(this.chkValidate);
      console.log('wrong email')
      
    }
  }
  checkDisable(bool){
    console.log(bool)    
    return bool;
  }
  checkStatus(){
    let chkBool;
    $('.usersWidget .form-control').each((i)=>{
      if($('.usersWidget .form-control').eq(i).val()==""){
        chkBool=true;      
      }else{
        chkBool=false;
       }
       
    });
    this.checkinput = chkBool;
  }
  addUsers(){
    this.checkStatus();
    this.chkValidate =false;
    this.checkDisable(this.chkValidate);
    if(this.checkinput==false){
      this.inputsArray.push(parseInt(this.inputsArray[this.inputsArray.length-1]+1));
      this.checkinput = true;
    }
  }
  createUsers(){      
      this.checkStatus();
      if(this.checkinput==false){
        this.insertParticipants();
        let data = {
          emailid:sessionStorage.email,
          lists:this.participants
        }
        this._tempuser.postParticipants(data).subscribe(
          res =>{
            this.checkSession = true;
            this.addusers = false;
           // console.log(this.addusers);
            this.pageUrl = 'http://localhost:3000/chat/'+res.currentsesid;
          }
        );
        
      }else{
        //console.log("dont work")
      }
  }

  insertParticipants(){
    $('.usersWidget .form-control').each((i)=>{
      this.participants.push(
        {
          emai_id:$('.usersWidget .form-control').eq(i).val(),
          onlineStatus:0
        }

      )
       
    });
    
  }



}

