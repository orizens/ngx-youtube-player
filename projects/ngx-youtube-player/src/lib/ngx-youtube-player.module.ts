import { NgModule, ModuleWithProviders } from '@angular/core';
import { YoutubePlayerComponent } from './ngx-youtube-player.component';
import { YoutubePlayerService } from './ngx-youtube-player.service';

@NgModule({
  declarations: [YoutubePlayerComponent],
  imports: [],
  providers: [YoutubePlayerService],
  exports: [YoutubePlayerComponent]
})
export class NgxYoutubePlayerModule {
  static forRoot(): ModuleWithProviders<NgxYoutubePlayerModule> {
    return {
      ngModule: NgxYoutubePlayerModule,
      providers: [YoutubePlayerService]
    };
  }
}
