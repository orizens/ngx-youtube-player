
[![npm version](https://badge.fury.io/js/ngx-youtube-player.svg)](https://badge.fury.io/js/ngx-youtube-player)
[![npm downloads a month](https://img.shields.io/npm/dm/ngx-youtube-player.svg)](https://img.shields.io/npm/dm/ngx-youtube-player.svg)
[![npm downloads a week](https://img.shields.io/npm/dt/ngx-youtube-player.svg)](https://img.shields.io/npm/dt/ngx-youtube-player.svg)

# Install

`npm i ngx-youtube-player`

# Angular Youtube Player Component (Standalone)

This is an Angular component based on [youtube player iframe api](https://developers.google.com/youtube/iframe_api_reference).
This component came out as a result of the [open source project Echoes Player](http://github.com/orizens/echoes-player) - an alternative player for watching and listening to media from youtube.

## Breaking Change with v17

| Before < v17           | After >= v17.1.0                        |
| --------------------- | ---------------------------------- |
| `YoutubePlayerModule.forRoot()` | as standalone version           |

## Angular Support

**Starting with version 17.1.0**, `YoutubePlayerComponent` is a standalone component

## LICENSE

Angular Youtube Component includes 2 optional licenses:

1. **Free** - for open source projects - includes standard play features, released under **MIT** license.
2. **Commercial (Enterprize)** - **you must purchase a license**, includes the following features:

- License types:
  - app developer (\$200) - a license for each developer working with this component for one product only
  - platform developer (\$550) - a license for each developer developer working with component for all products in one company

To purchase a license, please contact at <https://orizens.com/contact>

## Installation

`npm install ngx-youtube-player`

## Supported API

Currently supported attributes:

### Inputs

- **height** (number) - optional height for the player
- **width** (number) - optional width for the player
- **videoId** (string) - will load the specified video by id

### outputs

- **ready** (YT.Player) - implements youtube's player onReady event -> sends a the new created yt player instance
- **change** - a state change event channeling the youtube's player instance state event object

## DEMO

[A Live Demo In StackBlitz](https://stackblitz.com/edit/ngx-youtube-player?file=src%2Fapp%2Fapp.module.ts)

## Usage

First, import the YoutubePlayerModule to your module:

```typescript
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppComponent } from "./app";

bootstrapApplication(AppComponent);
```

Next, use the **youtube-player** component. A Unique Id will be created for this player's instance:

```typescript
import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "app",
  template: `
    <youtube-player
      [videoId]="id"
      (ready)="savePlayer($event)"
      (change)="onStateChange($event)"
    ></youtube-player>
  `,
  imports: [YoutubePlayerComponent]
})
export class AppComponent {
  player: YT.Player;
  private id: string = "qDuKsiwS5xw";

  savePlayer(player) {
    this.player = player;
    console.log("player instance", player);
  }
  onStateChange(event) {
    console.log("player state", event.data);
  }
}
```

## Testing (DISABLED)

To start developing tdd/bdd style: `npm run dev`
This will: compile ts files, watch for changes and start the test task. Whenever a ts file is changed, it will rerun the tests.

# Showcase Examples

- [Echoes Player](http://orizens.github.io/echoes-player) ([github repo for echoes player](http://github.com/orizens/echoes-player))
