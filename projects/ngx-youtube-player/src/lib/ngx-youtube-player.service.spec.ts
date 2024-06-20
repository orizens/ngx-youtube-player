// import { TestBed } from '@angular/core/testing';

// import { NgxYoutubePlayerService } from './ngx-youtube-player.service';

// describe('NgxYoutubePlayerService', () => {
//   beforeEach(() => TestBed.configureTestingModule({}));

//   it('should be created', () => {
//     const service: NgxYoutubePlayerService = TestBed.get(NgxYoutubePlayerService);
//     expect(service).toBeTruthy();
//   });
// });
import {
  YoutubePlayerService,
  defaultSizes,
  win,
  YouTubePlayerRef
} from './ngx-youtube-player.service';
import { ReplaySubject } from 'rxjs';

const zone = jasmine.createSpyObj('zone', ['run']);

describe('YoutubePlayerService', () => {
  global['YT'] = {
    Player: jasmine
      .createSpy('YTPlayer')
      .and.callFake((id: string, params: any) => params),
    PlayerState: 1
  } as any;

  it('should create an instance of YoutubePlayerService', () => {
    const service = new YoutubePlayerService(zone);
    const actual = service;
    const expected = jasmine.any(YoutubePlayerService);
    expect(actual).toEqual(expected);
  });

  it('should create an api subject', () => {
    const service = new YoutubePlayerService(zone);
    const actual = service.api;
    const expected = jasmine.any(ReplaySubject);
    expect(actual).toEqual(expected);
  });

  it('should emit the YT player when youtube iframe api is ready', () => {
    const service = new YoutubePlayerService(zone);
    const actual = service.api;
    spyOn(service.api, 'next');
    win()['onYouTubeIframeAPIReady']();
    expect(service.api.next).toHaveBeenCalledWith(global['YT'] as any);
  });

  it('should generate a unique id', () => {
    const service = new YoutubePlayerService(zone);
    const actual = service.generateUniqueId();
    expect(actual).toBeDefined();
    expect(actual.length).toBeGreaterThan(1);
  });

  describe('YT Player Creation', () => {
    let params, service, actual;

    beforeEach(() => {
      params = {
        id: 'testing-id',
        outputs: {},
        playerVars: {},
        sizes: {
          height: 1000,
          width: 2000
        },
        videoId: ''
      };
      service = new YoutubePlayerService(zone);
      actual = service.createPlayer(
        params.id,
        params.outputs,
        params.sizes,
        params.videoId,
        params.playerVars
      );
    });

    it('should create a player using YT Api', () => {
      const expected = actual;
      expect(YouTubePlayerRef()).toHaveBeenCalledWith(params.id, expected);
    });

    it('should create a player with given sizes', () => {
      const expected = params.sizes;
      expect(actual.height).toBeDefined(expected.height);
      expect(actual.width).toBeDefined(expected.width);
    });

    it('should create a player with default sizes', () => {
      const expected = defaultSizes;
      expect(actual.height).toBeDefined(expected.height);
      expect(actual.width).toBeDefined(expected.width);
    });
  });

  describe('YT Player functionality exposure', () => {
    let player;

    beforeEach(() => {
      player = jasmine.createSpyObj('ytplayer', [
        'playVideo',
        'pauseVideo',
        'loadVideoById',
        'getPlayerState',
        'setSize'
      ]);
    });
    it('should play the video', () => {
      const service = new YoutubePlayerService(zone);
      service.play(player);
      expect(player.playVideo).toHaveBeenCalledTimes(1);
    });
    it('should pause the video', () => {
      const service = new YoutubePlayerService(zone);
      service.pause(player);
      expect(player.pauseVideo).toHaveBeenCalledTimes(1);
    });
    it('should tell a video is playing', () => {
      const service = new YoutubePlayerService(zone);
      const media = { id: 'testing' };
      service.playVideo(media, player);
      expect(player.loadVideoById).toHaveBeenCalledTimes(1);
      expect(player.playVideo).toHaveBeenCalledTimes(1);
    });
    it('should tell a video is playing using the player state', () => {
      const service = new YoutubePlayerService(zone);
      const media = { id: 'testing' };
      service.isPlaying(player);
      expect(player.getPlayerState).toHaveBeenCalledTimes(1);
    });
    it('should tell a video is NOT playing', () => {
      const service = new YoutubePlayerService(zone);
      const media = { id: 'testing' };
      const actual = service.isPlaying({} as YT.Player);
      const expected = false;
      expect(player.getPlayerState).not.toHaveBeenCalled();
      expect(actual).toBe(expected);
    });
    it('should setSize to defaults when in fullscreen', () => {
      const service = new YoutubePlayerService(zone);
      const actual = service.toggleFullScreen(player, true);
      expect(player.setSize).toHaveBeenCalledTimes(1);
    });
    it('should setSize to fullscreen when NOT in fullscreen', () => {
      const service = new YoutubePlayerService(zone);
      global['innerHeight'] = 1000;
      global['innerWidth'] = 2000;
      const actual = service.toggleFullScreen(player, false);
      expect(player.setSize).toHaveBeenCalledWith(
        global['innerWidth'],
        global['innerHeight']
      );
    });
  });
});
