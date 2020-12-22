import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddFileComponent } from './add-file.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { Icons } from '../../icons/icons.enum';
import { By } from '@angular/platform-browser';
import {
  emptyImg,
  emptyImgTestString,
} from '../../services/utils/test-helpers';

describe('AddFileComponent', () => {
  let fixture: ComponentFixture<AddFileComponent>;
  let component: AddFileComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddFileComponent],
      imports: [IconsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddFileComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('onClick', () => {
    it('should emit Clicked event', () => {
      component.onClick();
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });
  describe('icon', () => {
    it('Should set selectedIcon to pencil icon if image url ', () => {
      component.imageUrl = emptyImg;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('.' + Icons.edit_field_pencil)
      );
      expect(iconElement).toBeTruthy();
    });
    it('Should set original icon to pencil icon if no image url ', () => {
      component.icon = Icons.add_photo;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(
        By.css('.' + Icons.add_photo)
      );
      expect(iconElement).toBeTruthy();
    });
    it('Should set icon color to normal if no image url ', () => {
      const iconElement = fixture.debugElement.query(By.css('.b-icon'))
        .nativeElement;
      expect(iconElement.className).toContain('normal');
    });
    it('Should set icon color to white if image url ', () => {
      component.imageUrl = emptyImg;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('.b-icon'))
        .nativeElement;
      expect(iconElement.className).toContain('white');
    });
  });
  describe('container', () => {
    it('Should add edit-mode class if image url', () => {
      component.imageUrl = emptyImg;
      fixture.detectChanges();
      const elementContainerClasses = fixture.debugElement.query(
        By.css('.container')
      ).nativeElement.classList;
      expect(elementContainerClasses).toContain('edit-mode');
    });
    it('Should add background image url to style if backgroundImage', () => {
      component.imageUrl = emptyImg;
      fixture.detectChanges();
      const elementContainerStyle = fixture.debugElement
        .query(By.css('.container'))
        .nativeElement.getAttribute('style');
      expect(elementContainerStyle).toContain('background-image');
      expect(elementContainerStyle).toContain(emptyImgTestString);
    });
  });
});
