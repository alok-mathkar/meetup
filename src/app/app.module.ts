import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TempusersService } from 'app/tempusers.service';
import { CharboardComponent } from './charboard/charboard.component';
import { ChatconfirmComponent } from './chatconfirm/chatconfirm.component';
import { RouteguardService } from './routeguard.service';
import { MessageService } from './message.service';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CharboardComponent,
    ChatconfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path:'home', component:HomepageComponent},  
      {path:'chat/:id', canActivate:[ RouteguardService ], component:CharboardComponent},
      {path:'', redirectTo:'home',pathMatch:'full'},
      {path:'**', redirectTo:'home',pathMatch:'full'}
      ])
  ],
  providers: [TempusersService, RouteguardService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
