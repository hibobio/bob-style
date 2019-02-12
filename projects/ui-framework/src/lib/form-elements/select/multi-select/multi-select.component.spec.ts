import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectComponent } from './multi-select.component';
import { SelectModelService } from '../select-model-service/select-model.service';
import { SearchModule } from '../../../navigation/search/search.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';
import { IconsModule } from '../../../icons';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectionOption } from '../select.interface';

xdescribe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let optionsMock;
  let selectionGroupOptionsMock;
  let fixture: ComponentFixture<MultiSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  beforeEach(async(() => {
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

    selectionGroupOptionsMock = [
      {
        groupName: 'Basic Info',
        isCollapsed: false,
        groupHeader: {
          groupName: 'Basic Info',
          value: 'Basic Info',
          id: 'Basic Info',
          isGroupHeader: true,
        },
        'options': [
          {
            value: 'Basic Info 1',
            id: 1,
            groupName: 'Basic Info',
            isGroupHeader: false,
          },
          {
            value: 'Basic Info 2',
            id: 2,
            groupName: 'Basic Info',
            isGroupHeader: false,
          },
        ]
      },
      {
        groupName: 'Personal',
        isCollapsed: false,
        groupHeader: {
          groupName: 'Personal',
          value: 'Personal',
          id: 'Personal',
          isGroupHeader: true,
        },
        'options': [
          {
            value: 'Personal 1',
            id: 11,
            groupName: 'Personal',
            isGroupHeader: false,
          },
          {
            value: 'Personal 2',
            id: 12,
            groupName: 'Personal',
            isGroupHeader: false
          },
        ]
      },
    ];

    TestBed.configureTestingModule({
      declarations: [
        MultiSelectComponent,
      ],
      providers: [
        SelectModelService,
      ],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        SearchModule,
        ButtonsModule,
        IconsModule,
        MatTooltipModule,
        FlexLayoutModule,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.value = [1, 2];
        spyOn(component.selectChange, 'emit');
        fixture.detectChanges();
      });

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }));

  describe('ngOnInit', () => {
    it('should set the selectionGroupOptions', () => {
      expect(component.selectionGroupOptions).toEqual(selectionGroupOptionsMock);
    });
    it('should set the selectedModel', () => {
      expect(component.selectedModel).toEqual([
        selectionGroupOptionsMock[0].options[0],
        selectionGroupOptionsMock[0].options[1],
        selectionGroupOptionsMock[0].groupHeader,
      ]);
    });
    it('should set the triggerValue', () => {
      expect(component.triggerValue).toEqual('Basic Info 1, Basic Info 2, Basic Info');
    });
  });

  describe('onOptionClick', () => {
    it('should add all options when clicking unselected headerOption',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[3] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual([
          selectionGroupOptionsMock[0].groupHeader,
          selectionGroupOptionsMock[0].options[0],
          selectionGroupOptionsMock[0].options[1],
          selectionGroupOptionsMock[1].groupHeader,
          selectionGroupOptionsMock[1].options[0],
          selectionGroupOptionsMock[1].options[1],
        ]);
      }));
    it('should remove all options when clicking selected headerOption',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[0] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual([]);
      }));
    it('should select headerOption if group option is selected and other all group options are selected',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual([
          selectionGroupOptionsMock[0].options[0],
          selectionGroupOptionsMock[0].options[1],
          selectionGroupOptionsMock[1].options[0],
          selectionGroupOptionsMock[0].groupHeader,
        ]);

        (overlayContainerElement.querySelectorAll('mat-option')[5] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual([
          selectionGroupOptionsMock[0].options[0],
          selectionGroupOptionsMock[0].options[1],
          selectionGroupOptionsMock[1].options[0],
          selectionGroupOptionsMock[1].options[1],
          selectionGroupOptionsMock[0].groupHeader,
          selectionGroupOptionsMock[1].groupHeader,
        ]);
      }));

    it('should unselect headerOption if group option is unselected',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[1] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual([
          selectionGroupOptionsMock[0].options[1],
        ]);
      }));

    it('should update triggerText',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.triggerValue).toEqual('Basic Info 1, Basic Info 2, Personal 1, Basic Info');
      }));

    it('should emit the selectedId after apply trigger',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const applyButtonEl = fixture.debugElement.query(By.css('.apply-button'));
        applyButtonEl.triggerEventHandler('click', null);

        expect(component.selectChange.emit).toHaveBeenCalledWith([1, 2, 11]);
      }));

    it('should close the panel after apply trigger',
      fakeAsync(() => {
        spyOn(component.mySelect, 'close');
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const applyButtonEl = fixture.debugElement.query(By.css('.apply-button'));
        applyButtonEl.triggerEventHandler('click', null);

        expect(component.mySelect.close).toHaveBeenCalled();
      }));

    it('should reset the model after cancel trigger',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const cancelButtonEl = fixture.debugElement.query(By.css('.cancel-button'));
        cancelButtonEl.triggerEventHandler('click', null);

        tick();

        expect(component.selectedModel).toEqual([
          selectionGroupOptionsMock[0].options[0],
          selectionGroupOptionsMock[0].options[1],
          selectionGroupOptionsMock[0].groupHeader,
        ]);
        expect(component.triggerValue).toEqual('Basic Info 1, Basic Info 2, Basic Info');
      }));

    it('should not emit the selectedId after cancel trigger',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const cancelButtonEl = fixture.debugElement.query(By.css('.cancel-button'));
        cancelButtonEl.triggerEventHandler('click', null);

        tick();

        expect(component.selectChange.emit).not.toHaveBeenCalled();
      }));

    it('should close the panel after cancel trigger',
      fakeAsync(() => {
        spyOn(component.mySelect, 'close');
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        const cancelButtonEl = fixture.debugElement.query(By.css('.cancel-button'));
        cancelButtonEl.triggerEventHandler('click', null);

        tick();

        expect(component.mySelect.close).toHaveBeenCalled();
      }));
  });

  describe('triggerText', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(MultiSelectComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style.width = '200px';
      component.options = optionsMock;
      component.isMultiSelect = true;
      component.value = [];
      spyOn(component.selectChange, 'emit');
      fixture.detectChanges();
    }));
    it('should not show select trigger value when value is empty', () => {
      const triggerValue = fixture.debugElement.query(By.css('.trigger-value'));
      expect(triggerValue).toBe(null);
    });
    it('should show trigger value when value is not empty',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[1] as HTMLElement).click();
        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const triggerValue = fixture.debugElement.query(By.css('.trigger-value'));
        expect(triggerValue.nativeElement.innerText).toBe('Basic Info 1, Personal 1');
      }));
    it('should show (numSelectedOptions) that has a tooltip',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[0] as HTMLElement).click();
        fixture.detectChanges();
        flush();
        (overlayContainerElement.querySelectorAll('mat-option')[3] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const triggerValue = fixture.debugElement.query(By.css('.trigger-value'));
        expect(triggerValue.nativeElement.innerText).toBe('Basic Info, Basic Info 1, Basic Info 2, Personal, Personal 1, Personal 2');
        const numberOfSelectedOptions = fixture.debugElement.query(By.css('.number-of-selected-options'));
        expect(numberOfSelectedOptions.nativeElement.innerText).toBe('(6)');
      }));
  });

  describe('clearSelection', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(MultiSelectComponent);
      component = fixture.componentInstance;
      component.options = optionsMock;
      component.isMultiSelect = true;
      component.value = [];
      spyOn(component.selectChange, 'emit');
      fixture.detectChanges();
    }));
    it('should not be displayed when there are no values', () => {
      const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
      expect(clearSelection).toBe(null);
    });
    it('should be displayed when there is at list one value',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[0] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
        expect(clearSelection).not.toBe(null);
      }));
    it('should empty selection when clicked',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[0] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect((component.selectedModel as SelectionOption[]).length).toEqual(3);

        const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
        clearSelection.triggerEventHandler('click', null);
        fixture.detectChanges();
        flush();

        expect((component.selectedModel as SelectionOption[]).length).toEqual(0);
      }));
  });
});
