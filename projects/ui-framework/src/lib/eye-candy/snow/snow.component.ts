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
  ViewChild
} from '@angular/core';
import { remove as _remove, isEqual as _isEqual } from 'lodash';

const MIN_WEIGHT = 1.5;
const MAX_WEIGHT = 4;
const MAX_SPEED = 3;

@Component({
  selector: 'b-snow',
  template: '<canvas #snowCanvas></canvas>',
  styleUrls: ['./snow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnowComponent implements OnInit, OnDestroy {
  @ViewChild('snowCanvas', { static: true }) canvas: ElementRef;

  @Input() numberOfFlakes = 120;
  @Input() snowDuration = 1000 * 30;
  @Output() complete: EventEmitter<any> = new EventEmitter<any>();

  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private windowDim: { w: number, h: number };
  private FLAKES = [];
  private loopReq;
  private snowing = false;

  constructor(
    private zone: NgZone,
  ) {
  }

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

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.loopReq);
  }

  makeSnow(): void {
    this.snowing = true;
    setTimeout(() => {
      this.snowing = false;
    }, this.snowDuration);

    let flake;
    let x;
    let y;

    for (let i = 0; i < this.numberOfFlakes; i++) {
      x = this._randomBetween(0, this.windowDim.w, true);
      y = this._randomBetween(0, this.windowDim.h, true);

      flake = this._generateFlake(x, y);
      this.FLAKES.push(flake);
    }

    if (!this.loopReq) {
      this._render();
    }
  }

  private _render() {
    this.zone.runOutsideAngular(() => {
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.windowDim.w, this.windowDim.h);
      this.ctx.restore();

      this.FLAKES.forEach((flake) => {
        flake.update(flake);

        this.ctx.beginPath();
        this.ctx.arc(flake.x, flake.y, flake.weight, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${ flake.alpha })`;
        this.ctx.fill();

        if ((flake.y + flake.weight * 0.5) > this.windowDim.h) {
          if (this.snowing) {
            this._repositionFlake(flake);
          } else {
            flake.outOfBounds = true;
          }
        }
      });

      _remove(this.FLAKES, flake => {
        return _isEqual(flake.outOfBounds, true);
      });

      if (this.FLAKES.length > 0) {
        this.loopReq = requestAnimationFrame(this._render.bind(this));
      } else {
        window.cancelAnimationFrame(this.loopReq);
        this.loopReq = null;
        this.complete.emit();
      }
    });
  }

  private _repositionFlake(flake) {
    flake.x = this._randomBetween(0, this.windowDim.w, true);
    flake.y = -flake.weight;
  }

  private _randomBetween(min, max, round = false) {
    const num = Math.random() * (max - min + 1) + min;
    return round
      ? Math.floor(num)
      : num;
  }

  private _generateFlake(posX, posY) {
    const weight = this._randomBetween(MIN_WEIGHT, MAX_WEIGHT);
    return {
      weight,
      x: posX,
      y: posY,
      r: this._randomBetween(0, 1),
      a: this._randomBetween(0, Math.PI),
      aStep: 0.01,
      alpha: (weight / MAX_WEIGHT),
      speed: (weight / MAX_WEIGHT) * MAX_SPEED,
      update: (flake) => {
        flake.x += Math.cos(flake.a) * flake.r;
        flake.a += flake.aStep;
        flake.y += flake.speed;
      },
    };
  }

}
