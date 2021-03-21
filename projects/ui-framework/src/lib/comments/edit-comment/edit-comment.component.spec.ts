import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { COMMENT_ITEM, eventEnterShiftKey } from '../comments.mocks';
import { EditCommentComponent } from './edit-comment.component';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let fixture: ComponentFixture<EditCommentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AvatarModule, MatTooltipModule],
        declarations: [EditCommentComponent],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EditCommentComponent);
          component = fixture.componentInstance;
          component.placeholder = 'text of placeholder';
          component.comment = COMMENT_ITEM;
          fixture.detectChanges();
        });
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enterPress', () => {
    let sendCommentSpy;
    beforeEach(() => {
      sendCommentSpy = spyOn(component.sendComment as any, 'emit');
    });
    it('should not run if shiftKey === false', () => {
      component.enterPress(eventEnterShiftKey(false));
      expect(sendCommentSpy).toHaveBeenCalled();
    });
    it('should not run if shiftKey === false', () => {
      (component.commentInput.nativeElement as HTMLTextAreaElement).value =
        'some input update';
      fixture.detectChanges();
      component.enterPress(eventEnterShiftKey(false));
      expect(sendCommentSpy).toHaveBeenCalledWith({
        content: 'some input update',
      });
    });
    it('should run if shiftKey === true', () => {
      component.enterPress(eventEnterShiftKey(true));
      expect(sendCommentSpy).not.toHaveBeenCalled();
    });
  });
});
