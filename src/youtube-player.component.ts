import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, AfterContentInit, ElementRef, ViewChild } from '@angular/core';

import { YoutubePlayerService } from './youtube-player.service';

@Component({
	selector: 'youtube-player',
	template: `
		<div id="yt-player-ng2-component" #ytPlayerContainer></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubePlayer implements AfterContentInit {
	@Input() videoId: string = '';
	@Input() height: number;
	@Input() width: number;

	// player created and initialized - sends instance of the player
	@Output() ready = new EventEmitter<YT.Player>();
	// state change: send the YT event with its state
	@Output() change = new EventEmitter();

	@ViewChild('ytPlayerContainer') private ytPlayerContainer: ElementRef;

	constructor(
		public playerService: YoutubePlayerService,
		private elementRef: ElementRef
	) {
	}

	ngAfterContentInit () {
		const htmlId = this.playerService.generateUniqueId();
		const playerSize = { height: this.height, width: this.width };
		this.ytPlayerContainer.nativeElement.setAttribute('id', htmlId);
		this.playerService.loadPlayerApi();
		this.playerService.setupPlayer(htmlId, {
			ready: this.ready,
			change: this.change
		}, playerSize, this.videoId);
	}
}
