import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TextColoredLinksComponent} from './text-colored-links.component';
import {actionMock, COLOR_TEXT_ITEMS} from './text-colored-links.mocks';
import {InfoGraphicItem} from '../text-colored-links.interface';

describe('TextColoredLinksComponent', () => {
  let component: TextColoredLinksComponent;
  let fixture: ComponentFixture<TextColoredLinksComponent>;

  const infoGraphicItemsMock: InfoGraphicItem[] = [
  {
    styles: {
      color: '#e52c51',
      fontSize: '30px',
      fontStyle: 'italic',
      fontWeight: '800'
    },
    label: '45% of our people are female'
  }, {
    styles: {
      color: '#8f233d',
      fontSize: '38px',
      fontStyle: 'italic',
      fontWeight: '800'
    },
    label: '55% are male'
  }, {
    styles: {
      color: '#f38161',
      fontSize: '38px',
      fontStyle: 'italic',
      fontWeight: '700'
    },
    label: '24% are parents'
  }, {
    styles: {
      color: '#f57738',
      fontSize: '35px',
      fontStyle: 'italic',
      fontWeight: '700'
    },
    label: '21% are in London'
  }, {
    styles: {
      color: '#535353',
      fontSize: '35px',
      fontStyle: 'normal',
      fontWeight: '400'
    },
    label: '26% play football'
  }, {
    styles: {
      color: '#9d9d9d',
      fontSize: '35px',
      fontStyle: 'normal',
      fontWeight: '300'
    },
    label: '24% like film'
  }, {
    styles: {
      color: '#e52c51',
      fontSize: '38px',
      fontStyle: 'italic',
      fontWeight: '500'
    },
    label: '21% like cycling'
  }, {
    styles: {
      color: '#8f233d',
      fontSize: '30px',
      fontStyle: 'italic',
      fontWeight: '500'
    },
    label: '19% practice yoga'
  }, {
    styles: {
      color: '#f38161',
      fontSize: '35px',
      fontStyle: 'normal',
      fontWeight: '700'
    },
    label: '17% like cooking'
  }, {
    styles: {
      color: '#f57738',
      fontSize: '30px',
      fontStyle: 'italic',
      fontWeight: '700'
    },
    label: '17% like pilates'
  }].map((item) => {
    (item as InfoGraphicItem).action = actionMock;
    return item;
  });

  beforeEach(waitForAsync(() => {
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
