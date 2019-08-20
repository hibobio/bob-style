import { NgModule } from '@angular/core';
import { Display1Component } from './display-1/display-1.component';
import { Display2Component } from './display-2/display-2.component';
import { Display3Component } from './display-3/display-3.component';
import { Display4Component } from './display-4/display-4.component';
import { HeadingComponent } from './heading/heading.component';
import { SubHeadingComponent } from './subheading/subheading.component';
import { CaptionComponent } from './caption/caption.component';
import { BigBodyComponent } from './big-body/big-body.component';
import { BoldBodyComponent } from './bold-body/bold-body.component';
import { BodyComponent } from './body/body.component';
import { LabelValueComponent } from './label-value/label-value.component';
import { CommonModule } from '@angular/common';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';

@NgModule({
  declarations: [
    Display1Component,
    Display2Component,
    Display3Component,
    Display4Component,
    HeadingComponent,
    SubHeadingComponent,
    CaptionComponent,
    BigBodyComponent,
    BoldBodyComponent,
    BodyComponent,
    LabelValueComponent
  ],
  imports: [CommonModule],
  exports: [
    Display1Component,
    Display2Component,
    Display3Component,
    Display4Component,
    HeadingComponent,
    SubHeadingComponent,
    CaptionComponent,
    BigBodyComponent,
    BoldBodyComponent,
    BodyComponent,
    LabelValueComponent
  ],
  providers: [EventManagerPlugins[0]]
})
export class TypographyModule {}
