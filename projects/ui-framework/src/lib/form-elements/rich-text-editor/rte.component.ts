import {
  Component,
  forwardRef,
  AfterViewInit,
  ChangeDetectorRef,
  Injector,
  ViewChild,
  HostBinding,
  Input,
  ElementRef,
  SimpleChanges
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PanelComponent } from '../../overlay/panel/panel.component';
import { SingleListComponent } from '../lists/single-list/single-list.component';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { PanelSize, PanelDefaultPosVer } from '../../overlay/panel/panel.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

import quillLib, { QuillOptionsStatic } from 'quill';
import { Italic } from './rte-core/italic-blot';
import { BlotType, RTEFontSize, RTEType } from './rte-core/rte.enum';
import { RteUtilsService } from './rte-core/rte-utils.service';
import { RteLink, SpecialBlots } from './rte-core/rte.interface';
import { RTEformElement } from './rte-core/rte-form-element.abstract';

import { LinkBlot } from './rte-link/link-blot';
import { RteLinkEditorComponent } from './rte-link/rte-link-editor.component';
import { RteLinkBlot } from './rte-link/rte-link.mixin';

import {
  RtePlaceholder,
  RtePlaceholderList
} from './rte-placeholder/placeholder-rte-converter.interface';
import { PlaceholderBlot } from './rte-placeholder/placeholder-blot';

import { RtePlaceholderBlot } from './rte-placeholder/rte-placeholder.mixin';

import { RteKeybindings } from './rte-core/rte-keybindigs.mixin';
import { MixIn } from '../../services/utils/functional-utils';
import { PlaceholderRteConverterService } from './rte-placeholder/placeholder-rte-converter.service';

quillLib.register(LinkBlot);
quillLib.register(PlaceholderBlot);
quillLib.register(Italic);

@Component({
  selector: 'b-rich-text-editor',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
@MixIn([RteLinkBlot, RtePlaceholderBlot, RteKeybindings])
export class RichTextEditorComponent extends RTEformElement
  implements AfterViewInit, RteLinkBlot, RtePlaceholderBlot, RteKeybindings {
  constructor(
    private DOM: DOMhelpers,
    public rteUtils: RteUtilsService,
    changeDetector: ChangeDetectorRef,
    injector: Injector
  ) {
    super(rteUtils, changeDetector, injector);
  }

  @HostBinding('class') get classes() {
    return (
      (!this.type ? 'rte-primary' : 'rte-' + this.type) +
      (this.required ? ' required' : '') +
      (this.disabled ? ' disabled' : '') +
      (this.errorMessage ? ' error' : '')
    );
  }

  @Input() public type: RTEType = RTEType.primary;
  @Input() public minHeight = 185;
  @Input() public maxHeight = 295;
  @Input() public disableControls: BlotType[] = [
    BlotType.placeholder,
    BlotType.color,
    BlotType.align,
    BlotType.direction
  ];

  @ViewChild('toolbar') private toolbar: ElementRef;
  @ViewChild('suffix') private suffix: ElementRef;

  public hasSuffix = true;
  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly panelSize = PanelSize;
  readonly BlotType = BlotType;
  readonly RTEFontSize = RTEFontSize;
  readonly panelDefaultPosVer = PanelDefaultPosVer;
  public specialBlots: SpecialBlots = {
    treatAsWholeDefs: [BlotType.placeholder],
    deleteAsWholeDefs: [BlotType.link, BlotType.placeholder],
    noLinebreakAfterDefs: [BlotType.link, BlotType.align]
  };

  // implementing RteLinkBlot mixin
  @ViewChild('linkPanel') public linkPanel: PanelComponent;
  @ViewChild('linkEditor') public linkEditor: RteLinkEditorComponent;
  public onLinkPanelOpen: () => void;
  public onLinkUpdate: (rteLink: RteLink) => void;

  // implementing RtePlaceholderBlot mixin
  @Input() public placeholderList: RtePlaceholderList[];
  @ViewChild('placeholderPanel') public placeholderPanel: PanelComponent;
  public placeholderRteConverterService: PlaceholderRteConverterService;
  public RtePlaceholderOnNgChanges: (changes: SimpleChanges) => void;
  public onPlaceholderPanelOpen: () => void;
  public onPlaceholderSelectChange: (
    selectGroupOptions: SingleListComponent
  ) => void;

  // implementing RteKeybindings mixin
  public addKeyBindings: () => void;

  // registering input/output transformers
  private initTransformers(): void {
    this.inputTransformers = [];
    this.outputTransformers = [this.rteUtils.cleanupHtml];

    if (this.placeholderList && this.controls.includes(BlotType.placeholder)) {
      this.inputTransformers.push(
        this.placeholderRteConverterService.toRtePartial(this.placeholderList[0]
          .options as RtePlaceholder[])
      );

      this.outputTransformers.push(this.placeholderRteConverterService.fromRte);
    }
  }

  // this extends RTE Abstract's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (
      changes.placeholderList ||
      changes.controls ||
      changes.disableControls
    ) {
      this.initTransformers();
      this.writeValue(this.value);
    }
  }

  // this extends RTE Abstract's ngAfterViewInit
  onNgAfterViewInit(): void {
    const editorOptions: QuillOptionsStatic = {
      theme: 'snow',
      placeholder: this.rteUtils.getEditorPlaceholder(
        this.label,
        this.required
      ),
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        },
        clipboard: {
          matchVisual: false
        }
      },
      formats: Object.values(this.controls)
    };

    setTimeout(() => {
      this.initEditor(editorOptions);
      this.addKeyBindings();
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }
}
