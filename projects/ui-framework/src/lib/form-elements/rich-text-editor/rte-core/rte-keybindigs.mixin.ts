import { SpecialBlots, BlotData } from './rte.interface';
import { RteUtilsService } from './rte-utils.service';
import quillLib, { Quill, RangeStatic, Delta as DeltaType } from 'quill';
import { isKey } from '../../../services/utils/functional-utils';
import { Keys } from '../../../enums';
const Delta: typeof DeltaType = quillLib.import('delta');

export class RteKeybindings {
  constructor() {}

  // implementing Base class properties & methods

  public rteUtils: RteUtilsService;
  public editor: Quill;
  public specialBlots: SpecialBlots;
  public selection: RangeStatic;
  public currentBlot: BlotData;
  public lastSelection: RangeStatic;
  public lastCurrentBlot: BlotData;
  public storeCurrent: Function;

  // instance methods

  checkCurrentBlot(
    selection: RangeStatic | boolean,
    checkAt: number | number[],
    lookAhead = false
  ): boolean {
    if (!Array.isArray(checkAt)) {
      checkAt = [checkAt];
    }

    for (const offset of checkAt) {
      const { selection: currentSelection, currentBlot } = this.storeCurrent(
        selection,
        offset !== 0 ? { offset } : true,
        false
      );

      const formatDeleteAsWhole = this.rteUtils.commonFormats(
        currentBlot && currentBlot.format,
        this.specialBlots.deleteAsWhole
      );
      const formatTreatAsWhole = this.rteUtils.commonFormats(
        currentBlot && currentBlot.format,
        this.specialBlots.treatAsWhole
      );

      if (
        (formatDeleteAsWhole &&
          currentSelection.index ===
            (lookAhead ? currentBlot.index : currentBlot.endIndex) &&
          currentSelection.length === 0) ||
        (formatTreatAsWhole &&
          currentSelection.index >= currentBlot.index &&
          currentSelection.index <= currentBlot.endIndex &&
          currentSelection.length === 0)
      ) {
        // check if we need to restore deleted text
        if (
          formatTreatAsWhole &&
          currentBlot.format[formatTreatAsWhole[0]].text &&
          currentBlot.format[formatTreatAsWhole[0]].text.length !==
            currentBlot.text.length
        ) {
          this.editor.updateContents(
            new Delta()
              .retain(currentBlot.index)
              .delete(currentBlot.length)
              .insert(
                currentBlot.format[formatTreatAsWhole[0]].text,
                currentBlot.format
              )
          );

          currentBlot.length =
            currentBlot.format[formatTreatAsWhole[0]].text.length;
          currentBlot.endIndex = currentBlot.index + currentBlot.length;
        }

        this.rteUtils.selectBlot(currentBlot, this.editor);
        return true;
      }
    }

    return false;
  }

  // outside zone
  public addKeyBindings(): void {
    //
    // before backspace default action
    this.editor.keyboard.addBinding(
      {
        key: Keys.backspace.toUpperCase()
      },
      range => {
        if (this.specialBlots.deleteAsWhole || this.specialBlots.treatAsWhole) {
          return !this.checkCurrentBlot(range, -1);
        }
        return true;
      }
    );

    // after backspace default action
    this.editor.root.addEventListener('keydown', (event: KeyboardEvent) => {
      if (
        (this.specialBlots.deleteAsWhole || this.specialBlots.treatAsWhole) &&
        isKey(event.key, Keys.backspace)
      ) {
        this.checkCurrentBlot(true, [0, -1]);
      }

      // after delete default action
      if (
        (this.specialBlots.treatAsWhole || this.specialBlots.deleteAsWhole) &&
        isKey(event.key, Keys.delete)
      ) {
        this.checkCurrentBlot(true, [+1, 0], true);
      }
    });

    //  click to move cursor to start or end of blot in treatAsWhole array
    this.editor.root.addEventListener('click', event => {
      const element = event.target as any;
      if (this.specialBlots.treatAsWhole) {
        const { selection: currentSelection, currentBlot } = this.storeCurrent(
          true,
          { element }
        );

        if (
          this.rteUtils.commonFormats(
            currentBlot.format,
            this.specialBlots.treatAsWhole
          ) &&
          currentSelection.index > currentBlot.index &&
          currentSelection.index < currentBlot.endIndex
        ) {
          if (
            currentSelection.index <
            currentBlot.index + currentBlot.length / 2
          ) {
            this.editor.setSelection(currentBlot.index, 0);
          } else {
            this.editor.setSelection(currentBlot.endIndex + 1, 0);
          }
        }
      }
    });

    // double click to select blot in treatAsWhole array
    this.editor.root.addEventListener('dblclick', event => {
      const element = event.target as any;
      if (this.specialBlots.treatAsWhole) {
        const { currentBlot } = this.storeCurrent(false, {
          element
        });

        if (
          this.rteUtils.commonFormats(
            currentBlot.format,
            this.specialBlots.treatAsWhole
          )
        ) {
          currentBlot.select();
        }
      }
    });
  }
}
