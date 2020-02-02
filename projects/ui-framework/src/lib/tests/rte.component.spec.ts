// import {
//   async,
//   ComponentFixture,
//   TestBed,
//   inject,
//   fakeAsync,
//   tick,
//   flush,
// } from '@angular/core/testing';
// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { By } from '@angular/platform-browser';

// import {
//   ReactiveFormsModule,
//   FormControl,
//   FormsModule,
//   FormGroup,
// } from '@angular/forms';

// import { RichTextEditorComponent } fro../form-elements/rich-text-editor/rte.componentent';
// import { RteUtilsService } fro../form-elements/rich-text-editor/rte-core/rte-utils.serviceice';
// import { RTEType, BlotType } fro../form-elements/rich-text-editor/rte-core/rte.enumnum';
// import Quill from 'quill';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { OverlayContainer } from '@angular/cdk/overlay';
// import { Platform } from '@angular/cdk/platform';
// import { simpleChange } fro../services/utils/test-helpersers';
// import { RichTextEditorModule } fro../form-elements/rich-text-editor/rte.moduleule';
// import { placeholderMock } fro../form-elements/rich-text-editor/rte-placeholder/rte-placeholder.mockock';

// @Component({
//   template: `
//     <form class="form" [formGroup]="rteForm">
//       <b-rich-text-editor
//         [label]="'label text'"
//         [placeholder]="'placeholder text'"
//         [sendChangeOnWrite]="true"
//         formControlName="rteControl"
//         (focused)="onFocus()"
//         (blurred)="onBlur()"
//       ></b-rich-text-editor>
//     </form>
//   `,
//   providers: [],
// })
// class TestComponent implements OnInit, OnDestroy {
//   constructor() {}
//   rteForm: any;
//   rtrValue: string;
//   subscr;

//   ngOnInit(): void {
//     this.rteForm = new FormGroup({
//       rteControl: new FormControl('', { updateOn: 'change' }),
//     });
//     this.subscr = this.rteForm
//       .get('rteControl')
//       .valueChanges.subscribe(value => {
//         this.rtrValue = value;
//       });
//   }
//   ngOnDestroy(): void {
//     if (this.subscr) {
//       this.subscr.unsubscribe();
//     }
//   }

//   onFocus() {}
//   onBlur() {}
// }

// describe('RichTextEditorComponent', () => {
//   let fixture: ComponentFixture<TestComponent>;
//   let testComponent: TestComponent;

//   let RTEComponent: RichTextEditorComponent;
//   let RTEnativeElement: HTMLElement;
//   let RTEeditorNativeElement: HTMLElement;
//   let platform: Platform;
//   let overlayContainer: OverlayContainer;
//   let overlayContainerElement: HTMLElement;
//   let QuillEditor: Quill;
//   let RTEqlEditorNativeElement: HTMLElement;
//   let rteControl: FormControl;

//   let rteUtils: RteUtilsService;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [TestComponent],
//       imports: [
//         CommonModule,
//         BrowserAnimationsModule,
//         ReactiveFormsModule,
//         FormsModule,
//         RichTextEditorModule,
//       ],
//       providers: [],
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(TestComponent);
//         testComponent = fixture.componentInstance;

//         rteUtils = TestBed.get(RteUtilsService);

//         fixture.detectChanges();

//         RTEComponent = fixture.debugElement.query(By.css('b-rich-text-editor'))
//           .componentInstance;

//         spyOn(RTEComponent.changed, 'emit');

//         RTEnativeElement = fixture.debugElement.query(
//           By.css('b-rich-text-editor')
//         ).nativeElement;

//         RTEeditorNativeElement = fixture.debugElement.query(
//           By.css('.quill-editor')
//         ).nativeElement;

//         rteControl = testComponent.rteForm.get('rteControl');

//         setTimeout(() => {
//           QuillEditor = RTEComponent.editor;
//           RTEqlEditorNativeElement = QuillEditor.root;
//           fixture.detectChanges();
//         }, 0);
//       });

