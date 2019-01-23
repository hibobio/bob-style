import { async, ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectComponent } from './select.component';
import { SelectModelService } from './select-model.service';
import { SearchModule } from '../../../shem-zmani/search/search.module';
import { ButtonsModule } from '../../../buttons-indicators/buttons';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { By } from '@angular/platform-browser';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let optionsMock;
  let selectionGroupOptionsMock;
  let fixture: ComponentFixture<SelectComponent>;
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
        SelectComponent,
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
      ],
    })
      .compileComponents()
      .then(() => {
      });

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }));


  describe('multiSelect', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(SelectComponent);
      component = fixture.componentInstance;
      component.options = optionsMock;
      component.isMultiSelect = true;
      component.value = [1, 2];
      spyOn(component.selectChange, 'emit');
      fixture.detectChanges();
    }));
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

          expect(component.mySelect.close).toHaveBeenCalled();
        }));
    });
  });

  describe('singleSelect', () => {
    beforeEach(async(() => {
      fixture = TestBed.createComponent(SelectComponent);
      component = fixture.componentInstance;
      component.options = optionsMock;
      component.isMultiSelect = false;
      component.value = [1];
      spyOn(component.selectChange, 'emit');
      fixture.detectChanges();
    }));
    it('should set the selectionGroupOptions', () => {
      expect(component.selectionGroupOptions).toEqual(selectionGroupOptionsMock);
    });
    it('should set the selectedModel', () => {
      expect(component.selectedModel).toEqual(selectionGroupOptionsMock[0].options[0]);
    });
    it('should set the triggerValue', () => {
      expect(component.triggerValue).toEqual('Basic Info 1');
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

          expect(component.selectChange.emit).toHaveBeenCalledWith([11]);
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
  });
});
