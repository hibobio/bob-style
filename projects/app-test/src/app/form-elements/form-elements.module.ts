import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormElementsModule } from '../../../../ui-framework/src/lib/form-elements/form-elements.module';
import { IconsModule } from '../../../../ui-framework/src/lib/icons/icons.module';
import { FormElementsTestComponent } from './form-elements.component';
import { AvatarModule } from '../../../../ui-framework/src/lib/avatar/avatar/avatar.module';
import { EventManagerPlugins } from '../../../../ui-framework/src/lib/services/utils/eventManager.plugins';

@NgModule({
  declarations: [FormElementsTestComponent],
  exports: [FormElementsTestComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
    FormElementsModule,
    AvatarModule
  ],
  providers: [EventManagerPlugins[0]]
})
export class FormElementsTestModule {}