//     inject(
//       [OverlayContainer, Platform],
//       (oc: OverlayContainer, p: Platform) => {
//         overlayContainer = oc;
//         overlayContainerElement = oc.getContainerElement();
//         platform = p;
//       }
//     )();
//   }));

//   describe('Init', () => {
//     it('should create component', () => {
//       expect(RTEComponent).toBeTruthy();
//       expect(QuillEditor).toBeTruthy();
//     });
//   });

//   describe('Simple inputs', () => {
//     it('should toggle between primary & secondary designs', () => {
//       expect(getComputedStyle(RTEeditorNativeElement).borderWidth).toEqual(
//         '1px'
//       );
//       RTEComponent.type = RTEType.secondary;
//       fixture.detectChanges();
//       expect(getComputedStyle(RTEeditorNativeElement).borderWidth).toEqual(
//         '0px'
//       );
//     });

//     it('should insert hintMessage text', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           hintMessage: 'test hint',
//         })
//       );

//       fixture.detectChanges();

//       const messageElement = fixture.debugElement.query(
//         By.css('[b-input-message]')
//       ).nativeElement;
//       expect(messageElement.innerText).toEqual('test hint');
//     });

//     it('should insert warnMessage text over hintMessage text', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           hintMessage: 'test hint',
//           warnMessage: 'test warn',
//         })
//       );

//       fixture.detectChanges();

//       const messageElement = fixture.debugElement.query(
//         By.css('[b-input-message]')
//       ).nativeElement;
//       expect(messageElement.innerText).toEqual('test warn');
//     });
//   });

//   describe('Label & placeholder', () => {
//     it('should insert placeholder text', () => {
//       expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
//         'placeholder text'
//       );
//     });

//     it('should update placeholder text', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           placeholder: 'test placeholder',
//         })
//       );
//       fixture.detectChanges();

//       expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
//         'test placeholder'
//       );
//     });

//     it('should insert label text', () => {
//       const labelElem = fixture.debugElement.query(By.css('.bfe-label'))
//         .nativeElement;
//       expect(labelElem.innerText).toEqual('label text');
//     });

//     it('should insert label text into placeholder slot if no placeholder text provided', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           placeholder: undefined,
//         })
//       );
//       fixture.detectChanges();

//       const labelElem = fixture.debugElement.query(By.css('.bfe-label'));

//       expect(labelElem).toBeFalsy();
//       expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
//         'label text'
//       );
//     });

//     it('should add * to placeholder text, when required is true and no label provided', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           label: undefined,
//           required: true,
//         })
//       );
//       fixture.detectChanges();

//       expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
//         'placeholder text *'
//       );
//     });

//     // tslint:disable-next-line: max-line-length
//     it('should add * to label text, and not placeholder, when required is true and both label and placeholder provided', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           required: true,
//         })
//       );
//       fixture.detectChanges();

//       expect(RTEqlEditorNativeElement.getAttribute('data-placeholder')).toEqual(
//         'placeholder text'
//       );
//       const labelElem = fixture.debugElement.query(By.css('.bfe-label'))
//         .nativeElement;

//       const labelBeforeStyle = window.getComputedStyle(labelElem, '::after');
//       const labelBeforeText = labelBeforeStyle.getPropertyValue('content');

//       expect(labelElem.innerText).toEqual('label text');
//       expect(labelBeforeText).toContain('*');
//     });
//   });

//   describe('Disabled & Error', () => {
//     it('should disable the editor when disabled is true', () => {
//       expect((QuillEditor as any).isEnabled()).toEqual(true);

//       RTEComponent.ngOnChanges(
//         simpleChange({
//           disabled: true,
//         })
//       );

//       fixture.detectChanges();

//       expect(RTEnativeElement.classList).toContain('disabled');
//       expect((QuillEditor as any).isEnabled()).toEqual(false);
//     });

//     it('should set invalid style when errorMessage is present', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           errorMessage: 'test error',
//         })
//       );

//       fixture.detectChanges();

//       const errorNativeElement = fixture.debugElement.query(By.css('.error'))
//         .nativeElement;

