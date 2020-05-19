import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { MultiSelectComponent } from './multi-select.component';
import { By } from '@angular/platform-browser';
import { SelectGroupOption } from '../list.interface';
import { ListModelService } from '../list-service/list-model.service';
import { cloneDeep } from 'lodash';
import { ListChange } from '../list-change/list-change';
import { simpleChange } from '../../services/utils/test-helpers';
import {
  mockTranslatePipe,
  TranslateServiceProvideMock,
  mockHighlightPipe,
  listKeyboardServiceStub,
  MobileServiceProvideMock,
} from '../../tests/services.stub.spec';
import { MockComponent } from 'ng-mocks';
import { MultiListComponent } from '../multi-list/multi-list.component';
import { ListFooterComponent } from '../list-footer/list-footer.component';
import { CheckboxComponent } from '../../form-elements/checkbox/checkbox.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { IconComponent } from '../../icons/icon.component';
import { SearchComponent } from '../../search/search/search.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListChangeService } from '../list-change/list-change.service';
import { ListKeyboardService } from '../list-service/list-keyboard.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<MultiSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  beforeEach(async(() => {
    optionsMock = [
      {
        groupName: 'Basic Info',
        options: [
          { value: 'Basic Info 1', id: 1, selected: true },
          { value: 'Basic Info 2', id: 2, selected: false },
        ],
      },
      {
        groupName: 'Personal',
        options: [
          { value: 'Personal 1', id: 11, selected: true },
          { value: 'Personal 2', id: 12, selected: false },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        MultiSelectComponent,
        MultiListComponent,
        ListFooterComponent,
        mockTranslatePipe,
        mockHighlightPipe,
        MockComponent(CheckboxComponent),
        ButtonComponent,
        TextButtonComponent,
        MockComponent(IconComponent),
        MockComponent(SearchComponent),
      ],

      imports: [
        CommonModule,
        NoopAnimationsModule,
        ScrollingModule,
        OverlayModule,
        TruncateTooltipModule,
      ],

      providers: [
        PanelPositionService,
        ListModelService,
        ListChangeService,
        { provide: ListKeyboardService, useValue: listKeyboardServiceStub },
        MobileServiceProvideMock(),
        TranslateServiceProvideMock(),
      ],

      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        component.startWithGroupsCollapsed = false;
        component.ngAfterViewInit = () => {};

        component.ngOnChanges(
          simpleChange({
            options: optionsMock,
          })
        );

        component.selectChange.subscribe(() => {});
        component.selectModified.subscribe(() => {});
        component.selectCancelled.subscribe(() => {});
        component.changed.subscribe(() => {});

        spyOn(component.selectChange, 'emit');
        spyOn(component.selectModified, 'emit');
        spyOn(component.selectCancelled, 'emit');
        spyOn(component, 'propagateChange');
        fixture.autoDetectChanges();
      });

    inject(
      [OverlayContainer, Platform],
      (oc: OverlayContainer, p: Platform) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        platform = p;
      }
    )();
  }));

  afterEach(() => {
    component.selectChange.complete();
    component.selectModified.complete();
    component.selectCancelled.complete();
    component.changed.complete();
  });

  describe('OnInit', () => {
    it('should set selectedIDs', () => {
      expect(component.value).toEqual([1, 11]);
    });
    it('should set trigger value', () => {
      expect(component.displayValue).toEqual('Basic Info 1, Personal 1');
    });
  });

  describe('OnChanges', () => {
    beforeEach(() => {
      const newOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      newOptionsMock[0].options[0].selected = false;
      newOptionsMock[1].options[0].selected = false;
      newOptionsMock[1].options[1].selected = true;

      component.ngOnChanges(
        simpleChange({
          options: newOptionsMock,
        })
      );
    });
    it('should update selectedIDs', () => {
      expect(component.value).toEqual([12]);
    });
    it('should update trigger value when options update', () => {
      expect(component.displayValue).toEqual('Personal 2');
    });
  });

  describe('onSelect', () => {
    it('should update selectedIDs', fakeAsync(() => {
      component.openPanel();
      fixture.autoDetectChanges();
      tick(500);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      expect(component.value).toEqual([1, 11, 12]);

      flush();
    }));

    it('should emit onSelectModified with listChange', fakeAsync(() => {
      const expectedOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      expectedOptionsMock[1].options[1].selected = true;
      component.openPanel();
      fixture.autoDetectChanges();
      tick(500);
      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      const expectedListChange = new ListChange(expectedOptionsMock);
      expect(component.selectModified.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      flush();
    }));
  });

  describe('selectChange', () => {
    it('should emit onSelect with listChange and propagateChange with selected IDs array', fakeAsync(() => {
      const expectedMock = cloneDeep(optionsMock);
      expectedMock[1].options[1].selected = true;
      const expectedListChange = new ListChange(expectedMock);

      component.openPanel();
      fixture.autoDetectChanges();

      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();

      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button button'
      ) as HTMLButtonElement;

      applyButton.click();

      expect(component.selectChange.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      expect(component.propagateChange).toHaveBeenCalledWith([1, 11, 12]);
      flush();
    }));

    it('should close the panel on apply', fakeAsync(() => {
      spyOn(component as any, 'destroyPanel');
      component.openPanel();
      fixture.autoDetectChanges();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();

      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button button'
      ) as HTMLButtonElement;
      applyButton.click();

      expect(component['destroyPanel']).toHaveBeenCalled();
      flush();
    }));
  });

  describe('clear -> apply', () => {
    let expectedOptionsMock: SelectGroupOption[];
    beforeEach(() => {
      expectedOptionsMock = cloneDeep(optionsMock);
      expectedOptionsMock[0].options[0].selected = false;
      expectedOptionsMock[1].options[0].selected = false;
    });
    it('should clear the selection from options, selectedIDs and empty displayValue', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();

      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button [role="button"]'
      ) as HTMLElement;
      clearButton.click();

      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button button'
      ) as HTMLElement;
      applyButton.click();

      fixture.autoDetectChanges();

      expect(component.value).toEqual([]);
      expect(component.displayValue).toBeFalsy();
      expect(component.options).toEqual(expectedOptionsMock);
      flush();
    }));
    it('should invoke selectChange.emit with listChange and propagateChange with []', fakeAsync(() => {
      const expectedListChange = new ListChange(expectedOptionsMock);

      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();
      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button [role="button"]'
      ) as HTMLElement;
      clearButton.click();
      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button button'
      ) as HTMLElement;
      applyButton.click();
      fixture.autoDetectChanges();
      expect(component.selectChange.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      expect(component.propagateChange).toHaveBeenCalledWith([]);
      flush();
    }));
  });

  describe('OnDestroy', () => {
    it('should invoke panel close', () => {
      spyOn(component as any, 'destroyPanel');
      component.ngOnDestroy();
      expect(component['destroyPanel']).toHaveBeenCalled();
    });
  });

  describe('tooltip', () => {
    beforeEach(() => {
      fixture.nativeElement.style.width = '150px';
      fixture.nativeElement.style.minWidth = '150px';
    });

    it('should not show tooltip', () => {
      const newOptionsMock: SelectGroupOption[] = cloneDeep(optionsMock);
      optionsMock[0].options[0].selected = false;

      component.ngOnChanges(
        simpleChange({
          options: newOptionsMock,
        })
      );

      fixture.detectChanges();

      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );
      expect(tooltipEl).toBe(null);
    });

    it('should add tooltip', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      const option = overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement;
      option.click();

      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button button'
      ) as HTMLButtonElement;
      applyButton.click();

      tick(0);
      fixture.detectChanges();
      tick(0);

      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );

      expect(tooltipEl).not.toBe(null);
      expect(tooltipEl.nativeElement.innerText).toEqual(
        'Basic Info 1, Personal 1, Personal 2'
      );
      flush();
    }));
  });

  describe('total-values counter', () => {
    beforeEach(() => {
      fixture.nativeElement.style.width = '150px';
      fixture.nativeElement.style.minWidth = '150px';
    });

    it('should put a selected values number in suffix, if tooltip is enabled', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      const options = overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      );
      (options[1] as HTMLElement).click();
      (options[3] as HTMLElement).click();

      const applyButton = overlayContainerElement.querySelector(
        'b-list-footer .apply-button button'
      ) as HTMLButtonElement;
      applyButton.click();

      tick();
      fixture.detectChanges();

      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );
      const totalValuesCounter = fixture.debugElement.query(
        By.css('.total-values')
      ).nativeElement;

      expect(tooltipEl).not.toBeFalsy();
      expect(totalValuesCounter.innerText).toEqual('(4)');
      flush();
    }));
  });

  describe('cancelSelection', () => {
    it('should close the panel', fakeAsync(() => {
      spyOn(component as any, 'destroyPanel');

      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      component.onCancel();

      expect(component['destroyPanel']).toHaveBeenCalled();
      flush();
    }));

    it('should emit selectCancelled event and ignore option click in listChange', fakeAsync(() => {
      const expectedListChange = new ListChange(optionsMock);

      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();

      component.onCancel();

      expect(component.selectCancelled.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      flush();
    }));
  });

  describe('clear -> cancel', () => {
    it('should reset the selection from options, selectedIDs and reset displayValue', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();

      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button [role="button"]'
      ) as HTMLElement;
      clearButton.click();

      component.onCancel();

      fixture.autoDetectChanges();
      expect(component.value).toEqual([1, 11]);
      expect(component.displayValue).toEqual('Basic Info 1, Personal 1');
      expect(component.options).toEqual(optionsMock);
      flush();
    }));

    it('should invoke selectCancelled.emit with listChange and propagateChange with [3]', fakeAsync(() => {
      const expectedListChange = new ListChange(optionsMock);

      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-multi-list .option'
      )[3] as HTMLElement).click();
      fixture.autoDetectChanges();

      const clearButton = overlayContainerElement.querySelector(
        'b-list-footer .clear-button [role="button"]'
      ) as HTMLElement;
      clearButton.click();

      component.onCancel();

      fixture.autoDetectChanges();
      expect(component.selectCancelled.emit).toHaveBeenCalledWith(
        expectedListChange
      );
      flush();
    }));
  });
});
