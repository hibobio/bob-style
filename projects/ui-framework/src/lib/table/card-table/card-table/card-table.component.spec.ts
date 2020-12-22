import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardTableComponent } from './card-table.component';
import { CardTableModule } from '../card-table.module';
import { CellWidthsService } from '../cell-widths-service/cell-widths.service';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// tslint:disable-next-line: max-line-length
import { ComponentRendererComponent } from '../../../services/component-renderer/component-renderer.component';
import { ButtonComponent } from '../../../buttons/button/button.component';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TruncateTooltipModule } from '../../../popups/truncate-tooltip/truncate-tooltip.module';

describe('CardTableComponent', () => {
  let fixture: ComponentFixture<CardTableComponent>;
  let component: CardTableComponent;

  let componentRenderer: ComponentRendererComponent;
  let tableHeaderElement: HTMLElement;
  let tableBodyElement: HTMLElement;
  let buttonElement: HTMLElement;
  let cardElement: HTMLElement;

  let testVar = 'hello';

  const CardTableMockMetaData = [
    {
      name: 'title1',
      width: 25,
    },
    {
      name: 'title2',
      textStyle: {
        fontWeight: '500',
      },
    },
    { name: 'title3' },
    { name: 'title4' },
    {
      name: 'title5',
      width: 15,
      align: 'right',
    },
  ];

  const CardTableMockData = [
    [
      { data: 'text1', class: 'test-class' },
      { data: 'text2' },
      { data: ['text3', 'text4'] },
      {},
      {
        data: {
          component: ButtonComponent,
          attributes: {
            type: 'secondary',
          },
          content: 'Button',
          handlers: {
            clicked: () => {
              testVar = 'bye';
            },
          },
        },
      },
    ],
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        CardTableModule,
        ButtonsModule,
        TruncateTooltipModule,
      ],
      providers: [CellWidthsService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ButtonComponent],
        },
      })
      .overrideComponent(CardTableComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardTableComponent);
        component = fixture.componentInstance;
        component.meta = CardTableMockMetaData;
        component.table = CardTableMockData;
        fixture.detectChanges();

        tableBodyElement = fixture.debugElement.query(
          By.css('.card-table-body')
        ).nativeElement;

        tableHeaderElement = fixture.debugElement.query(
          By.css('.card-table-header')
        ).nativeElement;

        cardElement = tableBodyElement.children[0] as HTMLElement;

        componentRenderer = fixture.debugElement.query(
          By.css('b-component-renderer')
        ).componentInstance;

        buttonElement = fixture.debugElement.query(By.css('b-button button'))
          .nativeElement;

        spyOn(component.rowClicked, 'emit');
        spyOn(component.cellClicked, 'emit');
      });
  }));

  describe('Table layout', () => {
    it('should create table header with 5 cells', () => {
      expect(tableHeaderElement.children.length).toEqual(5);
    });
    it('should create table body with  1 row of 5 cells', () => {
      expect(tableBodyElement.children.length).toEqual(1);
      expect(cardElement.children.length).toEqual(5);
    });
  });

  describe('Table content', () => {
    it('should put column names in header row', () => {
      expect(tableHeaderElement.children[2].children[0].innerHTML).toEqual(
        'title3'
      );
    });
    it('should put two lines of text in 3rd column', () => {
      fixture.detectChanges();
      expect(cardElement.children[2].children.length).toEqual(2);
      expect((cardElement.children[2] as HTMLElement).innerText).toContain(
        'text4'
      );
    });
    it('should put a "-" symbol if cell data is missing', () => {
      fixture.detectChanges();
      expect((cardElement.children[3] as HTMLElement).innerText.trim()).toEqual(
        '—'
      );
    });
  });

  describe('Table Cell styles', () => {
    it('should attach widths and text styles to cells', () => {
      const cellStyleAttributeValue = cardElement.children[1]
        .getAttribute('style')
        .replace(/\s/g, '');
      expect(cellStyleAttributeValue).toEqual('max-width:20%;font-weight:500;');
    });
    it('should attach widths but not text styles to header cells', () => {
      const cellStyleAttributeValue = tableHeaderElement.children[1]
        .getAttribute('style')
        .replace(/\s/g, '');
      expect(cellStyleAttributeValue).toEqual('max-width:20%;');
    });
    it('should attach proper align style', () => {
      const cellStyleAttributeValue = cardElement.children[4].getAttribute(
        'style'
      );
      expect(cellStyleAttributeValue).toContain('flex-end');
    });
  });

  describe('Custom cell class', () => {
    it('should attach a custom class passed with table data', () => {
      const cellElement = fixture.debugElement.query(
        By.css('[b-table-card-cell]:nth-child(1)')
      ).nativeElement;
      expect(cellElement.classList).toContain('test-class');
    });
  });

  describe('Component injection', () => {
    it('should insert ButtonComponent', () => {
      expect(buttonElement).toBeTruthy();
      expect(buttonElement.innerText).toEqual('Button');
    });
    it('should attach handler to Button click', () => {
      buttonElement.click();
      expect(testVar).toEqual('bye');
    });
  });

  describe('Default text when no table data', () => {
    it('should display default text if table is empty', () => {
      component.table = [];
      fixture.detectChanges();
      const emptyTableElement = fixture.debugElement.query(
        By.css('.table-card-empty')
      ).nativeElement;
      expect(emptyTableElement).toBeTruthy();
      expect(emptyTableElement.textContent.trim()).toEqual(
        'No data to display'
      );
    });
    it('should display text passed via [default] input if table is empty', () => {
      component.table = undefined;
      component.default = 'Boom';
      fixture.detectChanges();
      const emptyTableElement = fixture.debugElement.query(
        By.css('.table-card-empty')
      ).nativeElement;
      expect(emptyTableElement.textContent.trim()).toEqual('Boom');
    });
  });

  describe('Output events', () => {
    it('clicking on a row should output both cellClicked and rowClicked event', () => {
      const cellElement = fixture.debugElement.query(
        By.css('[b-table-card-cell]:nth-child(2)')
      ).nativeElement;
      cellElement.click();
      expect(component.rowClicked.emit).toHaveBeenCalled();
      expect(component.cellClicked.emit).toHaveBeenCalled();
    });
    it('clicking on a button should not output cellClicked and rowClicked events', () => {
      buttonElement.click();
      expect(component.rowClicked.emit).not.toHaveBeenCalled();
      expect(component.cellClicked.emit).not.toHaveBeenCalled();
    });
  });
});
