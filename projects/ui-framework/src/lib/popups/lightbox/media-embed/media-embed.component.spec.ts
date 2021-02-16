import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LightboxModule } from '../lightbox.module';
import { MediaEmbedComponent } from './media-embed.component';
import { emptyImg } from '../../../services/utils/test-helpers';
import { MediaType } from './media-embed.enum';
import { OverlayModule } from '@angular/cdk/overlay';
import { URLutilsProvideMock } from '../../../tests/services.stub.spec';
import { take } from 'rxjs/operators';

describe('MediaEmbedComponent', () => {
  let component: MediaEmbedComponent;
  let fixture: ComponentFixture<MediaEmbedComponent>;
  let compElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [LightboxModule, OverlayModule],
        declarations: [],
        providers: [URLutilsProvideMock()],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(MediaEmbedComponent);
          component = fixture.componentInstance;
          compElement = fixture.debugElement.nativeElement;
        });
    })
  );

  describe('MediaEmbedComponent - Video', () => {
    beforeEach(() => {
      component.url$ = 'https://www.youtube.com/watch?v=BvQ571eAOZE' as any;
      fixture.detectChanges();
    });

    it('should set mediaType prop to "video"', (done) => {
      component.mediaData$.pipe(take(1)).subscribe((md) => {
        expect(md.mediaType).toEqual(MediaType.video);
        done();
      });
    });

    it('should parse url and get correct embed url', (done) => {
      component.mediaData$.pipe(take(1)).subscribe((md) => {
        expect(md.safeUrl['changingThisBreaksApplicationSecurity']).toContain(
          'BvQ571eAOZE'
        );
        done();
      });
    });

    it('should parse url and get thumbnail image', (done) => {
      component.mediaData$.pipe(take(1)).subscribe((md) => {
        expect(md.thumb).toContain('maxresdefault.jpg');
        expect(compElement.style.backgroundImage).toContain(
          'maxresdefault.jpg'
        );
        done();
      });
    });

    it('should open lightbox on click', () => {
      expect(component.lightbox).toBeFalsy();
      compElement.click();
      fixture.detectChanges();
      expect(component.lightbox.overlayRef).toBeTruthy();
      expect(component.lightbox.lightboxComponentRef).toBeTruthy();
      expect(
        component.lightbox.config.video['changingThisBreaksApplicationSecurity']
      ).toContain('BvQ571eAOZE');
    });
  });

  describe('MediaEmbedComponent - Image', () => {
    beforeEach(() => {
      component.url$ = emptyImg as any;
      fixture.detectChanges();
    });

    it('should set mediaType prop to "image"', (done) => {
      component.mediaData$.pipe(take(1)).subscribe((md) => {
        expect(md.mediaType).toEqual(MediaType.image);
        done();
      });
    });

    it('should set thumbnail image', () => {
      expect(compElement.style.backgroundImage).toContain(emptyImg.slice(-20));
    });

    it('should open lightbox on click', () => {
      expect(component.lightbox).toBeFalsy();
      compElement.click();
      fixture.detectChanges();
      expect(component.lightbox.overlayRef).toBeTruthy();
      expect(component.lightbox.lightboxComponentRef).toBeTruthy();
      expect(
        component.lightbox.config.image['changingThisBreaksApplicationSecurity']
      ).toContain(emptyImg.slice(-20));
    });
  });
});
