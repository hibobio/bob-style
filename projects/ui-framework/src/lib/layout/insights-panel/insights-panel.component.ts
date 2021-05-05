import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Button } from '../../buttons/buttons.interface';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import {
  InsightsPanelConfig,
  InsightsPanelData,
} from './insight-panel.interfaces';
import { INSIGHTS_PANEL_CONFIG_DEF } from './insights-panel-consts';
import { InsightsPanelType } from './insights-panel.enums';

@Component({
  selector: 'b-insights-panel',
  templateUrl: 'insights-panel.component.html',
  styleUrls: ['insights-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightsPanelComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  readonly iconSizes = IconSize;
  readonly iconTypes = Icons;

  @HostBinding('attr.data-type') @Input() type: InsightsPanelType =
    InsightsPanelType.information;

  @HostBinding('attr.data-expanded')
  @Input('expanded')
  isExpanded: boolean = true;

  @Input('config') set setConfig(config: InsightsPanelConfig) {
    this.config = { ...this.config, ...config };
  }
  public config: InsightsPanelConfig = { ...INSIGHTS_PANEL_CONFIG_DEF };

  @Input() data: InsightsPanelData[];

  @Output() expanded: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly expandButtonConf: Button = {
    type: ButtonType.tertiary,
    size: ButtonSize.small,
    color: IconColor.dark,
  };

  public onExpandClick(): void {
    this.expanded.emit((this.isExpanded = !this.isExpanded));
    this.cdr.detectChanges();
  }
}
