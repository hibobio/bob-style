import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { AvatarSize } from './avatar.enum';
import { TypographyModule } from '../../typography/typography.module';
import { By } from '@angular/platform-browser';
import { forEach, values } from 'lodash';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarComponent ],
      imports: [ TypographyModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    spyOn(component.clicked, 'emit');
    fixture.detectChanges();
  });

  it('should create with default values', () => {
    expect(component).toBeTruthy();
    expect(component.size).toEqual(AvatarSize.mini);
  });

  describe('onClick', () => {
    it('Should emit the click event iof the component is set to be clickable', () => {
      component.isClickable = true;
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.clicked.emit).toHaveBeenCalledWith(e);
    });

    it('Should not emit the click event iof the component is set to not be clickable', () => {
      component.isClickable = false;
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('getClassNames', () => {
    it('Should return avatar class name when clickable', () => {
      component.isClickable = true;
      component.size = AvatarSize.large;
      const result = component.getClassNames();
      expect(result).toEqual('large clickable');
    });

    it('Should return avatar class name when not clickable', () => {
      component.isClickable = false;
      component.size = AvatarSize.medium;
      const result = component.getClassNames();
      expect(result).toEqual('medium');
    });
  });

  describe('Title and subtitle', () => {
    const sizes = values (AvatarSize);
    forEach ( sizes, (size) => {
      it('Avatar should have title for size ' + size, () => {
        component.title = `John Doe ${size}`;
        component.subtitle = `Web Developer ${size}`;
        component.size = size;
        fixture.detectChanges();
        const title = fixture.debugElement.queryAll(By.css(`.${size}-title `))[0];
        expect(title.nativeElement.innerText.toLowerCase()).toContain(`john doe ${size}`);
        expect(title.nativeElement.innerText.toLowerCase()).toContain(`web developer ${size}`);
      });
    })
  });
});
