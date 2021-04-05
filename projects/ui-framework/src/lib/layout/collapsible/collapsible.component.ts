import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Icon } from '../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
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
  @Output() collapsed: EventEmitter<void> = new EventEmitter<void>();
  @Output() expanded: EventEmitter<void> = new EventEmitter<void>();
  @Input() id: string = simpleUID('bcl');
  @Input() title: string;
  @Input() config: CollapsibleStyle = COLLAPSIBLE_STYLE_DEF;
  @Input() animate: boolean;

  @Input('startExpaned') set setStartExpaned(startExpaned: boolean) {
    if (isBoolean(startExpaned) && this.section) {
      this.section.nativeElement.open = this.isExpanded = startExpaned;
    }
  }

  public isExpanded = false;
  public shouldAnimate = false;
  public chevronIcon: string = Icons.chevron_right.replace('b-icon-', '');
  public chevronColor: Icon['color'] = null;
  public chevronSize: Icon['size'] = null;
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

      this.chevronIcon = (
        this.config?.chevronIcon?.icon || Icons.chevron_right
      ).replace('b-icon-', '');

      this.chevronSize = this.config?.chevronIcon?.size
        ? Object.values(IconSize).includes(this.config.chevronIcon.size as any)
          ? this.config.chevronIcon.size
          : 'custom'
        : null;

      this.chevronColor = this.config?.chevronIcon?.color
        ? Object.values(IconColor).includes(
            this.config.chevronIcon.color as any
          )
          ? this.config.chevronIcon.color
          : 'custom'
        : null;
    }

    this.animate = Boolean(this.animate || this.config?.animate);
  }

  public expand(expand = true) {
    this.section.nativeElement.open = this.isExpanded = expand;
  }

  public collapse(collapse = true) {
    this.section.nativeElement.open = this.isExpanded = !collapse;
  }

  public onExpand(event: Event) {
    this.addAnimation();
    this.isExpanded = event.target['open'];
    this.cd.detectChanges();
    this.isExpanded ? this.expanded.emit() : this.collapsed.emit();
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
