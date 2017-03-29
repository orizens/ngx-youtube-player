System.registerDynamic('src/youtube-player.component', ['@angular/core', './youtube-player.service'], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
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
        YoutubePlayer.decorators = [{ type: core_1.Component, args: [{
                selector: 'youtube-player',
                template: "\n\t\t<div id=\"yt-player-ng2-component\" #ytPlayerContainer></div>\n\t",
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            }] }];
        /** @nocollapse */
        YoutubePlayer.ctorParameters = function () {
            return [{ type: youtube_player_service_1.YoutubePlayerService }, { type: core_1.ElementRef }];
        };
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
});
System.registerDynamic('src/youtube-player.service', ['@angular/core', 'rxjs/ReplaySubject'], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    var core_1 = $__require('@angular/core');
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
        Object.defineProperty(YoutubePlayerService, "win", {
            get: function () {
                return window;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(YoutubePlayerService, "YT", {
            get: function () {
                return YoutubePlayerService.win['YT'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(YoutubePlayerService, "Player", {
            get: function () {
                return YoutubePlayerService.YT.Player;
            },
            enumerable: true,
            configurable: true
        });
        YoutubePlayerService.prototype.createApi = function () {
            var _this = this;
            this.api = new ReplaySubject_1.ReplaySubject(1);
            var onYouTubeIframeAPIReady = function () {
                YoutubePlayerService.win && _this.api.next(YoutubePlayerService.YT);
            };
            YoutubePlayerService.win['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
        };
        YoutubePlayerService.prototype.loadPlayerApi = function () {
            var doc = YoutubePlayerService.win.document;
            var playerApiScript = doc.createElement("script");
            playerApiScript.type = "text/javascript";
            playerApiScript.src = "http://www.youtube.com/iframe_api";
            doc.body.appendChild(playerApiScript);
        };
        YoutubePlayerService.prototype.setupPlayer = function (elementId, outputs, sizes, videoId) {
            var _this = this;
            var createPlayer = function () {
                if (YoutubePlayerService.Player) {
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
            return new YoutubePlayerService.Player(elementId, Object.assign({}, playerSize, {
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
            // TODO: DEPRECATE?
            function onPlayerStateChange(event) {
                var state = event.data;
                var PlayerState = YoutubePlayerService.YT.PlayerState;
                // play the next song if its not the end of the playlist
                // should add a "repeat" feature
                if (state === PlayerState.ENDED) {}
                if (state === PlayerState.PAUSED) {}
                if (state === PlayerState.PLAYING) {}
            }
        };
        YoutubePlayerService.prototype.toggleFullScreen = function (player, isFullScreen) {
            var _a = this.defaultSizes,
                height = _a.height,
                width = _a.width;
            if (!isFullScreen) {
                height = window.innerHeight;
                width = window.innerWidth;
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
        YoutubePlayerService.ctorParameters = function () {
            return [{ type: core_1.NgZone }];
        };
        return YoutubePlayerService;
    }();
    exports.YoutubePlayerService = YoutubePlayerService;
});
System.registerDynamic('src/index', ['@angular/core', '@angular/common', './youtube-player.component', './youtube-player.service'], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
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
        YoutubePlayerModule.ctorParameters = function () {
            return [];
        };
        return YoutubePlayerModule;
    }();
    exports.YoutubePlayerModule = YoutubePlayerModule;
});
System.registerDynamic('ng2-youtube-player', ['./src/youtube-player.component', './src/youtube-player.service', './src/index'], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
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
});