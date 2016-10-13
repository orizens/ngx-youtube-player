import {
  async,
  inject
} from '@angular/core/testing';

import { YoutubePlayerService } from './youtube-player.service';
import { ReplaySubject } from 'rxjs/ReplaySubject'

const zone = jasmine.createSpyObj('zone', ['run']);

describe('YoutubePlayerService', () => {

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
})
