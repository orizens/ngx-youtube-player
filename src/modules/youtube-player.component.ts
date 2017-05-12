import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterContentInit, ElementRef, ViewChild } from '@angular/core';
import { YoutubePlayerService } from '../services/youtube-player.service';

@Component({
	selector: 'youtube-player',
	template: `
		<div id="yt-player-ng2-component" #ytPlayerContainer></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubePlayerComponent implements AfterContentInit {
	@Input() videoId: string = '';
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
	@Output() change = new EventEmitter<YT.EventArgs>();

	/*@internal*/
	@ViewChild('ytPlayerContainer') public ytPlayerContainer: ElementRef;

	constructor(
		public playerService: YoutubePlayerService,
		private elementRef: ElementRef
	) {}

	ngAfterContentInit () {
		const htmlId = this.playerService.generateUniqueId();
		const playerSize = { height: this.height, width: this.width };
		this.ytPlayerContainer.nativeElement.setAttribute('id', htmlId);
		this.playerService.loadPlayerApi({
			protocol: this.protocol
		});
		this.playerService.setupPlayer(htmlId, {
			ready: this.ready,
			change: this.change
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
