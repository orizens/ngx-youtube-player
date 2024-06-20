import { Injectable, NgZone } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { IPlayerApiScriptOptions, IPlayerOutputs, IPlayerSize } from "./models";

export function win() {
  return window;
}

export function YouTubeRef(): any {
  return win()["YT"] as any;
}

export function YouTubePlayerRef() {
  return YouTubeRef().Player as any;
}

export const defaultSizes = {
  height: 270,
  width: 367,
};

@Injectable({
  providedIn: "root",
})
export class YoutubePlayerService {
  api: ReplaySubject<YT.Player>;

  static ytApiLoaded = false;

  constructor(private zone: NgZone) {
    this.api = new ReplaySubject(1);
    this.createApi();
  }

  loadPlayerApi(options: IPlayerApiScriptOptions) {
    const doc = win().document;
    if (!YoutubePlayerService["ytApiLoaded"]) {
      YoutubePlayerService.ytApiLoaded = true;
      const playerApiScript = doc.createElement("script");
      playerApiScript.type = "text/javascript";
      playerApiScript.src = `${options.protocol}://www.youtube.com/iframe_api`;
      doc.body.appendChild(playerApiScript);
    }
  }

  setupPlayer(
    elementId: string,
    outputs: IPlayerOutputs,
    sizes: IPlayerSize,
    videoId = "",
    playerVars: YT.PlayerVars
  ) {
    const createPlayer = () => {
      if (YouTubePlayerRef) {
        this.createPlayer(elementId, outputs, sizes, videoId, playerVars);
      }
    };
    this.api.subscribe(createPlayer);
  }

  play(player: YT.Player) {
    player.playVideo();
  }

  pause(player: YT.Player) {
    player.pauseVideo();
  }

  playVideo(media: any, player: YT.Player) {
    const id = media.id.videoId ? media.id.videoId : media.id;
    player.loadVideoById(id);
    this.play(player);
  }

  isPlaying(player: YT.Player) {
    // because YT is not loaded yet 1 is used - YT.PlayerState.PLAYING
    const isPlayerReady: any = player && player.getPlayerState;
    const playerState = isPlayerReady ? player.getPlayerState() : {};
    const isPlayerPlaying = isPlayerReady
      ? playerState !== YouTubeRef().PlayerState.ENDED &&
        playerState !== YouTubeRef().PlayerState.PAUSED
      : false;
    return isPlayerPlaying;
  }

  createPlayer(
    elementId: string,
    outputs: IPlayerOutputs,
    sizes: IPlayerSize,
    videoId = "",
    playerVars: YT.PlayerVars = {}
  ) {
    const playerSize = {
      height: sizes.height || defaultSizes.height,
      width: sizes.width || defaultSizes.width,
    };
    const ytPlayer = YouTubePlayerRef();
    return new ytPlayer(elementId, {
      ...playerSize,
      events: {
        onReady: (ev: YT.PlayerEvent) => {
          this.zone.run(() => outputs.ready && outputs.ready.next(ev.target));
        },
        onStateChange: (ev: YT.PlayerEvent) => {
          this.zone.run(() => outputs.change && outputs.change.next(ev));
        },
      },
      playerVars,
      videoId,
    });
  }

  toggleFullScreen(
    player: YT.Player,
    isFullScreen: boolean | null | undefined
  ) {
    let { height, width } = defaultSizes;

    if (!isFullScreen) {
      height = window.innerHeight;
      width = window.innerWidth;
    }
    player.setSize(width, height);
  }

  // adpoted from uid
  generateUniqueId(): string {
    const len = 7;
    return Math.random().toString(35).substr(2, len);
  }

  private createApi() {
    const onYouTubeIframeAPIReady = () => {
      if (win()) {
        win()["onYouTubeIframeAPIReadyCalled"] = true;
        this.api.next(YouTubePlayerRef());
      }
    };
    win()["onYouTubeIframeAPIReady"] = onYouTubeIframeAPIReady;
    /**
     * If onYouTubeIframeAPIReady is called in other place, then just trigger next
     * This is to prevent player not initializing issue when another player got initialized in other place
     */
    if (win()["onYouTubeIframeAPIReadyCalled"]) {
      this.api.next(YouTubePlayerRef());
    }
  }
}
