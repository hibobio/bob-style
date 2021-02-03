import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  applyChanges,
  isBoolean,
  simpleUID,
} from '../../services/utils/functional-utils';
import { CHEVRON_ICONS, COLLAPSIBLE_STYLE_DEF } from './collapsible.const';
import { CollapsibleStyle } from './collapsible.interface';

@Component({
  selector: 'b-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleComponent implements OnChanges {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  @ViewChild('section', { static: true }) section: ElementRef<
    HTMLDetailsElement
  >;

  @Input() id: string = simpleUID('bcl');
  @Input() title: string;
  @Input() style: CollapsibleStyle = COLLAPSIBLE_STYLE_DEF;
  @Input() animate = false;

  @Input('startExpaned') set setStartExpaned(startExpaned: boolean) {
    if (isBoolean(startExpaned) && this.section) {
      this.section.nativeElement.open = this.expanded = startExpaned;
    }
  }

  public expanded = false;
  public shouldAnimate = false;
  readonly chevronIcon = CHEVRON_ICONS;
  private timeout: any;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        style: COLLAPSIBLE_STYLE_DEF,
      },
      [],
      true
    );
  }

  public onExpand(event: Event) {
    this.addAnimation();
    this.expanded = event.target['open'];
    this.cd.detectChanges();
  }

  private addAnimation() {
    if (this.shouldAnimate !== true) {
      return;
    }
    this.shouldAnimate = true;
    clearTimeout(this.timeout);

    this.zone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        this.shouldAnimate = false;
        this.cd.detectChanges();
      }, 300);
    });
  }
}
