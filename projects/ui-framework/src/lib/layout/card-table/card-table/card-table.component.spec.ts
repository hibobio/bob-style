import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardTableComponent } from './card-table.component';
import { CardTableModule } from '../card-table.module';
import { CellWidthsService } from '../cell-widths-service/cell-widths.service';

import { ComponentRendererComponent } from '../../../services/component-renderer/component-renderer.component';

import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { ButtonComponent } from '../../../buttons-indicators/buttons/button/button.component';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('CardTableComponent', () => {
  let fixture: ComponentFixture<CardTableComponent>;
  let component: CardTableComponent;

  let componentRenderer: ComponentRendererComponent;
  let tableHeaderElement: HTMLElement;
  let tableBodyElement: HTMLElement;
  let buttonElement: HTMLElement;

  let testVar = 'hello';

  const CardTableMockMetaData = [
    {
      name: 'title1',
      width: 25
    },
    {
      name: 'title2',
      textStyle: {
        fontWeight: '500'
      }
    },
    { name: 'title3' },
    { name: 'title4' },
    {
      name: 'title5',
      width: 15,
      align: 'right'
    }
  ];

  const CardTableMockData = [
    [
      { data: 'text1' },
      { data: 'text2' },
      { data: ['text3', 'text4'] },
      { data: 'text5' },
      {
        data: {
          component: ButtonComponent,
          attributes: {
            type: 'secondary'
          },
          content: 'Button',
          handlers: {
            clicked: () => {
              testVar = 'bye';
            }
          }
        }
      }
    ]
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [BrowserAnimationsModule, CardTableModule, ButtonsModule],
      providers: [CellWidthsService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ButtonComponent]
        }
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

        componentRenderer = fixture.debugElement.query(
          By.css('b-component-renderer')
        ).componentInstance;

        buttonElement = fixture.debugElement.query(
          By.css('b-button .mat-button')
        ).nativeElement;
      });
  }));

  describe('Table layout', () => {
    it('should create table header with 5 cells', () => {
      expect(tableHeaderElement.children.length).toEqual(5);
    });
    it('should create table body with  1 row of 5 cells', () => {
      expect(tableBodyElement.children.length).toEqual(1);
      expect(tableBodyElement.children[0].children.length).toEqual(5);
    });
  });

  describe('Table content', () => {
    it('should put column names in header row', () => {
      expect(tableHeaderElement.children[2].children[0].innerHTML).toEqual(
        'title3'
      );
    });
    it('should put two lines of text in 3rd column', () => {
      expect(tableBodyElement.children[0].children[2].children.length).toEqual(
        2
      );
      expect(
        tableBodyElement.children[0].children[2].children[1].innerHTML
      ).toEqual('text4');
    });
  });

  describe('Table Cell styles', () => {
    it('should attach widths and text styles to cells', () => {
      const cellStyleAttributeValue = tableBodyElement.children[0].children[1]
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
});
