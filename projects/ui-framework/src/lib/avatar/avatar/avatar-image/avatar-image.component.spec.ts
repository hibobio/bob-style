import {
  ComponentFixture,
  async,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import { AvatarImageComponent } from './avatar-image.component';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { isEqual } from 'lodash';
import {
  simpleChange,
  emitNativeEvent,
} from '../../../services/utils/test-helpers';
import { AvatarSize, AvatarBadge } from '../avatar.enum';
import { Icons, IconColor, IconSize } from '../../../icons/icons.enum';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { stringify } from '../../../services/utils/functional-utils';

interface AttrCheck {
  role: string;
  disabled: string;
  tabindex: string;
  size: string;
  iconBefore: string;
  iconBeforeSize: string;
  iconBeforeColor: string;
  iconAfter: string;
  iconAfterSize: string;
  iconAfterColor: string;
  class: string;
  varSize: string;
  varBgColor: string;
  varImg: string;
}

const imgMock = '#filestack?align=faces';

const defautlAttrs: AttrCheck = {
  role: 'img',
  disabled: null,
  tabindex: null,
  size: 'mini',
  iconBefore: 'person',
  iconBeforeSize: 'medium',
  iconBeforeColor: 'normal',
  iconAfter: null,
  iconAfterSize: 'small',
  iconAfterColor: null,
  class: 'avatar',
  varSize: '36px',
  varBgColor: '#f3f2f2',
  varImg: 'none',
};

const defaultAttrsWithImg: Partial<AttrCheck> = {
  varImg: `url(${imgMock})`,
  iconBefore: null,
  iconBeforeColor: 'white',
};

const checkAttrubutes = (
  elem: HTMLElement,
  expected: Partial<AttrCheck> = defautlAttrs
): boolean => {
  expected = Object.assign({}, defautlAttrs, expected);

  const trim = smth => (smth ? smth.trim().replace(/\\/g, '') : smth);

  const reality = {
    role: trim(elem.getAttribute('role')) || null,
    disabled: trim(elem.getAttribute('data-disabled')) || null,
    tabindex: trim(elem.getAttribute('tabindex')) || null,
    size: trim(elem.getAttribute('data-size')) || null,
    iconBefore: trim(elem.getAttribute('data-icon-before')) || null,
    iconBeforeSize: trim(elem.getAttribute('data-icon-before-size')) || null,
    iconBeforeColor: trim(elem.getAttribute('data-icon-before-color')) || null,
    iconAfter: trim(elem.getAttribute('data-icon-after')) || null,
    iconAfterSize: trim(elem.getAttribute('data-icon-after-size')) || null,
    iconAfterColor: trim(elem.getAttribute('data-icon-after-color')) || null,
    class: trim(elem.className) || null,
    varSize:
      trim(DOMhelpers.prototype.getElementCSSvar(elem, '--avatar-size')) ||
      null,
    varBgColor:
      trim(DOMhelpers.prototype.getElementCSSvar(elem, '--bg-color')) || null,
    varImg:
      trim(DOMhelpers.prototype.getElementCSSvar(elem, '--avatar-image')) ||
      null,
  };

  return isEqual(expected, reality) || reality;
};

describe('AvatarImageComponent', () => {
  let component: AvatarImageComponent;
  let fixture: ComponentFixture<AvatarImageComponent>;
  let componentElem: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarImageComponent],
      imports: [],
      providers: [DOMhelpers, EventManagerPlugins[0]],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AvatarImageComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        componentElem = fixture.nativeElement;

        DOMhelpers.prototype.injectStyles(`
          .html-reporter .result-message {
            white-space: pre-line !important;
            margin-bottom: 14px;
            line-height: 2;
            max-width: 700px;
          }
          .html-reporter .stack-trace {
            white-space: pre-line !important;
          }
        `);
      });
  }));

  describe('Default view, no inputs', () => {
    it('Should display mini icon with Person icon, no badge and other default attributes', fakeAsync(() => {
      flush();
      expect(checkAttrubutes(componentElem, defautlAttrs)).toBe(
        true,
        'Should contain: ' + stringify(defautlAttrs)
      );
    }));
  });

  describe('Avatar imageSource & size', () => {
    it('Should display large Avatar with testImage', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          size: AvatarSize.large,
          imageSource: imgMock,
        })
      );

      flush();

      const expected = {
        ...defaultAttrsWithImg,
        size: 'large',
        varSize: '120px',
        iconBeforeSize: 'x-large',
        iconAfterSize: 'large',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));
  });

  describe('Avatar backgroundColor & disabled', () => {
    it('Should display medium Avatar with testImage and bgcolor red', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          size: AvatarSize.medium,
          imageSource: imgMock,
          backgroundColor: 'red',
          disabled: true,
          iconAfterSize: 'large',
        })
      );

      flush();

      const expected = {
        ...defaultAttrsWithImg,
        size: 'medium',
        varSize: '90px',
        varBgColor: 'red',
        disabled: 'true',
        iconBeforeSize: 'x-large',
        iconAfterSize: 'large',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));
  });

  describe('Avatar icon', () => {
    it('Should display mini Avatar with no image and Save icon in normal color', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          icon: Icons.save,
        })
      );

      flush();

      const expected = {
        iconBefore: 'save',
        iconBeforeColor: 'normal',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));

    // tslint:disable-next-line: max-line-length
    it('Should display mini Avatar with test image, Settings icon in white color and icon-on-hover class', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          imageSource: imgMock,
          icon: Icons.settings,
        })
      );

      flush();

      const expected = {
        ...defaultAttrsWithImg,
        iconBefore: 'settings',
        iconBeforeColor: 'white',
        class: 'avatar icon-on-hover',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));

    it('Should display mini Avatar with no image and custom icon', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          icon: {
            icon: Icons.search,
            size: IconSize.large,
            color: IconColor.negative,
          },
        })
      );

      flush();

      const expected = {
        iconBefore: 'search',
        iconBeforeSize: 'large',
        iconBeforeColor: 'negative',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));

    // tslint:disable-next-line: max-line-length
    it('Should display mini Avatar with test image, custom icon NOT in white color and icon-on-hover class', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          imageSource: imgMock,
          icon: {
            icon: Icons.success,
            size: IconSize.large,
            color: IconColor.negative,
          },
        })
      );

      flush();

      const expected = {
        ...defaultAttrsWithImg,
        iconBefore: 'success',
        iconBeforeSize: 'large',
        iconBeforeColor: 'negative',
        class: 'avatar icon-on-hover',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));
  });

  describe('Avatar badge', () => {
    it('Should display mini Avatar with testImage and Pending badge', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          imageSource: imgMock,
          badge: AvatarBadge.pending,
        })
      );

      flush();

      const expected = {
        ...defaultAttrsWithImg,
        iconAfter: 'watch',
        iconAfterColor: 'primary',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));

    it('Should display mini Avatar with testImage and custom badge icon', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          imageSource: imgMock,
          badge: {
            icon: Icons.question_mark,
            color: IconColor.positive,
          },
        })
      );

      flush();

      const expected = {
        ...defaultAttrsWithImg,
        iconAfter: 'question-mark',
        iconAfterColor: 'positive',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));
  });

  describe('Avatar clickable', () => {
    beforeEach(fakeAsync(() => {
      component.clicked.subscribe(() => {});

      component.ngOnChanges(
        simpleChange({
          imageSource: undefined,
        })
      );
      flush();

      spyOn(component.clicked, 'emit');
    }));

    it('Should emit Clicked event on click', () => {
      emitNativeEvent(componentElem);
      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('Should add has-hover class and tabindex attribute', fakeAsync(() => {
      const expected = {
        class: 'avatar has-hover',
        tabindex: '0',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));
  });

  describe('Ng-content', () => {
    it('Should not add icon if ng-content is passed', fakeAsync(() => {
      componentElem.innerHTML = '<span>hello world</span>';

      component.ngOnChanges(
        simpleChange({
          imageSource: imgMock,
          icon: Icons.settings,
        })
      );
      component.ngAfterViewInit();
      flush();

      const expected = {
        ...defaultAttrsWithImg,
        iconBefore: null,
        class: 'avatar has-content icon-on-hover',
      };

      expect(checkAttrubutes(componentElem, expected)).toBe(
        true,
        'Should contain: ' + stringify(expected)
      );
    }));
  });
});
