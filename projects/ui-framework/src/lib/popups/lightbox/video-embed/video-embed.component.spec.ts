import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LightboxModule } from '../lightbox.module';
import { VideoEmbedComponent } from './video-embed.component';
import { simpleChange } from '../../../services/utils/test-helpers';

describe('VideoEmbedComponent', () => {
  let component: VideoEmbedComponent;
  let fixture: ComponentFixture<VideoEmbedComponent>;
  let compElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LightboxModule],
      declarations: [],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(VideoEmbedComponent);
        component = fixture.componentInstance;
        compElement = fixture.debugElement.nativeElement;
      });
  }));

  describe('VideoEmbedComponent', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          url: 'https://www.youtube.com/watch?v=BvQ571eAOZE'
        })
      );
      fixture.detectChanges();
    });

    it('should parse url and get correct embed url', () => {
      expect(component.videoData.url).toContain(
        'www.youtube.com/embed/BvQ571eAOZE'
      );
    });

    it('should parse url and get thumbnail image', () => {
      expect(component.videoData.thumb).toContain(
        'img.youtube.com/vi/BvQ571eAOZE/maxresdefault.jpg'
      );
      expect(compElement.style.backgroundImage).toContain(
        'img.youtube.com/vi/BvQ571eAOZE/maxresdefault.jpg'
      );
    });

    it('should open lightbox on click', () => {
      expect(component.lightbox).toBeFalsy();
      compElement.click();
      fixture.detectChanges();
      expect(component.lightbox.overlayRef).toBeTruthy();
      expect(component.lightbox.lightboxComponentRef).toBeTruthy();
      expect(
        (component.lightbox.config.video as any)
          .changingThisBreaksApplicationSecurity
      ).toContain('www.youtube.com/embed/BvQ571eAOZE');
    });
  });
});
