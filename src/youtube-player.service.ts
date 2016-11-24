import { Http, URLSearchParams, Response } from '@angular/http';
import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { window } from '@angular/platform-browser/src/facade/browser';
import { ReplaySubject } from 'rxjs/ReplaySubject'

export interface PlayerOutputs {
  ready?: EventEmitter<YT.Player>;
  change?: EventEmitter<YT.EventArgs>;
}

export interface PlayerSize {
  height?: number;
  width?: number;
}

@Injectable()
export class YoutubePlayerService {
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
    const onYouTubeIframeAPIReady = () => { window && this.api.next(<any>window.YT) }
    window['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
  }

  loadPlayerApi () {
    const doc = window.document;
    let playerApiScript = doc.createElement("script");
    playerApiScript.type = "text/javascript";
    playerApiScript.src = "https://www.youtube.com/iframe_api";
    doc.body.appendChild(playerApiScript);
  }

  setupPlayer (elementId: string, outputs: PlayerOutputs, sizes: PlayerSize, videoId: string) {
    const createPlayer = () => {
      if (window.YT.Player) {
        this.createPlayer(elementId, outputs, sizes, videoId);
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

  createPlayer (elementId: string, outputs: PlayerOutputs, sizes: PlayerSize, videoId: string) {
    const service = this;
    const playerSize = {
      height: sizes.height || this.defaultSizes.height,
      width: sizes.width || this.defaultSizes.width
    };
    return new window.YT.Player(elementId, Object.assign({}, playerSize, {
      videoId: videoId || '',
      // playerVars: playerVars,
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

    function onPlayerStateChange (event: any) {
      const state = event.data;
      // play the next song if its not the end of the playlist
      // should add a "repeat" feature
      if (state === YT.PlayerState.ENDED) {

      }

      if (state === YT.PlayerState.PAUSED) {
          // service.playerState = YT.PlayerState.PAUSED;
      }
      if (state === YT.PlayerState.PLAYING) {
          // service.playerState = YT.PlayerState.PLAYING;
      }
      // console.log('state changed', state);
      // dispatch STATE CHANGE
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
