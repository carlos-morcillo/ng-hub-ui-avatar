import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AvatarModule } from 'ngx-avatars';

import { AppComponent } from './app.component';
import { UserService } from './user.service';

const avatarColors = ['#FFB6C1', '#2c3e50', '#95a5a6', '#f39c12', '#1abc9c'];

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AvatarModule.forRoot({
            colors: avatarColors
        })], providers: [UserService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
