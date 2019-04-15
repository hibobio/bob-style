import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoStripComponent} from './info-strip.component';
import {IconColor, Icons} from '../../icons/icons.enum';
import {IconsModule} from '../../icons/icons.module';
import {By} from '@angular/platform-browser';

describe('InfoStripComponent', () => {
  let component: InfoStripComponent;
  let fixture: ComponentFixture<InfoStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoStripComponent ],
      imports: [IconsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show passed icon & color', () => {
    component.icon = Icons.baseline_info_icon;
    component.iconColor = IconColor.dark;
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('b-icon'));
    expect(iconElement.componentInstance.color).toEqual(IconColor.dark);
  });
});
