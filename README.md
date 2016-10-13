[![Build Status](https://travis-ci.org/orizens/ng2-youtube-player.svg?branch=master)](https://travis-ci.org/orizens/ng2-youtube-player)

# Angular 2 Youtube Player Component
This is an angular 2 component based on [youtube player iframe api](https://developers.google.com/youtube/iframe_api_reference).
This component came out as a result of the [open source project Echoes Player](http://github.com/orizens/echoes-ng2) - an alternative player for watching and listening to media from youtube.

## Angular 2 Support
Updated to support Angular 2 - **Final - 2.0.0**

## Installation
```
npm install ng2-youtube-player --save-dev
```

## Supported API
Currently supported attributes:

### Inputs
* **height** (number) - optional height for the player
* **width** (number) - optional width for the player
* **videoId** (string) - will load the specified video by id

### outputs
* **ready** (YT.Player) - implements youtube's player onReady event -> sends a the new created yt player instance  
* **change** - a state change event channeling the youtube's player instance state event object

## DEMO
[A Live Demo In Plnkr](http://plnkr.co/edit/JtTJnQY2G8IE3IV6tFkx?p=preview)

## Usage
First, import the YoutubePlayerModule to your module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app';

@NgModule({
  imports:[ BrowserModule, YoutubePlayerModule ],
  declarations: [ AppComponent, ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
```

Next, use the **youtube-player** component. A Unique Id will be created for this player's instance:

```typescript
import { Component } from '@angular/core';

@Component({
	selector: 'app',
	template: `
		<youtube-player
      [videoId]="id"
      (ready)="savePlayer($event)"
      (change)="onStateChange($event)"
    ></youtube-player>
	`
})
export class AppComponent {
  player: YT.Player;
  private id: string = 'qDuKsiwS5xw';

	savePlayer (player) {
    this.player = player;
    console.log('player instance', player)
	}
  onStateChange(event){
    console.log('player state', event.data);
  }
}
```

## Testing
To start developing tdd/bdd style: ```npm run dev```
This will: compile ts files, watch for changes and start the test task. Whenever a ts file is changed, it will rerun the tests.

Travis-ci is integrated

# Showcase Examples
* [Echoes Player Ng2 Version](http://orizens.github.io/echoes-ng2) ([github repo for echoes player](http://github.com/orizens/echoes-ng2))
