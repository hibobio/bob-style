import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LightboxModule } from '../lightbox.module';
import { MediaEmbedComponent } from './media-embed.component';
import {
  simpleChange,
  emptyImg,
  emptyImgTestString,
} from '../../../services/utils/test-helpers';
import { MediaType } from './media-embed.enum';
import { OverlayModule } from '@angular/cdk/overlay';

describe('MediaEmbedComponent', () => {
  let component: MediaEmbedComponent;
  let fixture: ComponentFixture<MediaEmbedComponent>;
  let compElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LightboxModule, OverlayModule],
      declarations: [],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MediaEmbedComponent);
        component = fixture.componentInstance;
        compElement = fixture.debugElement.nativeElement;
      });
  }));

  describe('MediaEmbedComponent - Video', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          url: 'https://www.youtube.com/watch?v=BvQ571eAOZE',
        })
      );
      fixture.detectChanges();
    });

    it('should set mediaType prop to "video"', () => {
      expect(component.mediaType).toEqual(MediaType.video);
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

  describe('MediaEmbedComponent - Image', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          url: emptyImg,
        })
      );
      fixture.detectChanges();
    });

    it('should set mediaType prop to "image"', () => {
      expect(component.mediaType).toEqual(MediaType.image);
    });

    it('should set thumbnail image', () => {
      expect(compElement.style.backgroundImage).toContain(emptyImgTestString);
    });

    it('should open lightbox on click', () => {
      expect(component.lightbox).toBeFalsy();
      compElement.click();
      fixture.detectChanges();
      expect(component.lightbox.overlayRef).toBeTruthy();
      expect(component.lightbox.lightboxComponentRef).toBeTruthy();
      expect(component.lightbox.config.image).toContain(emptyImgTestString);
    });
  });
});
