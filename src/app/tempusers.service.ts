import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class TempusersService {
  
  resultarr;
  sessionid;
  constructor(private _http:HttpClient) { }

  postTempusers(data:any): Observable<any>{
    return this._http.post("/users",data);
  }

  postParticipants(data:any):Observable<any>{``
    return this._http.post("/postparticipants",data);   
  }

 

  isAuthenticated(id): Observable<boolean> {     
      return this._http.post('/checkid',{sessionid:id})
        .map((response:any) => {
          let res = response;
          console.log("response");
          //if (res.code == 200) {
            //this.userIsAuthenticated.next(true);
            return res;
         // }
        }
      ).catch((err)=>{
        console.log(err)
        //maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        return Observable.of(false);
      });

  }

  checkotp(data):Observable<any>{
    return this._http.post("/checkotp",data)
  }

}
