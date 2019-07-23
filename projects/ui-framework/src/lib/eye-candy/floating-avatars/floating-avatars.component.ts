import {
  ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { Subscription } from 'rxjs';
import { outsideZone } from '../../services/utils/rxjs.operators';

const MIN_DIST = 250;
const SPRING_AMOUNT = 0.0001;
const SHADOW_BLEED = 10;

@Component({
  selector: 'b-floating-avatars',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['./floating-avatars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingAvatarsComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  @Input() centerAvatarImage: string = null;
  @Input() avatarImages: string[] = [];
  @Input() speed = 4;

  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private loopReq;
  private canvasDimension = {
    width: 0,
    height: 0,
  };
  private particles: Ball[] = [];
  private resizeSubscribe: Subscription;

  constructor(
    private hostRef: ElementRef,
    private zone: NgZone,
    private utils: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.canvasEl = this.canvas.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.scaleCanvas();
    this.setScene();
    this.loop();
    this.resizeSubscribe = this.utils.getResizeEvent()
      .pipe(outsideZone(this.zone))
      .subscribe(() => {
        this.scaleCanvas();
        this.particles = [];
        this.setScene();
      });
  }

  ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();
    window.cancelAnimationFrame(this.loopReq);
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
    for (let particle, i = 0; i < this.avatarImages.length; i++) {
      particle = new Ball(Math.round(Math.random() * 30 + 20), this.avatarImages[i]);
      particle.x = Math.random() * this.canvasDimension.width;
      particle.y = Math.random() * this.canvasDimension.height;
      particle.vx = Math.random() * this.speed - this.speed / 2;
      particle.vy = Math.random() * this.speed - this.speed / 2;
      this.particles.push(particle);
    }
    if (this.centerAvatarImage) {
      let particle: Ball;
      particle = new Ball(90, this.centerAvatarImage);
      particle.x = this.canvasDimension.width / 2;
      particle.y = this.canvasDimension.height / 2;
      particle.vx = 1;
      particle.vy = 1;
      particle.isCenter = true;
      this.particles.push(particle);
    }
  }

  private loop(): void {
    this.zone.runOutsideAngular(() => {
      this.ctx.clearRect(0, 0, this.canvasDimension.width, this.canvasDimension.height);
      this.particles.forEach((particle, index) => {
        this.move(particle, index);
        particle.draw(this.ctx);
      });
      this.loopReq = requestAnimationFrame(this.loop.bind(this));
    });
  }

  private move(ball1: Ball, index: number): void {
    if (!ball1.isCenter) {
      ball1.x += ball1.vx;
      ball1.y += ball1.vy;
    }

    if (ball1.x > this.canvasDimension.width - ball1.radius - SHADOW_BLEED) {
      ball1.x = this.canvasDimension.width - ball1.radius - SHADOW_BLEED - 2;
      ball1.vx = -ball1.vx;
    } else if (ball1.x < ball1.radius + SHADOW_BLEED) {
      ball1.x = ball1.radius + SHADOW_BLEED + 2;
      ball1.vx = -ball1.vx;
    }

    if (ball1.y > this.canvasDimension.height - ball1.radius - SHADOW_BLEED) {
      ball1.y = this.canvasDimension.height - ball1.radius - SHADOW_BLEED - 2;
      ball1.vy = -ball1.vy;
    } else if (ball1.y < ball1.radius) {
      ball1.y = ball1.radius + 2;
      ball1.vy = -ball1.vy;
    }

    for (let ball2, j = index + 1; j <= this.avatarImages.length; j++) {
      ball2 = this.particles[j];
      this.spring(ball1, ball2);
    }
  }

  private spring(ball1: Ball, ball2: Ball): void {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MIN_DIST) {
      const alpha = 1 - dist / MIN_DIST;
      this.ctx.strokeStyle = `rgba(200,200,200, ${ alpha })`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(ball1.x, ball1.y);
      this.ctx.lineTo(ball2.x, ball2.y);
      this.ctx.closePath();
      this.ctx.stroke();

      const ax = dx * SPRING_AMOUNT;
      const ay = dy * SPRING_AMOUNT;
      ball1.vx += ax / 500;
      ball1.vy += ay / 500;
      ball2.vx -= ax / 500;
      ball2.vy -= ay / 500;
    }
  }
}

export class Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  lineWidth: number;
  isCenter: boolean;
  img: HTMLImageElement;

  constructor(radius: number, imgUrl: string) {
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.img = new Image;
    this.img.src = imgUrl;
    this.lineWidth = Math.min(Math.floor(radius / 10), 4);
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    context.scale(this.scaleX, this.scaleY);

    context.fillStyle = 'rgba(248,247,247,1)';
    context.beginPath();
    context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
    context.closePath();
    context.fill();
    context.clip();

    context.drawImage(this.img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);

    context.restore();
    context.save();
    context.translate(this.x, this.y);
    context.scale(this.scaleX, this.scaleY);

    if (this.lineWidth > 0) {
      context.beginPath();
      context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
      context.closePath();
      context.lineWidth = this.lineWidth;
      context.strokeStyle = 'rgba(255,255,255,1)';
      context.stroke();
    }

    context.restore();
  }
}
