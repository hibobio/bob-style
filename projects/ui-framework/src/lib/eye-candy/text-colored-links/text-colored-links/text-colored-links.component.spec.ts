import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextColoredLinksComponent} from './text-colored-links.component';
import {actionMock, COLOR_TEXT_ITEMS} from './text-colored-links.mocks';
import {InfoGraphicItem} from '../text-colored-links.interface';

describe('TextColoredLinksComponent', () => {
  let component: TextColoredLinksComponent;
  let fixture: ComponentFixture<TextColoredLinksComponent>;

  const infoGraphicItemsMock: InfoGraphicItem[] = [{
    'color': '#e52c51',
    'size': 'size-sm',
    'font': 'sentinel-medium-italic',
    'label': '45% of our people are female'
  }, {
    'color': '#8f233d',
    'size': 'size-lg',
    'font': 'sentinel-regular-italic',
    'label': '55% are male'
  }, {
    'color': '#f38161',
    'size': 'size-lg',
    'font': 'sentinel-regular',
    'label': '24% are parents'
  }, {
    'color': '#f57738',
    'size': 'size-md',
    'font': 'sentinel-bold',
    'label': '21% are in London'
  }, {
    'color': '#535353',
    'size': 'size-lg',
    'font': 'sentinel-light',
    'label': '26% play football'
  }, {
    'color': '#9d9d9d',
    'size': 'size-lg',
    'font': 'sentinel-bold',
    'label': '24% like film'
  }, {
    'color': '#e52c51',
    'size': 'size-lg',
    'font': 'sentinel-bold-italic',
    'label': '21% like cycling'
  }, {
    'color': '#8f233d',
    'size': 'size-md',
    'font': 'sentinel-regular',
    'label': '19% practice yoga'
  }, {
    'color': '#f38161',
    'size': 'size-lg',
    'font': 'sentinel-bold',
    'label': '17% like cooking'
  }, {'color': '#f57738',
    'size': 'size-md',
    'font': 'sentinel-regular-italic',
    'label': '17% like pilates'}
  ].map((item) => {
    (item as InfoGraphicItem).action = actionMock;
    return item;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextColoredLinksComponent]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(TextColoredLinksComponent);
      component = fixture.componentInstance;
      component.colorTextItems = COLOR_TEXT_ITEMS;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      // component.colorTextItems = COLOR_TEXT_ITEMS;
      component.ngOnChanges();
      fixture.detectChanges();

    });
    it('should run onChanges function', () => {
      expect(component.infoGraphicItems).toBeTruthy();
    });
    it('should infoGraphicItems length be same as Color text items length', () => {
      expect(component.infoGraphicItems.length).toEqual(COLOR_TEXT_ITEMS.length);
    });
    it('should text in infoGraphicItems remain the same', () => {
      expect(component.infoGraphicItems[0].label).toEqual(COLOR_TEXT_ITEMS[0].label);
    });
  });
  describe('onItemClick', () => {
    beforeEach(() => {
      component.ngOnChanges();
      fixture.detectChanges();
      spyOn(infoGraphicItemsMock[0], 'action');
    });
    it('should onItemClick run action if has one', () => {
      component.onItemClick(infoGraphicItemsMock[0]);
      expect(infoGraphicItemsMock[0].action).toHaveBeenCalledWith(infoGraphicItemsMock[0]);
    });
    it('should onItemClick not run if theres no action', () => {
      const mockClicked = infoGraphicItemsMock[1];
      delete mockClicked.action;
      component.onItemClick(mockClicked);
      expect(infoGraphicItemsMock[0].action).not.toHaveBeenCalled();
    });
    it('should infoGraphicItems length be same as Color text items length', () => {
      expect(component.infoGraphicItems.length).toEqual(COLOR_TEXT_ITEMS.length);
    });
    it('should text in infoGraphicItems remain the same', () => {
      expect(component.infoGraphicItems[0].label).toEqual(COLOR_TEXT_ITEMS[0].label);
    });
  });
  describe('trackByText', () => {
    it('should trackByText return label', () => {
      const result = component.trackByText(1, infoGraphicItemsMock[1]);
      expect(result).toEqual(infoGraphicItemsMock[1].label);
    });
  });
});
