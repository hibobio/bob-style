import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { LightboxService } from './lightbox.service';
import { LightboxConfig, LightboxData } from './lightbox.interface';
import {
  ComponentFactoryResolver,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  ComponentRef
} from '@angular/core';
import { LightboxComponent } from './lightbox.component';
import { MockComponent } from 'ng-mocks';
import {
  Overlay,
  OverlayContainer,
  OverlayModule,
  OverlayRef
} from '@angular/cdk/overlay';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { TypographyModule } from '../../typography/typography.module';
import { LightboxModule } from './lightbox.module';
import { IconSize } from '../../icons/icons.enum';
import { IconComponent } from '../../icons/icon.component';
import { IconService } from '../../icons/icon.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';

// describe('LightboxService', () => {
//   let overlayRef: OverlayRef;
//   let lightboxComponentRef: ComponentRef<LightboxComponent>;
//   let config: LightboxConfig;
//   let lightbox: LightboxData;
//   let lightboxService: LightboxService;
//   let overlayElement: HTMLElement;

//   const testConfigImage = {
//     image:
//       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
//   };
//   const testConfigVideo = {
//     video: 'youtube.com/imagination/123'
//   };
//   const testConfigComponent = {
//     component: {
//       component: AvatarComponent,
//       attributes: {
//         title: 'John Malkovich',
//         subtitle: 'American actor',
//         orientation: 'vertical',
//         imageSource:
//           'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
//         size: AvatarSize.large
//       }
//     },
//     fillScreen: this.fillScreen
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [LightboxModule, OverlayModule, ButtonsModule, AvatarModule],
//       declarations: [LightboxComponent],
//       providers: [LightboxService],
//       schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
//     });

//     inject(
//       [OverlayContainer, ComponentFactoryResolver, Overlay],
//       (oc: OverlayContainer) => {
//         overlayElement = oc.getContainerElement();
//       }
//     )();

//     lightboxService = TestBed.get(LightboxService);
//   }));

//   describe('Lightbox Service', () => {
//     it('should open Lightbox with image', fakeAsync(() => {
//       lightbox = lightboxService.showLightbox(testConfigImage);

//       TestBed.dete;
//     }));
//   });
// });
