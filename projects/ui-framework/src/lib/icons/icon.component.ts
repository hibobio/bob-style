import { Component, Input, OnInit } from '@angular/core';
import { IconService } from './icon.service';
import { Icons, IconSize, IconColor } from './icons.enum';

@Component({
  selector: 'b-icon',
  template: `
  <div [matTooltip]="toolTipSummary" [matTooltipPosition]="'above'" [matTooltipShowDelay]="300">
    <mat-icon [svgIcon]="icon" [ngClass]="getClassNames()"></mat-icon>
  </div>
  `,
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() icon: Icons;
  @Input() size: IconSize = IconSize.medium;
  @Input() color: IconColor = IconColor.dark;
  @Input() toolTipSummary: string;

  constructor(private iconService: IconService) {
  }

  ngOnInit(): void {
    this.iconService.initIcon(this.icon);
  }

  getClassNames() {
    return `${this.size} ${this.color}`;
  }
}
