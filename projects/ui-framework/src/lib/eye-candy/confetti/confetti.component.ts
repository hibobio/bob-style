import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { remove as _remove, isEqual as _isEqual } from 'lodash';
import { Color } from '../../types';

const GRAVITY = 0.4;
const CONFETTI_WIDTH = 12;
const CONFETTI_HEIGHT = 15;

@Component({
  selector: 'b-confetti',
  template: '<canvas #confettiCanvas></canvas>',
  styleUrls: ['./confetti.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent implements OnInit, OnDestroy {
  constructor(private zone: NgZone) {}

  @ViewChild('confettiCanvas', { static: true }) canvas: ElementRef;

  @Output() complete: EventEmitter<any> = new EventEmitter<any>();
  @Input() colors: Color[];
  @Input() numberOfConfetti = 20;

  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private windowDim: { w: number; h: number };
  private CONFETTI = [];
  private CONFETTI_AREA = CONFETTI_WIDTH * CONFETTI_HEIGHT;
  private loopReq;

  ngOnInit(): void {
    this.windowDim = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
    this.canvasEl = this.canvas.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.canvasEl.width = this.windowDim.w;
    this.canvasEl.height = this.windowDim.h;
  }

  fireConfetti(pos: { x: number; y: number }[]) {
    pos.forEach((p) => {
      for (let i = 0; i < this.numberOfConfetti; i++) {
        this.CONFETTI.push(new Plane(p, this.colors));
      }
    });
    if (!this.loopReq) {
      this._render();
    }
  }

  private _getColor(w, h, color) {
    const percent = -0.5 * (1 - (w * h) / this.CONFETTI_AREA);
    // tslint:disable-next-line:max-line-length no-bitwise
    const f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      // tslint:disable-next-line:no-bitwise
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    // tslint:disable-next-line:max-line-length
    return (
      '#' +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  }

  private _render() {
    this.zone.runOutsideAngular(() => {
      this.ctx.clearRect(0, 0, this.windowDim.w, this.windowDim.h);

      this.CONFETTI.forEach((confetti) => {
        this.ctx.save();
        confetti.update(confetti);
        this.ctx.translate(confetti.x, confetti.y);
        this.ctx.rotate(confetti.rot);
        this.ctx.fillStyle = this._getColor(
          confetti.w,
          confetti.h,
          confetti.color
        );
        this.ctx.fillRect(
          -confetti.w * 0.5,
          -confetti.h * 0.5,
          confetti.w,
          confetti.h
        );
        this.ctx.restore();
        if (confetti.y - confetti.h > this.windowDim.h) {
          confetti.outOfBounds = true;
        }
      });
      _remove(this.CONFETTI, (confetti) => {
        return _isEqual(confetti.outOfBounds, true);
      });

      if (this.CONFETTI.length > 0) {
        this.loopReq = requestAnimationFrame(this._render.bind(this));
      } else {
        window.cancelAnimationFrame(this.loopReq);
        this.loopReq = null;
        this.complete.emit();
      }
    });
  }

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.loopReq);
  }
}

export class Plane {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  vx: number;
  rot: number;
  rotX: number;
  rotY: number;
  rotSpeed: number;
  rotXSpeed: number;
  rotYSpeed: number;
  gravity: number;
  color: string;

  constructor(pos, COLORS) {
    this.x = pos.x + Math.random() * CONFETTI_WIDTH - CONFETTI_WIDTH * 0.5;
    this.y = pos.y + Math.random() * CONFETTI_HEIGHT - CONFETTI_HEIGHT * 0.5;
    this.w = CONFETTI_WIDTH;
    this.h = CONFETTI_HEIGHT;
    this.vy = -Math.random() * 5 - 5;
    this.vx = Math.random() * 16 - 8;
    this.rot = 0;
    this.rotSpeed = (Math.random() * 2 - 1) * 0.1;
    this.rotX = 0;
    this.rotXSpeed = (Math.random() * 2 - 1) * 0.1;
    this.rotY = 0;
    this.rotYSpeed = (Math.random() * 2 - 1) * 0.2;
    this.gravity = GRAVITY - Math.random() * 0.25;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  public update(confetti) {
    // const w = Math.cos(confetti.rotX) * CONFETTI_WIDTH;
    // confetti.w = Math.abs(w);
    const h = Math.cos(confetti.rotY) * CONFETTI_HEIGHT;
    confetti.h = Math.abs(h);
    // const rot = Math.cos(confetti.rot);

    confetti.rotX += confetti.rotXSpeed;
    confetti.rotY += confetti.rotYSpeed;
    confetti.rot += confetti.rotSpeed;

    confetti.vy += confetti.gravity;

    confetti.y += confetti.vy;
    confetti.x += confetti.vx;
  }
}
