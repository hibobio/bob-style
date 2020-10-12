import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChainSelectComponent } from './chain-select.component';
import { IconsModule } from '../../icons/icons.module';
import { By } from '@angular/platform-browser';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ChainSelectDirective } from './chain-select.directive';
import { simpleChange } from '../../services/utils/functional-utils';
import { ChainSelectEvent } from './chain-select.interface';

describe('EmployeeChainSelectComponent', () => {
  let component: ChainSelectComponent;
  let fixture: ComponentFixture<ChainSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChainSelectComponent, ChainSelectDirective],
      imports: [CommonModule, IconsModule, ButtonsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('Should replace null values in selectedItemList', () => {
      component.ngOnChanges(
        simpleChange({
          selectedItemList: [1, null, 3],
        })
      );
      expect(component.chainLinkList).toEqual([1, undefined, 3]);
    });
  });

  describe('addChainLink', () => {
    it('Should add chain link to the list', () => {
      component.addChainLink();
      expect(component.chainLinkList).toEqual([undefined, undefined]);
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('.chain-link-row'));
      expect(rows.length).toEqual(2);
    });
  });

  describe('removeChainLink', () => {
    it('Should remove chain link from the list at the corresponding index', () => {
      component.addChainLink();
      fixture.detectChanges();
      component.removeChainLink(1);
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('.chain-link-row'));
      expect(rows.length).toEqual(1);
    });

    it('Should emit change', () => {
      spyOn(component.selectChange, 'emit');
      component.addChainLink();
      component.removeChainLink(1);
      expect(component.selectChange.emit).toHaveBeenCalledWith({
        event: 'delete',
        index: 1,
      });
    });
  });

  describe('handleChange', () => {
    it('Should emit change', () => {
      spyOn(component.selectChange, 'emit');
      component.handleChange({} as ChainSelectEvent, 0);
      expect(component.selectChange.emit).toHaveBeenCalledWith({
        event: {},
        index: 0,
      });
    });
  });

  describe('static mode', () => {
    it('Should hide add button', () => {
      component.staticMode = true;
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-chain-link'));
      expect(addButton).toBeNull();
    });

    it('Should hide delete button', () => {
      component.staticMode = true;
      component.addChainLink();
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.queryAll(
        By.css('.delete-button')
      );
      expect(deleteButton.length).toEqual(0);
    });

    it('Should hide last arrow', () => {
      component.staticMode = true;
      component.addChainLink();
      fixture.detectChanges();
      const arrow = fixture.debugElement.queryAll(By.css('.then'));
      expect(arrow.length).toEqual(1);
    });
  });
});
