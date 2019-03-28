import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxYoutubePlayerModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
