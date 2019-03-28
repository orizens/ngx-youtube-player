import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubePlayerComponent } from './ngx-youtube-player.component';

describe('NgxYoutubePlayerComponent', () => {
  let component: YoutubePlayerComponent;
  let fixture: ComponentFixture<YoutubePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubePlayerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });
});
