import { Http, URLSearchParams, Response } from '@angular/http';
import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { PlayerApiScriptOptions, PlayerOutputs, PlayerSize } from '../models';

@Injectable()
export class YoutubePlayerService {
  static get win () {
    return window;
  }

  static get YT() {
    return YoutubePlayerService.win['YT'];
  }

  static get Player() {
    return YoutubePlayerService.YT.Player;
  }

  api: ReplaySubject<YT.Player>;

  private isFullscreen: boolean = false;
  private defaultSizes = {
      height: 270,
      width: 367
  };

  constructor (private zone: NgZone) {
    this.createApi();
  }

  private createApi () {
    this.api = new ReplaySubject(1);
    const onYouTubeIframeAPIReady = () => { YoutubePlayerService.win && this.api.next(<any>YoutubePlayerService.YT) }
    YoutubePlayerService.win['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
  }

  loadPlayerApi (options: PlayerApiScriptOptions) {
    const doc = YoutubePlayerService.win.document;
    let playerApiScript = doc.createElement("script");
    playerApiScript.type = "text/javascript";
    playerApiScript.src = `${options.protocol}://www.youtube.com/iframe_api`;
    doc.body.appendChild(playerApiScript);
  }

  setupPlayer (elementId: string, outputs: PlayerOutputs, sizes: PlayerSize, videoId: string, playerVars: YT.PlayerVars) {
    const createPlayer = () => {
      if (YoutubePlayerService.Player) {
        this.createPlayer(elementId, outputs, sizes, videoId, playerVars);
      }
    };
    this.api.subscribe(createPlayer);
  }

  play (player: YT.Player) {
    player.playVideo();
  }

  pause (player: YT.Player) {
    player.pauseVideo();
  }

  playVideo(media: any, player: YT.Player) {
    const id = media.id.videoId ? media.id.videoId : media.id;
    player.loadVideoById(id);
    this.play(player);
  }

  isPlaying (player: YT.Player) {
    // because YT is not loaded yet 1 is used - YT.PlayerState.PLAYING
    const isPlayerReady: any = player && player.getPlayerState;
    const playerState = isPlayerReady ? player.getPlayerState() : {};
    const isPlayerPlaying = isPlayerReady
      ? playerState !== YT.PlayerState.ENDED && playerState !== YT.PlayerState.PAUSED
      : false;
    return isPlayerPlaying;
  }

  createPlayer (elementId: string, outputs: PlayerOutputs, sizes: PlayerSize, videoId: string, playerVars: YT.PlayerVars = {}) {
    const service = this;
    const playerSize = {
      height: sizes.height || this.defaultSizes.height,
      width: sizes.width || this.defaultSizes.width
    };
    return new YoutubePlayerService.Player(elementId, Object.assign({}, playerSize, {
      videoId: videoId || '',
      playerVars: playerVars,
      events: {
          onReady: (ev: YT.EventArgs) => {
            this.zone.run(() => outputs.ready && outputs.ready.next(ev.target));
          },
          onStateChange: (ev: YT.EventArgs) => {
            this.zone.run(() => outputs.change && outputs.change.next(ev));
            // this.zone.run(() => onPlayerStateChange(ev));
          }
      }
    }));

    // TODO: DEPRECATE?
    function onPlayerStateChange (event: any) {
      const state = event.data;
      const PlayerState = YoutubePlayerService.YT.PlayerState;
      // play the next song if its not the end of the playlist
      // should add a "repeat" feature
      if (state === PlayerState.ENDED) {

      }

      if (state === PlayerState.PAUSED) {
          // service.playerState = PlayerState.PAUSED;
      }
      if (state === PlayerState.PLAYING) {
          // service.playerState = PlayerState.PLAYING;
      }
    }
  }

  toggleFullScreen (player: YT.Player, isFullScreen: boolean | null | undefined) {
    let { height, width } = this.defaultSizes;

    if (!isFullScreen) {
      height = window.innerHeight;
      width = window.innerWidth;
    }
    player.setSize(width, height);
    // TODO: dispatch event
  }

  // adpoted from uid
  generateUniqueId () {
    const len = 7;
    return Math.random().toString(35).substr(2, len);
  }
}
