import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoStripComponent } from './info-strip.component';
import { IconColor, Icons } from '../../icons/icons.enum';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { IconComponent } from '../../icons/icon.component';

describe('InfoStripComponent', () => {
  let component: InfoStripComponent;
  let fixture: ComponentFixture<InfoStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(IconComponent),
        InfoStripComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoStripComponent);
    component = fixture.componentInstance;
    component.link = { url: 'https://app.hibob.com', text: 'Click here' };
    fixture.detectChanges();
  });

  it('icon color should be dark', () => {
    component.icon = Icons.baseline_info_icon;
    component.iconColor = IconColor.dark;
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('b-icon'));
    expect(iconElement.componentInstance.color).toEqual(IconColor.dark);
  });

  it('icon size should be xLarge', () => {
    component.icon = Icons.baseline_info_icon;
    component.iconColor = IconColor.dark;
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('b-icon'));
    expect(iconElement.componentInstance.size).toEqual('x-large');
  });

  it('icon should be baseline_info_icon', () => {
    component.icon = Icons.baseline_info_icon;
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('b-icon'));
    expect(iconElement.componentInstance.icon).toEqual('baseline_info_icon');
  });

  it('should check info strip text & link', () => {
    component.text = 'info strip text';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('.content .text')).nativeElement;
    const link = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(text.innerText).toBe('info strip text');
    expect(link.innerText).toBe('Click here');
    expect(link.href).toBe('https://app.hibob.com/');
  });
});
