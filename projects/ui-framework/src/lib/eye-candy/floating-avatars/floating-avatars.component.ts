import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { AvatarLocation, CanvasDimension } from './floating-avatars.interface';
import {
  AVATAR_LOCATIONS_DEF_DESK,
  AVATAR_LOCATIONS_DEF_MOB,
} from './floating-avatars.const';
import { MobileService } from '../../services/utils/mobile.service';
import {
  notFirstChanges,
  isNotEmptyArray,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { AvatarParticle } from './avatar.particle';
import { MutationObservableService } from '../../services/utils/mutation-observable';

@Component({
  selector: 'b-floating-avatars',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['./floating-avatars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingAvatarsComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private hostRef: ElementRef,
    private zone: NgZone,
    private mutationObservableService: MutationObservableService,
    private mobileService: MobileService
  ) {
    this.isMobile = this.mobileService.isMobile();
  }

  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  @Input() avatarImages: string[] = [];
  @Input() centerAvatarImage: string = null;
  @Input() centerAvatarSize = 180;
  @Input() animationSpeed = 2.5;
  @Input() animateLines = false;
  @Input() animateShadows = false;
  @Input() animateOnDesktop = true;
  @Input() animateOnMobile = false;
  @Input()
  avatarsLocationsDesktop: AvatarLocation[] = AVATAR_LOCATIONS_DEF_DESK;
  @Input()
  avatarLocationsMobile: AvatarLocation[] = AVATAR_LOCATIONS_DEF_MOB;

  private canvasEl: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private loopReq;
  private canvasDimension: CanvasDimension = {
    width: 0,
    height: 0,
  };
  private particles: AvatarParticle[] = [];
  private readonly subs: Subscription[] = [];

  private isMobile = false;

  ngOnInit(): void {
    this.build();

    this.subs.push(
      this.mutationObservableService
        .getResizeObservervable(this.hostRef.nativeElement, {
          watch: 'width',
          threshold: 20,
        })
        .pipe(outsideZone(this.zone))
        .subscribe(() => {
          this.stopLoop();
          this.isMobile = this.mobileService.isMobile();
          this.build();
        }),

      this.mutationObservableService
        .getElementInViewEvent(this.hostRef.nativeElement, {})
        .pipe(outsideZone(this.zone))
        .subscribe((isInView) => {
          if (isInView) {
            this.startLoop();
          } else {
            this.stopLoop();
          }
        })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes)) {
      this.stopLoop();
      this.build();
    }
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
    this.stopLoop();
  }

  private build() {
    this.particles = [];
    this.canvasEl = this.canvas.nativeElement;
    this.context = this.canvasEl.getContext('2d');

    this.scaleCanvas();
    this.setScene();
    this.startLoop();
  }

  private scaleCanvas(): void {
    this.canvasDimension = {
      width: this.hostRef.nativeElement.clientWidth,
      height: this.hostRef.nativeElement.clientHeight,
    };
    this.canvasEl.width = this.canvasDimension.width;
    this.canvasEl.height = this.canvasDimension.height;
  }

  private setScene(): void {
    this.context.clearRect(
      0,
      0,
      this.canvasDimension.width,
      this.canvasDimension.height
    );

    if (!this.animationEnabled()) {
      this.createStaticDisplayParts(
        this.isMobile
          ? this.avatarLocationsMobile
          : this.avatarsLocationsDesktop
      );
    } else {
      this.createAnimatedDisplayParts();
    }
    if (this.centerAvatarImage && this.centerAvatarSize) {
      const particle: AvatarParticle = this.createCenterAvatar(
        this.centerAvatarImage
      );
      this.particles.push(particle);
    }
  }

  private startLoop(): void {
    if (
      this.animationEnabled() &&
      !this.loopReq &&
      isNotEmptyArray(this.particles)
    ) {
      this.zone.runOutsideAngular(() => {
        this.loop();
      });
    }
  }

  private stopLoop(): void {
    if (this.loopReq) {
      window.cancelAnimationFrame(this.loopReq);
      this.loopReq = null;
    }
  }

  private loop(): void {
    this.context.clearRect(
      0,
      0,
      this.canvasDimension.width,
      this.canvasDimension.height
    );
    this.particles.forEach((particle, index) => {
      particle.move(this.canvasDimension, index);
      particle.draw();
    });
    this.loopReq = requestAnimationFrame(this.loop.bind(this));
  }

  private createStaticDisplayParts(
    staticAvatarsLocation: AvatarLocation[]
  ): void {
    for (let i = 0; i < staticAvatarsLocation.length; i++) {
      const ballData = staticAvatarsLocation[i];
      const particle = new AvatarParticle(
        ballData.avatarSize,
        this.avatarImages[i],
        this.animateLines,
        true,
        this.particles,
        this.context
      );
      particle.x = ballData.x * this.canvasDimension.width;
      particle.y = ballData.y * this.canvasDimension.height;
      this.particles.push(particle);
    }
  }

  private createAnimatedDisplayParts(): void {
    for (let i = 0; i < this.avatarImages.length; i++) {
      const particle = new AvatarParticle(
        Math.round(Math.random() * 30 + 20),
        this.avatarImages[i],
        this.animateLines,
        this.animateShadows,
        this.particles,
        this.context
      );
      particle.x = Math.random() * this.canvasDimension.width;
      particle.y = Math.random() * this.canvasDimension.height;
      particle.vx =
        Math.random() * this.animationSpeed - this.animationSpeed / 3;
      particle.vy =
        Math.random() * this.animationSpeed - this.animationSpeed / 3;

      this.particles.push(particle);
    }
  }

  private createCenterAvatar(centerAvatarImage: string): AvatarParticle {
    const particle: AvatarParticle = new AvatarParticle(
      this.centerAvatarSize / 2,
      centerAvatarImage,
      this.animateLines,
      !this.animationEnabled() ? true : this.animateShadows,
      this.particles,
      this.context
    );
    particle.x = this.canvasDimension.width / 2;
    particle.y = this.canvasDimension.height / 2;
    particle.vx = 1;
    particle.vy = 1;
    particle.isCenter = true;

    return particle;
  }

  private animationEnabled(): boolean {
    return (
      (!this.isMobile && this.animateOnDesktop) ||
      (this.isMobile && this.animateOnMobile)
    );
  }
}
