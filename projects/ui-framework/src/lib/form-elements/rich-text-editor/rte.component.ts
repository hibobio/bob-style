import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { merge } from 'lodash';

import { PanelComponent } from '../../popups/panel/panel.component';
import { SingleListComponent } from '../lists/single-list/single-list.component';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { Icons } from '../../icons/icons.enum';
import { PanelDefaultPosVer, PanelSize } from '../../popups/panel/panel.enum';
import { DOMhelpers } from '../../services/utils/dom-helpers.service';

import quillLib, { RangeStatic } from 'quill';

import { Italic } from './rte-core/italic-blot';
import { BlotType, RTEFontSize, RTEType } from './rte-core/rte.enum';
import { RteUtilsService } from './rte-core/rte-utils.service';
import { RteLink, SpecialBlots } from './rte-core/rte.interface';
import { RTEformElement } from './rte-core/rte-form-element.abstract';

import { LinkBlot } from './rte-link/link-blot';
import { RteLinkEditorComponent } from './rte-link/rte-link-editor.component';
import { RteLinkBlot } from './rte-link/rte-link.mixin';

import { RtePlaceholder, RtePlaceholderList } from './rte-placeholder/placeholder-rte-converter.interface';
import { PlaceholderBlot } from './rte-placeholder/placeholder-blot';

import { RtePlaceholderBlot } from './rte-placeholder/rte-placeholder.mixin';

import { RteKeybindings } from './rte-core/rte-keybindigs.mixin';
import { MixIn } from '../../services/utils/functional-utils';
import { PlaceholderRteConverterService } from './rte-placeholder/placeholder-rte-converter.service';
import { stringyOrFail } from '../../services/utils/transformers';

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
    injector: Injector,
    public placeholderRteConverterService: PlaceholderRteConverterService
  ) {
    super(rteUtils, changeDetector, injector);
  }

  public disableControlsDef = [BlotType.placeholder, BlotType.align, BlotType.direction];

  @Input() public type: RTEType = RTEType.primary;
  @Input() public minHeight = 185;
  @Input() public maxHeight = 295;

  @HostBinding('class.rte-primary') get isOfTypePrimary(): boolean {
    return !this.type || this.type === RTEType.primary;
  }
  @HostBinding('class.rte-secondary') get isOfTypeSecondary(): boolean {
    return this.type === RTEType.secondary;
  }
  @HostBinding('class.rte-tertiary') get isOfTypeTertiary(): boolean {
    return this.type === RTEType.tertiary;
  }

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
  @ViewChild('linkPanel', { static: true }) public linkPanel: PanelComponent;
  @ViewChild('linkEditor', { static: true }) public linkEditor: RteLinkEditorComponent;
  public onLinkPanelOpen: () => void;
  public onLinkUpdate: (rteLink: RteLink) => void;

  // implementing RtePlaceholderBlot mixin
  @Input() public placeholderList: RtePlaceholderList[];
  @ViewChild('placeholderPanel', { static: false }) public placeholderPanel: PanelComponent;
  public onPlaceholderPanelOpen: () => void;
  public onPlaceholderSelectChange: (selectGroupOptions: SingleListComponent) => void;

  // implementing RteKeybindings mixin
  public checkCurrentBlot: (selection: RangeStatic, checkAt: number | number[], lookAhead: boolean) => boolean;
  public addKeyBindings: () => void;

  // registering input/output transformers
  private initTransformers(): void {
    this.inputTransformers = [stringyOrFail];
    this.outputTransformers = [this.rteUtils.cleanupHtml];

    if (this.placeholderList && this.controls.includes(BlotType.placeholder)) {
      this.inputTransformers.push(
        this.placeholderRteConverterService.toRtePartial(this.placeholderList[0].options as RtePlaceholder[])
      );

      this.outputTransformers.push(this.placeholderRteConverterService.fromRte);
    }
  }

  // this extends RTE Abstract's ngOnChanges
  onNgChanges(changes: SimpleChanges): void {
    if (changes.placeholderList || changes.controls || changes.disableControls) {
      this.initTransformers();
      this.writeValue(this.value);
    }
  }

  // this extends RTE Abstract's ngAfterViewInit
  onNgAfterViewInit(): void {
    merge(this.editorOptions, {
      placeholder: this.rteUtils.getEditorPlaceholder(
        this.placeholder || this.label,
        this.required && this.placeholder && this.label ? false : this.required
      ),
      modules: {
        toolbar: {
          container: this.toolbar.nativeElement,
          handlers: {
            link: () => {
              this.onLinkPanelOpen();
            }
          }
        }
      },
      formats: Object.values(this.controls)
    });

    setTimeout(() => {
      this.initEditor(this.editorOptions);
      this.addKeyBindings();
      this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);
    }, 0);
  }
}