//       expect(RTEnativeElement.classList).toContain('error');
//       expect(errorNativeElement.innerText).toContain('test error');
//       expect(getComputedStyle(RTEeditorNativeElement).borderColor).toEqual(
//         'rgb(229, 44, 81)'
//       );
//     });
//   });

//   describe('Min & Max height', () => {
//     it('should set minimum and maximum editor height', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           minHeight: 300,
//           maxHeight: 600,
//         })
//       );

//       fixture.detectChanges();

//       const qlContainer = fixture.debugElement.query(By.css('.ql-container'))
//         .nativeElement;
//       const qlContainerStyle = qlContainer
//         .getAttribute('style')
//         .replace(/\s/g, '');

//       expect(qlContainerStyle).toEqual(
//         `min-height:${300 - 43}px;max-height:${600 - 43}px;`
//       );
//     });

//     it('should disable min/max height when set to null', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           minHeight: null,
//           maxHeight: null,
//         })
//       );

//       fixture.detectChanges();

//       const qlContainer = fixture.debugElement.query(By.css('.ql-container'))
//         .nativeElement;
//       const qlContainerStyle = qlContainer.getAttribute('style');

//       expect(qlContainerStyle).toBeFalsy();
//     });
//   });

//   describe('Editor toolbar controls', () => {
//     it('should display toolbar with controls present in controls array', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           controls: [BlotType.bold, BlotType.italic],
//         })
//       );

//       fixture.detectChanges();
//       const controlElems = fixture.debugElement.queryAll(
//         By.css('.quill-toolbar > [class*="ql-"]:not([hidden])')
//       );
//       expect(controlElems.length).toEqual(2);
//     });
//   });

//   describe('Size control', () => {
//     it('should open Size Panel on toolbar Size button click', () => {
//       const sizeButtonElement = fixture.debugElement.query(
//         By.css('b-panel button.rte-size')
//       ).nativeElement;
//       sizeButtonElement.click();

//       const sizePanelElement = overlayContainerElement.querySelector(
//         '.b-panel.rte-size-controls'
//       ) as HTMLElement;

//       expect(sizePanelElement).toBeTruthy();
//     });

//     it('should change font-size with Size Panel controls', fakeAsync(() => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test',
//         })
//       );
//       const sizeButtonElement = fixture.debugElement.query(
//         By.css('b-panel button.rte-size')
//       ).nativeElement;
//       sizeButtonElement.click();

//       const hugeButtonElement = overlayContainerElement.querySelector(
//         '.rte-button.rte-size-huge'
//       ) as HTMLElement;
//       QuillEditor.setSelection(0, 4);
//       hugeButtonElement.click();

//       tick(50);
//       expect(testComponent.rtrValue).toContain('font-size: 32px;');
//       flush();
//     }));
//   });

//   describe('Link control', () => {
//     it('should open Link Editor panel on toolbar Link button click', () => {
//       const linkButtonElement = fixture.debugElement.query(
//         By.css('b-panel button.ql-link')
//       ).nativeElement;
//       linkButtonElement.click();

//       const linkPanelElement = overlayContainerElement.querySelector(
//         '.b-panel.rte-link-editor-panel'
//       ) as HTMLElement;

//       expect(linkPanelElement).toBeTruthy();
//     });

//     it('should insert link into Editor', fakeAsync(() => {
//       const linkButtonElement = fixture.debugElement.query(
//         By.css('b-panel button.ql-link')
//       ).nativeElement;
//       linkButtonElement.click();

//       const textInputElement = <HTMLInputElement>(
//         overlayContainerElement.querySelector('.bfe-input[type="text"]')
//       );
//       const urlInputElement = <HTMLInputElement>(
//         overlayContainerElement.querySelector('.bfe-input[type="url"]')
//       );
//       const addButtonElement = overlayContainerElement.querySelector(
//         'b-rte-link-editor button.primary'
//       ) as HTMLElement;

//       textInputElement.value = 'test1';
//       textInputElement.dispatchEvent(new Event('input'));
//       urlInputElement.value = 'test2';
//       urlInputElement.dispatchEvent(new Event('input'));
//       addButtonElement.click();

