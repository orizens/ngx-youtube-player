import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubePlayerComponent } from './youtube-player.component';
import { YoutubePlayerService } from '../services/youtube-player.service';

@NgModule({
  declarations: [
    YoutubePlayerComponent
  ],
  exports: [
    YoutubePlayerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    YoutubePlayerService
  ]
})
export class YoutubePlayerModule { }
