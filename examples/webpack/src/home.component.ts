import { ChangeDetectionStrategy, Component, state } from '@angular/core';

@Component({
    selector: 'home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h1>Youtube Player Component</h1>
        <section>
          <h2>Component (Default)</h2>
          <youtube-player></youtube-player>
        </section>

        <section>
          <h2>Component With videoId (Default)</h2>
          <youtube-player [videoId]="videoId"></youtube-player>
        </section>

        <section>
          <h2>Component With videoId and events (Default)</h2>
          <youtube-player [videoId]="videoId"
            (ready)="handlePlayerReady($event)"
            (change)="handlePlayerStateChange($event)"
          ></youtube-player>
          <pre>player is ready: {{ isPlayerReady }}</pre>
          <pre>player state: {{ playerState }}</pre>
        </section>
    `,
})
export class HomeComponent {
    public videoId = 'u0VW4vhpnyA';
    public isPlayerReady = false;
    public playerState = {};

    constructor() {
    }

    handlePlayerReady(player) {
      console.log('player', player);
      this.isPlayerReady = true;
    }

    handlePlayerStateChange($event) {
      this.playerState = $event.data;
    }
}