import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SingleSelectComponent } from './single-select.component';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputModule } from '../../input';
import { PanelPositionService } from '../../../overlay/panel/panel-position.service';
import { SingleListModule } from '../single-list/single-list.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconService } from '../../../icons/icon.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SingleSelectComponent', () => {
  let component: SingleSelectComponent;
  let optionsMock;
  let fixture: ComponentFixture<SingleSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;
  let spyIconService: SpyObj<IconService>;

  beforeEach(async(() => {
    spyIconService = createSpyObj('spyIconService', ['initIcon']);

    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1 },
          { value: 'Basic Info 2', id: 2 },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11 },
          { value: 'Personal 2', id: 12 },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        SingleSelectComponent,
      ],
      providers: [
        PanelPositionService,
        { provide: IconService, useValue: spyIconService },
      ],
      imports: [
        SingleListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        InputModule,
        MatFormFieldModule,
        MatInputModule,
        ButtonsModule,
        FlexLayoutModule,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.value = 1;
        spyOn(component.selectChange, 'emit');
        spyOn(component, 'propagateChange');
        fixture.autoDetectChanges();
      });

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }));

  describe('ngOnInit', () => {
    it('should set triggerValue if value is provided', () => {
      expect(component.triggerValue).toEqual('Basic Info 1');
    });
  });

  describe('onSelect', () => {
    it('should emit onSelect with selected value',
      fakeAsync(() => {
        component.openPanel();
        fixture.autoDetectChanges();
        tick(0);
        (overlayContainerElement.querySelectorAll('b-single-list .option')[3] as HTMLElement).click();
        expect(component.value).toEqual(12);
        expect(component.selectChange.emit).toHaveBeenCalledWith(12);
        expect(component.propagateChange).toHaveBeenCalledWith(12);
        flush();
      }));
  });

  describe('OnDestroy', () => {
    it('should invoke panel close', () => {
      spyOn(component, 'destroyPanel');
      component.ngOnDestroy();
      expect(component.destroyPanel).toHaveBeenCalled();
    });
  });

});
