import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChainSelectComponent } from './chain-select.component';
import { IconsModule } from '../../../icons/icons.module';
import { By } from '@angular/platform-browser';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { ChainSelectDirective } from './chain-select.directive';

describe('EmployeeChainSelectComponent', () => {
  let component: ChainSelectComponent;
  let fixture: ComponentFixture<ChainSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChainSelectComponent,
        ChainSelectDirective,
      ],
      imports: [
        CommonModule,
        IconsModule,
        ButtonsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('Should replace null values in selectedItemList', () => {
      component.selectedItemList = [1, null, 3];
      component.ngOnInit();
      expect(component.chainLinkList).toEqual([1, {}, 3]);
    });
  });

  describe('addChainLink', () => {
    it('Should add chain link to the list', () => {
      component.addChainLink();
      expect(component.chainLinkList).toEqual([{}, {}]);
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
      expect(component.selectChange.emit).toHaveBeenCalledWith({ event: 'delete', index: 1 });
    });
  });

  describe('handleChange', () => {
    it('Should emit change', () => {
      spyOn(component.selectChange, 'emit');
      component.handleChange({}, 0);
      expect(component.selectChange.emit).toHaveBeenCalledWith({ event: {}, index: 0 });
    });
  });
});
