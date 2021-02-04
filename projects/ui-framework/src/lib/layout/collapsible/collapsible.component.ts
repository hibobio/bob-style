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
import { Icons } from '../../icons/icons.enum';
import {
  applyChanges,
  hasChanges,
  isBoolean,
  simpleUID,
} from '../../services/utils/functional-utils';
import { COLLAPSIBLE_STYLE_DEF } from './collapsible.const';
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
  @Input() config: CollapsibleStyle = COLLAPSIBLE_STYLE_DEF;
  @Input() animate = false;

  @Input('startExpaned') set setStartExpaned(startExpaned: boolean) {
    if (isBoolean(startExpaned) && this.section) {
      this.section.nativeElement.open = this.expanded = startExpaned;
    }
  }

  public expanded = false;
  public shouldAnimate = false;
  public chevronIcon: string;
  private timeout: any;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        config: COLLAPSIBLE_STYLE_DEF,
      },
      [],
      true
    );

    if (hasChanges(changes, ['config'], true)) {
      this.config = { ...COLLAPSIBLE_STYLE_DEF, ...this.config };
    }

    this.chevronIcon = (
      this.config?.chevronIcon?.icon || Icons.chevron_right
    ).replace('b-icon-', '');

    console.log(changes, this.chevronIcon);
  }

  public onExpand(event: Event) {
    this.addAnimation();
    this.expanded = event.target['open'];
    this.cd.detectChanges();
  }

  private addAnimation() {
    if (this.animate !== true) {
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
