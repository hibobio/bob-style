import { Component, NgModule, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxService } from './lightbox.service';
import { ButtonsModule } from '../../buttons/buttons.module';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { LightboxConfig, LightboxData } from './lightbox.interface';

@Component({
  selector: 'b-lightbox-example',
  template: `
    <b-button (clicked)="showLightbox()">Show lightbox</b-button>
  `,
  providers: [],
})
export class LightboxExampleComponent implements OnDestroy {
  constructor(private lightboxService: LightboxService) {}

  @Input() imageLink: string;
  @Input() videoLink: string;
  @Input() showInLightbox: string;
  @Input() fillScreen = false;

  private lightbox: LightboxData;

  showLightbox(): void {
    const config: LightboxConfig =
      this.showInLightbox === 'image' && this.imageLink
        ? {
            image: this.imageLink,
            fillScreen: this.fillScreen,
          }
        : this.showInLightbox === 'video' && this.videoLink
        ? {
            video: this.videoLink,
            fillScreen: this.fillScreen,
          }
        : this.showInLightbox === 'component'
        ? {
            component: {
              component: AvatarComponent,
              attributes: {
                title: 'John Malkovich',
                subtitle: 'American actor',
                orientation: 'vertical',
                // tslint:disable-next-line: max-line-length
                imageSource: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/John_Malkovich_KVIFF_2.jpg/220px-John_Malkovich_KVIFF_2.jpg`,
                size: AvatarSize.large,
              },
            },
            fillScreen: this.fillScreen,
          }
        : null;

    this.lightbox = this.lightboxService.showLightbox(config);
    this.lightbox.closed$.subscribe(() => {
      console.log('Lightbox was closed!', this.lightbox);
    });
  }

  ngOnDestroy(): void {
    this.lightboxService.closeLightbox();
  }
}

@NgModule({
  declarations: [LightboxExampleComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    AvatarModule,
  ],
  exports: [LightboxExampleComponent],
  providers: [LightboxService],
  entryComponents: [AvatarComponent],
})
export class LightboxExampleModule {}
