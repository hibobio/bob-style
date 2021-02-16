import {
  fakeAsync,
  flush,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
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
import {
  emptyImg,
  emptyImgTestString,
} from '../../services/utils/test-helpers';
import {
  DOMhelpersProvideMock,
  MockCompsModule,
  WindowRefProvideMock,
} from '../../tests/services.stub.spec';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { MockComponent } from 'ng-mocks';
import { IconComponent } from '../../icons/icon.component';
import { ComponentRendererService } from '../../services/component-renderer/component-renderer.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

const detectChanges = (lightbox: LightboxData) => {
  lightbox.lightboxComponentRef.changeDetectorRef.detectChanges();
};

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          LightboxModule,
          OverlayModule,
          ButtonsModule,
          MockCompsModule,
        ],
        declarations: [
          AvatarComponent,
          AvatarImageComponent,
          MockComponent(IconComponent),
        ],
        providers: [
          LightboxService,
          ComponentRendererService,
          DOMhelpersProvideMock(),
          WindowRefProvideMock(),
        ],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      }).overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarComponent, AvatarImageComponent],
        },
      });

      inject(
        [OverlayContainer, ComponentFactoryResolver, Overlay],
        (oc: OverlayContainer) => {
          overlayElement = oc.getContainerElement();
        }
      )();

      lightboxService = TestBed.inject(LightboxService);
    })
  );

  describe('Lightbox Service', () => {
    it('should open Lightbox with image', () => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      detectChanges(lightbox);

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
      detectChanges(lightbox);

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

    it('should open Lightbox with Avatar component', fakeAsync(() => {
      lightbox = lightboxService.showLightbox(testConfigComponent);
      detectChanges(lightbox);

      flush();

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
    }));

    it('should add the right classnames and respect fillScreen property', () => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      detectChanges(lightbox);
      const lightContainerEl = overlayElement.querySelector(
        'b-lightbox'
      ) as HTMLElement;
      expect(lightContainerEl.className).toContain('fill-cover');
      expect(lightContainerEl.className).toContain('type-image');
      lightboxService.closeLightbox();
    });

    it('should close Lightbox with Close button', fakeAsync(() => {
      lightbox = lightboxService.showLightbox(testConfigImage);
      detectChanges(lightbox);

      const closeButEl = overlayElement.querySelector(
        '.close-button button'
      ) as HTMLElement;
      let lightContainerEl = overlayElement.querySelector(
        '.lightbox-container'
      ) as HTMLElement;

      expect(lightContainerEl).toBeTruthy();

      closeButEl.click();
      flush();

      lightContainerEl = overlayElement.querySelector(
        '.lightbox-container'
      ) as HTMLElement;

      expect(lightContainerEl).toBeFalsy();
      expect(lightbox.lightboxComponentRef).toBeFalsy();
      expect(lightbox.overlayRef).toBeFalsy();
    }));

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
});
