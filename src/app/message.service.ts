import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {

  constructor(private _http:HttpClient) { }

  postMessage(data:any): Observable<any> {
    return this._http.post('/usermessage',{data});
  }

}
