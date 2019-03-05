import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IconService } from '../../icons/icon.service';
import { toUpper } from 'lodash';
import { PanelComponent } from './panel.component';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { PanelPositionService } from './panel-position.service';
import { ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { PanelModule } from './panel.module';

describe('SearchComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {

    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        OverlayModule,
        PanelModule,
      ],
      providers: [
        PanelPositionService,
        Overlay,
        ViewContainerRef,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  describe('openPanel', () => {
    it('should invoke overlay.create with config', () => {
      component.openPanel();
      // console.log('component.overlayRef', component.overlayRef);
    });
  });
});
