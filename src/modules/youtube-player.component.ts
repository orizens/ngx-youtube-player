import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { YoutubePlayerService } from '../services/youtube-player.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'youtube-player',
  template: `
    <div id="yt-player-ngx-component"></div>
  `,
})
export class YoutubePlayerComponent implements AfterContentInit {
  @Input() videoId = '';
  @Input() height: number;
  @Input() width: number;
  /**
   * @description sets the protocol by the navigator object
   * if there is no window, it sets a default http protocol
   * unless the protocol is set from outside
   */
  @Input() protocol: string = this.getProtocol();
  @Input() playerVars: YT.PlayerVars = {};

  // player created and initialized - sends instance of the player
  @Output() ready = new EventEmitter<YT.Player>();
  // state change: send the YT event with its state
  @Output() change = new EventEmitter<YT.PlayerEvent>();

  constructor(
    public playerService: YoutubePlayerService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterContentInit() {
    const htmlId = this.playerService.generateUniqueId();
    const playerSize = { height: this.height, width: this.width };
    const container = this.renderer.selectRootElement('#yt-player-ngx-component');
    this.renderer.setAttribute(container, 'id', htmlId);
    this.playerService.loadPlayerApi({
      protocol: this.protocol
    });
    this.playerService.setupPlayer(htmlId, {
      change: this.change,
      ready: this.ready,
    }, playerSize, this.videoId, this.playerVars);
  }

  getProtocol() {
    const hasWindow = window && window.location;
    const protocol = hasWindow
      ? window.location.protocol.replace(':', '')
      : 'http';
    return protocol;
  }
}
