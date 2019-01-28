import { async, ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SingleSelectComponent } from './single-select.component';
import { SelectModelService } from '../select-model-service/select-model.service';
import { SearchModule } from '../../../navigation/search/search.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';
import { IconsModule } from '../../../icons';
import { FlexLayoutModule } from '@angular/flex-layout';

describe('SingleSelectComponent', () => {
  let component: SingleSelectComponent;
  let optionsMock;
  let selectionGroupOptionsMock;
  let fixture: ComponentFixture<SingleSelectComponent>;
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
        SingleSelectComponent,
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
        fixture = TestBed.createComponent(SingleSelectComponent);
        component = fixture.componentInstance;
        component.options = optionsMock;
        component.isMultiSelect = false;
        component.value = 1;
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
      expect(component.selectedModel).toEqual(selectionGroupOptionsMock[0].options[0]);
    });
    it('should set the triggerValue', () => {
      expect(component.triggerValue).toEqual('Basic Info 1');
    });
  });

  describe('onOptionClick', () => {
    it('should change selectedModel with the selected option',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual(selectionGroupOptionsMock[1].options[0]);
      }));

    it('should emit the selectedId',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectChange.emit).toHaveBeenCalledWith(11);
      }));

    it('should close the panel after selection',
      fakeAsync(() => {
        spyOn(component.mySelect, 'close');
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.mySelect.close).toHaveBeenCalled();
      }));

    it('should update triggerText',
      fakeAsync(() => {
        component.mySelect.open();
        fixture.detectChanges();
        flush();

        (overlayContainerElement.querySelectorAll('mat-option')[4] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.triggerValue).toEqual('Personal 1');
      }));
  });

  describe('triggerText', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(SingleSelectComponent);
      component = fixture.componentInstance;
      fixture.nativeElement.style.width = '200px';
      component.options = optionsMock;
      component.value = null;
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
        fixture.detectChanges();
        flush();

        const triggerValue = fixture.debugElement.query(By.css('.trigger-value'));
        expect(triggerValue.nativeElement.innerText).toBe('Basic Info 1');
      }));
  });

  describe('clearSelection', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(SingleSelectComponent);
      component = fixture.componentInstance;
      component.options = optionsMock;
      component.value = null;
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

        (overlayContainerElement.querySelectorAll('mat-option')[1] as HTMLElement).click();
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

        (overlayContainerElement.querySelectorAll('mat-option')[1] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toEqual({
          value: 'Basic Info 1',
          id: 1,
          groupName: 'Basic Info',
          isGroupHeader: false,
        });

        const clearSelection = fixture.debugElement.query(By.css('.clear-selection'));
        clearSelection.triggerEventHandler('click', null);
        fixture.detectChanges();
        flush();

        expect(component.selectedModel).toBe(null);
      }));
  });
});
