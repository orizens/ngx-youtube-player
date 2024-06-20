import { Component } from "@angular/core";
import { YoutubePlayerComponent } from "ngx-youtube-player";

@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [YoutubePlayerComponent]
})
export class AppComponent {
  id = "V462IsOV3js";
  playerVars = {
    cc_lang_pref: "en",
  };
  private player;
  public ytEvent;

  constructor() {}
  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }
}
