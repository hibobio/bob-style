import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { InsightsPanelType } from './insights-panel.enums';
import { InsightsPanelConfig, InsightsPanelData } from './insight-panel.interfaces';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { Button } from '../../buttons/buttons.interface';
import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { INSIGHTS_PANEL_CONFIG_DEF } from './insights-panel-consts';

@Component({
  selector: 'b-insights-panel',
  templateUrl: 'insights-panel.component.html',
  styleUrls: ['insights-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InsightsPanelComponent {
  constructor(private cdr: ChangeDetectorRef) {
  }

  public readonly iconSizes = IconSize;
  public readonly iconTypes = Icons;

  @Output() expended: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding('attr.data-type') @Input() type: InsightsPanelType = InsightsPanelType.information;
  @HostBinding('attr.container-expanded') @Input() isExpanded: boolean = true;

  public readonly expandButtonConf: Button = {
    type: ButtonType.tertiary,
    size: ButtonSize.small,
    color: IconColor.dark
  };

  @Input('config') set setConfig(config: InsightsPanelConfig) {
    this.config = { ...this.config, ...config };
  }

  @Input() data: InsightsPanelData[];
  public config: InsightsPanelConfig = { ...INSIGHTS_PANEL_CONFIG_DEF };

  public onExpandClick(): void {
    this.expended.emit(this.isExpanded = !this.isExpanded);
    this.cdr.detectChanges();
  }
}
