import {
  Component,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { URLutils } from '../../../services/url/url-utils.service';
import { VideoData } from '../../../services/url/url.interface';
import { LightboxData } from '../lightbox.interface';
import { LightboxService } from '../lightbox.service';

@Component({
  selector: 'b-video-embed',
  template: '',
  styleUrls: ['./video-embed.component.scss']
})
export class VideoEmbedComponent implements OnChanges, OnDestroy {
  constructor(
    private URL: URLutils,
    private lightboxService: LightboxService,
    private host: ElementRef
  ) {}

  @Input() url: string;
  public videoData: VideoData;
  public lightbox: LightboxData;

  @HostListener('click')
  onClick() {
    if (this.videoData) {
      this.lightbox = this.lightboxService.showLightbox({
        video: this.videoData.url
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.url = changes.url.currentValue;
      this.videoData = this.URL.parseVideoURL(this.url);

      if (this.videoData) {
        this.host.nativeElement.style.backgroundImage = `url(${
          this.videoData.thumb
        })`;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.lightbox && this.lightbox.lightboxComponentRef) {
      this.lightbox.lightboxComponentRef.destroy();
      this.lightbox.lightboxComponentRef = null;
    }
    if (this.lightbox && this.lightbox.overlayRef) {
      this.lightbox.overlayRef.dispose();
      this.lightbox.overlayRef = null;
    }
  }
}
