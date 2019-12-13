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
import { SingleSelectComponent } from './single-select.component';
import { ButtonsModule } from '../../buttons/buttons.module';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';
import { SelectGroupOption } from '../list.interface';
import { cloneDeep } from 'lodash';
import { ListFooterModule } from '../list-footer/list-footer.module';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { SingleListModule } from '../single-list/single-list.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { FormElementLabelModule } from '../../form-elements/form-element-label/form-element-label.module';
import { InputMessageModule } from '../../form-elements/input-message/input-message.module';
import { simpleChange } from '../../services/utils/test-helpers';

describe('SingleSelectComponent', () => {
  let component: SingleSelectComponent;
  let optionsMock: SelectGroupOption[];
  let fixture: ComponentFixture<SingleSelectComponent>;
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
          { value: 'Personal 1', id: 11, selected: false },
          { value: 'Personal 2', id: 12, selected: false },
        ],
      },
    ];

    TestBed.configureTestingModule({
      declarations: [SingleSelectComponent],
      providers: [PanelPositionService],
      imports: [
        SingleListModule,
        OverlayModule,
        NoopAnimationsModule,
        CommonModule,
        ButtonsModule,
        ListFooterModule,
        TruncateTooltipModule,
        FormElementLabelModule,
        InputMessageModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SingleSelectComponent);
        component = fixture.componentInstance;
        component.startWithGroupsCollapsed = false;
        component.ngOnChanges(
          simpleChange(
            {
              options: optionsMock,
            },
            true
          )
        );

        component.selectChange.subscribe(() => {});
        component.changed.subscribe(() => {});

        spyOn(component.selectChange, 'emit');
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
    component.changed.complete();
  });

  describe('ngOnChanges', () => {
    it('should set displayValue for selected options', () => {
      expect(component.displayValue).toEqual('Basic Info 1');
    });
    it('should update trigger value also when options update', () => {
      const testOptionsMock = cloneDeep(optionsMock);
      testOptionsMock[0].options[0].selected = false;
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      expect(component.displayValue).toBe(null);

      testOptionsMock[1].options[0].selected = true;
      component.ngOnChanges(
        simpleChange({
          options: testOptionsMock,
        })
      );
      expect(component.displayValue).toEqual('Personal 1');
    });
  });

  describe('onSelect', () => {
    it('should emit onSelect with list change and propagateChange with selected value', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[3] as HTMLElement).click();
      const listChange = component['listChangeSrvc'].getListChange(
        optionsMock,
        [12]
      );
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
      expect(component.propagateChange).toHaveBeenCalledWith(12);
      flush();
    }));
  });

  describe('clearSelection', () => {
    it('should show -None- option in single-list if not required', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      const clearSelection = overlayContainerElement.querySelector(
        '.clear-selection'
      );
      expect(clearSelection).toBeTruthy();
    }));
    it('should do not show -None- option in single-list if required', fakeAsync(() => {
      component.required = true;
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      const clearSelection = overlayContainerElement.querySelector(
        '.clear-selection'
      );
      expect(clearSelection).toBeFalsy();
    }));
    it('should clear the selection', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      const clearButton = overlayContainerElement.querySelector(
        '.clear-selection'
      ) as HTMLElement;
      clearButton.click();
      fixture.autoDetectChanges();
      expect(component.displayValue).toBe(null);
      flush();
    }));
    it('should invoke selectChange.emit and propagateChange with null', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      const clearButton = overlayContainerElement.querySelector(
        '.clear-selection'
      ) as HTMLElement;
      clearButton.click();
      fixture.autoDetectChanges();
      const listChange = component['listChangeSrvc'].getListChange(
        optionsMock,
        []
      );
      expect(component.selectChange.emit).toHaveBeenCalledWith(listChange);
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
    beforeEach(async(() => {
      const testOptionsMock = cloneDeep(optionsMock);
      testOptionsMock[1].options[1].value =
        'a very very very long text that should have a tooltip';
      fixture.nativeElement.style.width = '200px';
      component.ngOnChanges(
        simpleChange(
          {
            options: testOptionsMock,
          },
          true
        )
      );
      fixture.autoDetectChanges();
    }));
    it('should not show tooltip', () => {
      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );
      expect(tooltipEl).toBe(null);
    });
    it('should add tooltip', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.openPanel();
      tick(500);

      (overlayContainerElement.querySelectorAll(
        'b-single-list .option'
      )[3] as HTMLElement).click();

      tick(500);

      const tooltipEl = fixture.debugElement.query(
        By.css('.btt.tooltip-enabled')
      );
      expect(tooltipEl.nativeElement.innerText).toEqual(
        'a very very very long text that should have a tooltip'
      );
      flush();
    }));
  });
});
