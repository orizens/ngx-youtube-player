import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IPlayerApiScriptOptions, IPlayerOutputs, IPlayerSize } from '../models';

export function win() {
  return window;
}

export function YT() {
  return win()['YT'];
}

export function Player() {
  return YT().Player;
}

export const defaultSizes = {
  height: 270,
  width: 367
};

@Injectable()
export class YoutubePlayerService {
  api: ReplaySubject<YT.Player>;

  private ytApiLoaded = false;

  constructor(private zone: NgZone) {
    this.createApi();
  }

  loadPlayerApi(options: IPlayerApiScriptOptions) {
    const doc = win().document;
    if (!this.ytApiLoaded) {
      this.ytApiLoaded = true;
      const playerApiScript = doc.createElement("script");
      playerApiScript.type = "text/javascript";
      playerApiScript.src = `${options.protocol}://www.youtube.com/iframe_api`;
      doc.body.appendChild(playerApiScript);
    }
  }

  setupPlayer(
    elementId: string, outputs: IPlayerOutputs, sizes: IPlayerSize,
    videoId = '', playerVars: YT.PlayerVars) {
    const createPlayer = () => {
      if (Player) {
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
      ? playerState !== YT().PlayerState.ENDED && playerState !== YT().PlayerState.PAUSED
      : false;
    return isPlayerPlaying;
  }

  createPlayer(
    elementId: string, outputs: IPlayerOutputs, sizes: IPlayerSize,
    videoId = '', playerVars: YT.PlayerVars = {}) {
    const playerSize = {
      height: sizes.height || defaultSizes.height,
      width: sizes.width || defaultSizes.width
    };
    const ytPlayer = Player();
    return new ytPlayer(elementId, {
      ...playerSize,
      events: {
        onReady: (ev: YT.PlayerEvent) => {
          this.zone.run(() => outputs.ready && outputs.ready.next(ev.target));
        },
        onStateChange: (ev: YT.PlayerEvent) => {
          this.zone.run(() => outputs.change && outputs.change.next(ev));
        }
      },
      playerVars,
      videoId,
    });
  }

  toggleFullScreen(player: YT.Player, isFullScreen: boolean | null | undefined) {
    let { height, width } = defaultSizes;

    if (!isFullScreen) {
      height = window.innerHeight;
      width = window.innerWidth;
    }
    player.setSize(width, height);
  }

  // adpoted from uid
  generateUniqueId() {
    const len = 7;
    return Math.random().toString(35).substr(2, len);
  }

  private createApi() {
    this.api = new ReplaySubject(1);
    const onYouTubeIframeAPIReady = () => {
      if (win()) {
        this.api.next(YT());
      }
    };
    win()['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
  }
}
