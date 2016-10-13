System.registerDynamic('src/youtube-player.component', ['@angular/core', './youtube-player.service'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var youtube_player_service_1 = $__require('./youtube-player.service');
    var YoutubePlayer = function () {
        function YoutubePlayer(playerService, elementRef) {
            this.playerService = playerService;
            this.elementRef = elementRef;
            this.videoId = '';
            // player created and initialized - sends instance of the player
            this.ready = new core_1.EventEmitter();
            // state change: send the YT event with its state
            this.change = new core_1.EventEmitter();
        }
        YoutubePlayer.prototype.ngAfterContentInit = function () {
            var htmlId = this.playerService.generateUniqueId();
            var playerSize = { height: this.height, width: this.width };
            this.ytPlayerContainer.nativeElement.setAttribute('id', htmlId);
            this.playerService.loadPlayerApi();
            this.playerService.setupPlayer(htmlId, {
                ready: this.ready,
                change: this.change
            }, playerSize, this.videoId);
        };
        YoutubePlayer.prototype.ngOnInit = function () {};
        YoutubePlayer.prototype.playVideo = function () {
            // this.playerService.play();
            // this.play.next(this.player.media);
        };
        YoutubePlayer.prototype.pauseVideo = function () {
            // this.playerService.pause();
        };
        YoutubePlayer.prototype.togglePlayer = function () {
            // this.playerService.togglePlayer();
        };
        YoutubePlayer.prototype.playNextTrack = function () {
            // this.playNext.next(this.player);
        };
        YoutubePlayer.decorators = [{ type: core_1.Component, args: [{
                selector: 'youtube-player',
                template: "\n\t\t<div id=\"yt-player-ng2-component\" #ytPlayerContainer></div>\n\t",
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            }] }];
        /** @nocollapse */
        YoutubePlayer.ctorParameters = [{ type: youtube_player_service_1.YoutubePlayerService }, { type: core_1.ElementRef }];
        YoutubePlayer.propDecorators = {
            'videoId': [{ type: core_1.Input }],
            'height': [{ type: core_1.Input }],
            'width': [{ type: core_1.Input }],
            'ready': [{ type: core_1.Output }],
            'change': [{ type: core_1.Output }],
            'ytPlayerContainer': [{ type: core_1.ViewChild, args: ['ytPlayerContainer'] }]
        };
        return YoutubePlayer;
    }();
    exports.YoutubePlayer = YoutubePlayer;
    return module.exports;
});
System.registerDynamic('src/youtube-player.service', ['@angular/core', '@angular/platform-browser/src/facade/browser', 'rxjs/ReplaySubject'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var browser_1 = $__require('@angular/platform-browser/src/facade/browser');
    var ReplaySubject_1 = $__require('rxjs/ReplaySubject');
    var YoutubePlayerService = function () {
        function YoutubePlayerService(zone) {
            this.zone = zone;
            this.isFullscreen = false;
            this.defaultSizes = {
                height: 270,
                width: 367
            };
            this.createApi();
        }
        YoutubePlayerService.prototype.createApi = function () {
            var _this = this;
            this.api = new ReplaySubject_1.ReplaySubject(1);
            var onYouTubeIframeAPIReady = function () {
                _this.api.next(browser_1.window.YT);
            };
            browser_1.window['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
        };
        YoutubePlayerService.prototype.loadPlayerApi = function () {
            var doc = browser_1.window.document;
            var playerApiScript = doc.createElement("script");
            playerApiScript.type = "text/javascript";
            playerApiScript.src = "http://www.youtube.com/iframe_api";
            doc.body.appendChild(playerApiScript);
        };
        YoutubePlayerService.prototype.setupPlayer = function (elementId, outputs, sizes, videoId) {
            var _this = this;
            var createPlayer = function () {
                if (browser_1.window.YT.Player) {
                    _this.createPlayer(elementId, outputs, sizes, videoId);
                }
            };
            this.api.subscribe(createPlayer);
        };
        YoutubePlayerService.prototype.play = function (player) {
            player.playVideo();
        };
        YoutubePlayerService.prototype.pause = function (player) {
            player.pauseVideo();
        };
        YoutubePlayerService.prototype.playVideo = function (media, player) {
            var id = media.id.videoId ? media.id.videoId : media.id;
            player.loadVideoById(id);
            this.play(player);
        };
        YoutubePlayerService.prototype.isPlaying = function (player) {
            // because YT is not loaded yet 1 is used - YT.PlayerState.PLAYING
            var isPlayerReady = player && player.getPlayerState;
            var playerState = isPlayerReady ? player.getPlayerState() : {};
            var isPlayerPlaying = isPlayerReady ? playerState !== YT.PlayerState.ENDED && playerState !== YT.PlayerState.PAUSED : false;
            return isPlayerPlaying;
        };
        YoutubePlayerService.prototype.createPlayer = function (elementId, outputs, sizes, videoId) {
            var _this = this;
            var service = this;
            var playerSize = {
                height: sizes.height || this.defaultSizes.height,
                width: sizes.width || this.defaultSizes.width
            };
            return new browser_1.window.YT.Player(elementId, Object.assign({}, playerSize, {
                videoId: videoId || '',
                // playerVars: playerVars,
                events: {
                    onReady: function (ev) {
                        _this.zone.run(function () {
                            return outputs.ready && outputs.ready.next(ev.target);
                        });
                    },
                    onStateChange: function (ev) {
                        _this.zone.run(function () {
                            return outputs.change && outputs.change.next(ev);
                        });
                        // this.zone.run(() => onPlayerStateChange(ev));
                    }
                }
            }));
            function onPlayerStateChange(event) {
                var state = event.data;
                // play the next song if its not the end of the playlist
                // should add a "repeat" feature
                if (state === YT.PlayerState.ENDED) {}
                if (state === YT.PlayerState.PAUSED) {}
                if (state === YT.PlayerState.PLAYING) {}
                // console.log('state changed', state);
                // dispatch STATE CHANGE
            }
        };
        YoutubePlayerService.prototype.toggleFullScreen = function (player, isFullScreen) {
            var _a = this.defaultSizes,
                height = _a.height,
                width = _a.width;
            if (!isFullScreen) {
                height = browser_1.window.innerHeight;
                width = browser_1.window.innerWidth;
            }
            player.setSize(width, height);
            // TODO: dispatch event
        };
        // adpoted from uid
        YoutubePlayerService.prototype.generateUniqueId = function () {
            var len = 7;
            return Math.random().toString(35).substr(2, len);
        };
        YoutubePlayerService.decorators = [{ type: core_1.Injectable }];
        /** @nocollapse */
        YoutubePlayerService.ctorParameters = [{ type: core_1.NgZone }];
        return YoutubePlayerService;
    }();
    exports.YoutubePlayerService = YoutubePlayerService;
    return module.exports;
});
System.registerDynamic('src/index', ['@angular/core', '@angular/common', './youtube-player.component', './youtube-player.service'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
    var common_1 = $__require('@angular/common');
    var youtube_player_component_1 = $__require('./youtube-player.component');
    var youtube_player_service_1 = $__require('./youtube-player.service');
    var YoutubePlayerModule = function () {
        function YoutubePlayerModule() {}
        YoutubePlayerModule.decorators = [{ type: core_1.NgModule, args: [{
                imports: [common_1.CommonModule],
                declarations: [youtube_player_component_1.YoutubePlayer],
                exports: [youtube_player_component_1.YoutubePlayer],
                providers: [youtube_player_service_1.YoutubePlayerService]
            }] }];
        /** @nocollapse */
        YoutubePlayerModule.ctorParameters = [];
        return YoutubePlayerModule;
    }();
    exports.YoutubePlayerModule = YoutubePlayerModule;
    return module.exports;
});
System.registerDynamic('ng2-youtube-player', ['./src/youtube-player.component', './src/youtube-player.service', './src/index'], true, function ($__require, exports, module) {
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    var youtube_player_component_1 = $__require('./src/youtube-player.component');
    var youtube_player_service_1 = $__require('./src/youtube-player.service');
    __export($__require('./src/youtube-player.component'));
    __export($__require('./src/youtube-player.service'));
    __export($__require('./src/index'));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        directives: [youtube_player_component_1.YoutubePlayer, youtube_player_service_1.YoutubePlayerService]
    };
    return module.exports;
});