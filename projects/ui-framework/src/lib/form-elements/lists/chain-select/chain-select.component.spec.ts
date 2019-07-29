import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChainSelectComponent } from './chain-select.component';
import { IconsModule } from '../../../icons/icons.module';
import { ComponentRendererModule } from '../../../services/component-renderer/component-renderer.module';
import { By } from '@angular/platform-browser';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { ListChange } from '../list-change/list-change';

describe('EmployeeChainSelectComponent', () => {
  let component: ChainSelectComponent;
  let fixture: ComponentFixture<ChainSelectComponent>;
  let TestComponent;
  let emptyChainLink;

  beforeEach(async(() => {
    @Component({
      selector: 'b-test-select',
      template: '<select (click)="change($event)"></select>',
    })
    class TestSelectComponent {
      @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();

      public change($event) {
        this.selectChange.emit($event);
      }
    }

    TestComponent = TestSelectComponent;

    @NgModule({
      imports: [CommonModule],
      exports: [TestSelectComponent],
      declarations: [TestSelectComponent],
      entryComponents: [TestSelectComponent],
    })
    class TestSelectModule { }

    emptyChainLink = {
      active: false,
      selectComponentConfig: {
        component: TestComponent,
        handlers: {
          'selectChange': jasmine.any(Function)
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        ChainSelectComponent
      ],
      imports: [
        CommonModule,
        IconsModule,
        ButtonsModule,
        ComponentRendererModule,
        TestSelectModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainSelectComponent);
    component = fixture.componentInstance;
    component.selectComponent = TestComponent;
    component.selectComponentConfig = {
      selectedIdKey: 'selectedId',
      outputKey: 'selectChange',
      selectedIds: [],
    };
    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('Should set one empty chain link if none are selected', () => {
      expect(component.chainLinkList).toEqual([emptyChainLink]);
    });

    it('Should set chain links according to selected ids', () => {
      component.selectComponentConfig.selectedIds = ['123'];
      component.ngOnInit();
      expect(component.chainLinkList).toEqual([{
        active: false,
        selectComponentConfig: {
          component: TestComponent,
          attributes: {
            'selectedId': '123',
          },
          handlers: {
            'selectChange': jasmine.any(Function)
          }
        }
      }]);
    });

    it('Should show one select by default', () => {
      const selectElements = fixture.debugElement.queryAll(By.css('select'));
      expect(selectElements.length).toBe(1);
    });

    it('Should create select element for each selected ID', () => {
      component.selectComponentConfig.selectedIds = ['123'];
      component.ngOnInit();
      fixture.detectChanges();
      const selectElements = fixture.debugElement.queryAll(By.css('select'));
      expect(selectElements.length).toBe(1);
    });

    it('Should set empty state', () => {
      expect(component.state[0].getSelectedIds()).toEqual([]);
    });

    it('Should set state from selected IDs', () => {
      component.selectComponentConfig.selectedIds = ['123'];
      component.ngOnInit();
      expect(component.state[0].getSelectedIds()).toEqual(['123']);
    });
  });

  describe('addChainLink', () => {
    it('Should add chain link to the list', () => {
      component.addChainLink();
      expect(component.chainLinkList).toEqual([emptyChainLink, emptyChainLink]);
    });

    it('Should bind callback to the newly created link', () => {
      spyOn(component.selectChange, 'emit');
      component.addChainLink();
      fixture.detectChanges();
      const selectElement = fixture.debugElement.queryAll(By.css('select'))[1];
      selectElement.triggerEventHandler('click', new ListChange([]));
      expect(component.selectChange.emit).toHaveBeenCalledWith([
        jasmine.any(ListChange),
        jasmine.any(ListChange),
      ]);
    });
  });

  describe('removeChainLink', () => {
    it('Should remove chain link from the list at the corresponding index', () => {
      component.addChainLink();
      fixture.detectChanges();
      component.removeChainLink(1);
      fixture.detectChanges();
      const selectElements = fixture.debugElement.queryAll(By.css('select'));
      expect(selectElements.length).toEqual(1);
    });

    it('Should modify state', () => {
      component.addChainLink();
      component.removeChainLink(1);
      expect(component.state[1]).toBeUndefined();
    });

    it('Should emit change', () => {
      spyOn(component.selectChange, 'emit');
      component.addChainLink();
      component.removeChainLink(1);
      expect(component.selectChange.emit).toHaveBeenCalledWith(component.state);
    });
  });

  describe('activateChainLink', () => {
    it('Should insert the delete icon', () => {
      component.addChainLink();
      fixture.detectChanges();
      const chainLinkRow = fixture.debugElement.queryAll(By.css('.chain-link-row'))[1];
      chainLinkRow.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton).not.toBeNull();
    });
  });

  describe('deactivateChainLink', () => {
    it('Should remove the delete icon', () => {
      component.addChainLink();
      fixture.detectChanges();
      const chainLinkRow = fixture.debugElement.queryAll(By.css('.chain-link-row'))[1];
      chainLinkRow.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      chainLinkRow.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton).toBeNull();
    });
  });
});
