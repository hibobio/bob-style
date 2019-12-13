import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkComponent } from './link.component';
import { By } from '@angular/platform-browser';
import { LinkColor, LinkTarget } from './link.enum';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    component.config = {
      url: 'https://app.hibob.com', text: 'Learn more', color: LinkColor.primary, target: LinkTarget.blank };
    fixture.detectChanges();
  });

  it('link should be with the right url and text', () => {
    const aElement = fixture.debugElement.query(By.css('a'));
    expect(aElement.componentInstance.config.text).toEqual('Learn more');
    expect(aElement.componentInstance.config.url).toEqual('https://app.hibob.com');
  });

  it('link should open in new window', () => {
    const aElement = fixture.debugElement.query(By.css('a'));
    expect(aElement.properties.target).toEqual('_blank');
  });

  it('link color should be primary', () => {
    const aElement = fixture.debugElement.query(By.css('a'));
    expect(aElement.classes.primary).toBeTruthy();
  });
});
