import { Component, Input, OnInit } from '@angular/core';
import { IconService } from './icon.service';
import { IconColor, Icons, IconSize } from './icons.enum';

@Component({
  selector: 'b-icon',
  template: `
  <div *ngIf="toolTipSummary; else iconOnly"
       [matTooltip]="toolTipSummary"
       [matTooltipPosition]="'above'"
       [matTooltipShowDelay]="300">
    <ng-container *ngTemplateOutlet="iconOnly">
    </ng-container>
  </div>
  <ng-template #iconOnly>
    <mat-icon [svgIcon]="icon" [ngClass]="getClassNames()"></mat-icon>
  </ng-template>
  `,
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() icon: Icons;
  @Input() size: IconSize = IconSize.medium;
  @Input() color: IconColor = IconColor.dark;
  @Input() hasHoverState = false;
  @Input() toolTipSummary: string;

  constructor(private iconService: IconService) {
  }

  ngOnInit(): void {
   this.iconService.initIcon(this.icon);
  }

  getClassNames() {
    return `${this.size} ${this.color}${this.hasHoverState ? ' has-hover-state' : ''}`;
  }
}
