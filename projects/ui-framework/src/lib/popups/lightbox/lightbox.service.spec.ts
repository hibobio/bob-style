import { async, inject, TestBed, tick } from '@angular/core/testing';
import { LightboxService } from './lightbox.service';
import { LightboxData } from './lightbox.interface';
import {
  ComponentFactoryResolver,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ButtonsModule } from '../../buttons/buttons.module';
import { LightboxModule } from './lightbox.module';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import {
  emptyImg,
  emptyImgTestString,
} from '../../services/utils/test-helpers';

describe('LightboxService', () => {
  let lightbox: LightboxData;
  let lightboxService: LightboxService;
  let overlayElement: HTMLElement;

  const testConfigImage = {
    image: emptyImg,
    fillScreen: true,
  };
  const testConfigVideo = {
    video: 'youtube.com/imagination/123',
  };
  const testConfigComponent = {
    component: {
      component: AvatarComponent,
      attributes: {
        title: 'John Malkovich',
        subtitle: 'American actor',
        orientation: 'vertical',
        imageSource: emptyImg,
        size: AvatarSize.large,
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LightboxModule, OverlayModule, ButtonsModule, AvatarModule],
      declarations: [],
      providers: [LightboxService],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });

    inject(
      [OverlayContainer, ComponentFactoryResolver, Overlay],
      (oc: OverlayContainer) => {
        overlayElement = oc.getContainerElement();
      }
    )();

    lightboxService = TestBed.inject(LightboxService);
  }));

  describe('Lightbox Service', () => {
    it('should open Lightbox with image', () => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();

      const lightContainerEl = overlayElement.querySelector(
        '.lightbox-container'
      ) as HTMLElement;
      const imageEl = overlayElement.querySelector(
        '.lightbox-image'
      ) as HTMLElement;

      expect(lightContainerEl.children.length).toEqual(1);
      expect(imageEl).toBeTruthy();
      expect(imageEl.getAttribute('src')).toContain(emptyImgTestString);
      lightboxService.closeLightbox();
    });

    it('should open Lightbox with video', () => {
      lightbox = lightboxService.showLightbox(testConfigVideo);
      lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();

      const lightContainerEl = overlayElement.querySelector(
        '.lightbox-container'
      ) as HTMLElement;
      const videoEl = overlayElement.querySelector(
        '.lightbox-video'
      ) as HTMLElement;

      expect(lightContainerEl.children.length).toEqual(1);
      expect(videoEl).toBeTruthy();
      expect(videoEl.getAttribute('src')).toEqual(
        'https://youtube.com/imagination/123'
      );
      lightboxService.closeLightbox();
    });

    it('should open Lightbox with Avatar component', () => {
      lightbox = lightboxService.showLightbox(testConfigComponent);
      lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();

      const lightContainerEl = overlayElement.querySelector(
        '.lightbox-container'
      ) as HTMLElement;

      const avatarEl = overlayElement.querySelector(
        '.lightbox-component b-avatar'
      ) as HTMLElement;
      const avatarElImg = overlayElement.querySelector(
        '.lightbox-component b-avatar .avatar'
      ) as HTMLElement;
      const avatarElTitle = overlayElement.querySelector(
        '.lightbox-component b-avatar .title'
      ) as HTMLElement;

      expect(lightContainerEl.children.length).toEqual(1);
      expect(avatarEl).toBeTruthy();
      expect(avatarElImg.getAttribute('style')).toContain(emptyImgTestString);
      expect(avatarElTitle.textContent).toContain('John Malkovich');
      lightboxService.closeLightbox();
    });

    it('should add the right classnames and respect fillScreen property', () => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();
      const lightContainerEl = overlayElement.querySelector(
        'b-lightbox'
      ) as HTMLElement;
      expect(lightContainerEl.className).toEqual('type-image fill-cover');
      lightboxService.closeLightbox();
    });

    it('should close Lightbox with Close button', () => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();

      const closeButEl = overlayElement.querySelector(
        '.close-button'
      ) as HTMLElement;

      closeButEl.click();

      const lightContainerEl = overlayElement.querySelector(
        '.lightbox-container'
      ) as HTMLElement;

      expect(lightContainerEl).toBeFalsy();
      expect(lightbox.lightboxComponentRef).toBeNull();
      expect(lightbox.overlayRef).toBeNull();
    });

    it('should not accept random links for video link', () => {
      const bad = 'good';
      try {
        lightboxService.showLightbox({
          video: 'http://pornhub.com',
        });
        expect(bad).toEqual('bad');
      } catch (e) {
        expect(e).toBeTruthy();
      }
      lightboxService.closeLightbox();
    });

    it('should not accept random links for image link', () => {
      const bad = 'good';
      try {
        lightboxService.showLightbox({
          image: 'http://pornhub.com',
        });
        expect(bad).toEqual('bad');
      } catch (e) {
        expect(e).toBeTruthy();
      }
      lightboxService.closeLightbox();
    });
  });

  describe('LightboxComponent windowKeydownSubscriber', () => {
    it('should unsubscribe windowKeydownSubscriber', () => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();
      expect(
        lightbox.lightboxComponentRef.instance['windowKeydownSubscriber'].closed
      ).toBe(false);
      lightbox.lightboxComponentRef.instance.ngOnDestroy();
      expect(
        lightbox.lightboxComponentRef.instance['windowKeydownSubscriber'].closed
      ).toBe(true);
      lightboxService.closeLightbox();
    });
  });
});
