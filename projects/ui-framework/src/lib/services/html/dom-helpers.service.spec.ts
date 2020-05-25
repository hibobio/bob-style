import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DOMhelpers } from './dom-helpers.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../utils/utils.module';
import { elementFromFixture } from '../utils/test-helpers';

@Component({
  template: `
    <div class="test1" style="font-size: 20px; line-height: 2;">
      <p style="font-size: 10px; line-height: 1;">
        <span class="test-me">Test</span>
      </p>
    </div>

    <div class="test2">
      <p class="par1">
        <!-- HTML Comment -->
      </p>
      <p class="par2">
        <span></span>
      </p>
      <p class="par3">
        Hello
      </p>
    </div>

    <div class="test3">
      <p><!-- HTML Comment --></p>
      <div>
        <p class="right-one">
          <span> Hello </span>
          World
        </p>
      </div>
    </div>

    <div
      class="test4"
      style="box-sizing:border-box; width:300px; padding:20px; border:2px solid red;"
    ></div>
  `,
  providers: [DOMhelpers],
})
class TestComponent {
  constructor() {}
}

describe('DOMhelpers', () => {
  let fixture: ComponentFixture<TestComponent>;
  let testComponent: TestComponent;
  let DOM: DOMhelpers;
  let testDiv1: HTMLElement;
  let testDiv2: HTMLElement;
  let testDiv3: HTMLElement;
  let testDiv4: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [CommonModule, UtilsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DOMhelpers],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        DOM = TestBed.inject(DOMhelpers);

        testDiv1 = elementFromFixture(fixture, '.test1');
        testDiv2 = elementFromFixture(fixture, '.test2');
        testDiv3 = elementFromFixture(fixture, '.test3');
        testDiv4 = elementFromFixture(fixture, '.test4');
      });
  }));

  describe('setCssProps', () => {
    it('should set css properties on element', () => {
      DOM.setCssProps(testDiv2, {
        '--test': 'passed1',
        '--test2': 'passed2',
        '--test3': 'passed3',
      });
      expect(getComputedStyle(testDiv2).getPropertyValue('--test2')).toEqual(
        'passed2'
      );
    });
  });

  describe('getElementTextProps', () => {
    it('should return font-size and line-height of element as unitless numbers', () => {
      const testElem = testDiv1.querySelector('.test-me') as HTMLElement;
      const textProps = DOM.getElementTextProps(testElem);
      expect(textProps.fontSize).toEqual(10);
      expect(textProps.lineHeight).toEqual(1);
    });
  });

  describe('hasChildren', () => {
    it('should return boolean indicating if element has children elements', () => {
      const testElem = testDiv1.querySelector('.test-me') as HTMLElement;
      expect(DOM.hasChildren(testDiv2)).toEqual(true);
      expect(DOM.hasChildren(testElem)).toEqual(false);
    });
  });

  describe('hasChildrenWithText', () => {
    it('should return an object with the number of children with innerText and the index of first such child', () => {
      const testElem = testDiv2.querySelector('.par2') as HTMLElement;
      expect(DOM.hasChildrenWithText(testElem).total).toEqual(0);
      expect(DOM.hasChildrenWithText(testDiv2).total).toEqual(1);
      expect(DOM.hasChildrenWithText(testDiv2).firstIndex).toEqual(2);
    });
  });

  describe('hasTextNodes', () => {
    it('should return boolean indicating if element has text Nodes', () => {
      const testElem = testDiv2.querySelector('.par1') as HTMLElement;
      const testElem2 = testDiv3.querySelector('.right-one') as HTMLElement;
      expect(DOM.hasTextNodes(testElem)).toEqual(false);
      expect(DOM.hasTextNodes(testElem2)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('should return boolean indicating if element is empty (has no children or text nodes)', () => {
      const testElem = testDiv2.querySelector('.par1') as HTMLElement;
      const testElem2 = testDiv2.querySelector('.par2') as HTMLElement;
      const testElem3 = testDiv3.querySelector('.right-one') as HTMLElement;
      expect(DOM.isEmpty(testElem)).toEqual(true);
      expect(DOM.isEmpty(testElem2)).toEqual(false);
      expect(DOM.isEmpty(testElem3)).toEqual(false);
    });
  });

  describe('isTextNode', () => {
    it('should return true if node is a Text Node', () => {
      expect(DOM.isTextNode(testDiv1)).toEqual(false);
      expect(
        DOM.isTextNode(testDiv1.querySelector('.test-me').childNodes[0])
      ).toEqual(true);
    });
  });

  describe('getTextNode', () => {
    it('should return Text Node or undefined', () => {
      const testElem = testDiv1.querySelector('.test-me') as HTMLElement;
      expect(DOM.getTextNode(testElem).textContent).toEqual('Test');
      expect(DOM.getTextNode(testDiv4)).toEqual(undefined);
    });
  });

  describe('getDeepTextNode', () => {
    it('should return nested Text Node or false', () => {
      expect(DOM.getDeepTextNode(testDiv1).textContent).toEqual('Test');
      expect(DOM.getDeepTextNode(testDiv4) as any).toEqual(false);
    });
  });

  describe('isElement', () => {
    it('should return true if node is an Element', () => {
      const testElem = testDiv1.querySelector('.test-me') as HTMLElement;
      expect(DOM.isElement(testDiv1)).toEqual(true);
      expect(DOM.isElement(testElem.childNodes[0])).toEqual(false);
    });
  });

  describe('hasInnerText', () => {
    it('should return true is element has text inside', () => {
      expect(DOM.hasInnerText(testDiv1)).toEqual(true);
      expect(DOM.hasInnerText(testDiv4)).toEqual(false);
    });
  });

  describe('getInnerWidth', () => {
    it('should return element width minus padding and border', () => {
      expect(DOM.getInnerWidth(testDiv4)).toEqual(300 - 20 * 2 - 2 * 2);
      testDiv4.style.width = '0px';
      expect(DOM.getInnerWidth(testDiv4)).toEqual(0);
    });
  });

  describe('getDeepTextElement', () => {
    it('should return deepest element that has text or multiple children with text or combination of above', () => {
      const testElem = testDiv3.querySelector('.right-one') as HTMLElement;
      expect(DOM.getDeepTextElement(testElem).classList).toContain('right-one');
      expect(DOM.getDeepTextElement(testDiv1).innerText).toEqual('Test');
    });
  });

  describe('bindClasses', () => {
    it('should bind 3 classes passed as a string', () => {
      const classStr = 'class1 class2 class3';
      const result = DOM.bindClasses(testDiv4, classStr);
      expect(testDiv4.className).toEqual(classStr + ' test4');
      expect(result).toEqual({
        class1: true,
        class2: true,
        class3: true,
        test4: true,
      });
    });
    it('should bind 3 classes passed as a string[]', () => {
      const classStr = 'class1 class2 class3';
      const classArr = ['class1', 'class2', 'class3'];
      const result = DOM.bindClasses(testDiv4, classArr);
      expect(testDiv4.className).toEqual(classStr + ' test4');
      expect(result).toEqual({
        class1: true,
        class2: true,
        class3: true,
        test4: true,
      });
    });
    it('should bind 3 classes passed as an NgClass object', () => {
      const classStr = 'class1 class2 class3';
      const classObj = { class1: true, class2: true, class3: true };
      const result = DOM.bindClasses(testDiv4, classObj);
      expect(testDiv4.className).toEqual(classStr + ' test4');
      expect(result).toEqual({
        class1: true,
        class2: true,
        class3: true,
        test4: true,
      });
    });
    it('should not bind class from NgClass object that has falsey value', () => {
      const classObj = { class1: true, class2: true, class3: false };
      const result = DOM.bindClasses(testDiv4, classObj);
      expect(testDiv4.className).toEqual('class1 class2 test4');
      expect(result).toEqual({
        class1: true,
        class2: true,
        class3: false,
        test4: true,
      });
    });
    it('should not do anythinig if empty classes passed', () => {
      expect(DOM.bindClasses(testDiv4, '')).toEqual({ test4: true });
      expect(DOM.bindClasses(testDiv4, [])).toEqual({ test4: true });
      expect(DOM.bindClasses(testDiv4, null)).toEqual({ test4: true });
      expect(DOM.bindClasses(testDiv4, undefined)).toEqual({ test4: true });
      expect(DOM.bindClasses(testDiv4, {})).toEqual({ test4: true });
      expect(testDiv4.className).toEqual('test4');
    });
    it('should remove existing class if NgClass object  has this key with falsey value', () => {
      const classObj = { class1: true, class2: true, test4: false };
      const result = DOM.bindClasses(testDiv4, classObj);
      expect(testDiv4.className).toEqual('class1 class2');
      expect(result).toEqual({ class1: true, class2: true, test4: false });
    });

    it('should result in the right classlist', () => {
      DOM.bindClasses(testDiv4, 'class1 class2');
      DOM.bindClasses(testDiv4, {
        class1: true,
        class2: false,
        test: true,
        test4: true,
      });
      DOM.bindClasses(testDiv4, ['class2', 'class3']);
      const result = DOM.bindClasses(testDiv4, { test: false, test4: false });
      expect(testDiv4.className).toEqual('class1 class2 class3');
      expect(result).toEqual({
        class1: true,
        class2: true,
        class3: true,
        test: false,
        test4: false,
      });
    });
  });
});