//       tick(50);
//       expect(testComponent.rtrValue).toContain('a href="http://test2"');
//       flush();
//     }));
//   });

//   describe('Value input', () => {
//     it('should set the editor text to value input', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text',
//         })
//       );
//       fixture.detectChanges();

//       expect(RTEqlEditorNativeElement.innerText.trim()).toEqual('test text');
//     });
//   });

//   describe('FormControl setValue', () => {
//     it('should let FormControl set value and then emit valueChanges', fakeAsync(() => {
//       rteControl.setValue('test');
//       tick(50);
//       expect(testComponent.rtrValue).toEqual('test');
//       flush();
//     }));

//     it('should not emit valueChanges when setting value with emitEvent false', fakeAsync(() => {
//       rteControl.setValue('test2', {
//         emitEvent: false,
//       });
//       tick(50);
//       expect(testComponent.rtrValue).not.toEqual('test2');
//       flush();
//     }));
//   });

//   describe('FormControl propagateChange', () => {
//     it('should propagate value', fakeAsync(() => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text 1',
//         })
//       );
//       tick(50);
//       expect(testComponent.rtrValue).toEqual('<p>test text 1 </p>');
//       flush();
//     }));
//   });

//   describe('Events', () => {
//     it('should output changed event', () => {
//       fixture.detectChanges();
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text 8',
//         })
//       );
//       expect(RTEComponent.changed.emit).toHaveBeenCalledWith(
//         '<p>test text 8 </p>'
//       );
//     });
//     it('should output focused event when editor is focused', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text 10',
//         })
//       );
//       spyOn(RTEComponent.focused, 'emit');
//       RTEqlEditorNativeElement.dispatchEvent(new Event('focus'));
//       expect(RTEComponent.focused.emit).toHaveBeenCalledWith(
//         '<p>test text 10 </p>'
//       );
//     });
//     it('should output blurred event when editor is blurred', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text 11',
//         })
//       );
//       spyOn(RTEComponent.blurred, 'emit');
//       RTEqlEditorNativeElement.dispatchEvent(new Event('blur'));
//       expect(RTEComponent.blurred.emit).toHaveBeenCalledWith(
//         '<p>test text 11 </p>'
//       );
//     });
//   });

//   describe('PlaceholderRteConverter', () => {
//     it('Should convert HTML to RTE', () => {
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           placeholderList: placeholderMock,
//           value:
//             '<p>Hi, <strong>My</strong> name is {{/root/firstName}} my job title</p>',
//           controls: [BlotType.placeholder],
//           disableControls: [],
//         })
//       );

//       fixture.detectChanges();

//       expect(rteUtils.getHtmlContent(QuillEditor)).toContain(
//         'name is <span data-placeholder-id="/root/firstName'
//       );
//     });
//   });

//   describe('Chars counter', () => {
//     it('Should display char counter', () => {
//       RTEComponent.maxChars = 30;
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text',
//         })
//       );
//       fixture.detectChanges();

//       const counterElement = fixture.debugElement.query(
//         By.css('.length-indicator')
//       ).nativeElement;

//       expect(counterElement.textContent).toContain('10/30');
//       expect(RTEnativeElement.classList).not.toContain('warn');
//     });
//     it('Should not display char counter if maxChars and minChars prop are undefined', () => {
//       const counterElement = fixture.debugElement.query(
//         By.css('.length-indicator')
//       );
//       expect(counterElement).toBeFalsy();
//     });
//     it('Should display a warning when approaching maxChars', () => {
//       RTEComponent.maxChars = 30;
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'test text 12345',
//         })
//       );
//       fixture.detectChanges();
//       const counterElement = fixture.debugElement.query(
//         By.css('.length-indicator')
//       ).nativeElement;
//       expect(counterElement.classList).toContain('warn');
//     });
//     it('Should not allow to enter more than maxChars characters', () => {
//       RTEComponent.maxChars = 30;
//       RTEComponent.ngOnChanges(
//         simpleChange({
//           value: 'this_text_is_longer_than_20_characters',
//         })
//       );
//       fixture.detectChanges();
//       expect(RTEComponent.value).toEqual('');
//     });
//   });
// });
