import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TempusersService } from 'app/tempusers.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class RouteguardService implements CanActivate {


  constructor(private _user:TempusersService, private _router:Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let id = +route.url[1].path;
    return this._user.isAuthenticated(id).map((isAuth:any) => {
        console.log(isAuth)
          console.log('is authenticated',isAuth);
           if (isAuth.bool_val) {
               return true;
           }else{
               this._router.navigate(['/home']);
               return false;
           }
       });
 }
}
