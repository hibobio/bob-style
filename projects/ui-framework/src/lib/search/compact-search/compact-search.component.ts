import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { FormElementSize } from '../../form-elements/form-elements.enum';
import { SearchComponent } from '../search/search.component';
import { CompactSearchConfig } from './compact-search.interface';

@Component({
  selector: 'b-compact-search',
  templateUrl: './compact-search.component.html',
  styleUrls: ['./compact-search.component.scss'],
})
export class CompactSearchComponent {
  @ViewChild(SearchComponent, { static: true }) search: SearchComponent;

  @Input() value = '';
  @Input() placeholder: string;

  @Input() config: CompactSearchConfig;

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchFocus: EventEmitter<string> = new EventEmitter<string>();

  readonly formElementSize = FormElementSize;
  public open = false;
  public empty = true;

  public onSearchOpen(): void {
    !this.open && (this.open = true);
  }

  public isOpen(): boolean {
    return Boolean(this.open || (this.config?.openIfNotEmpty && !this.empty));
  }

  public onSearchClose(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.matches('.clear-input')) {
      this.search.inputFocused = false;
      this.open = false;
    }
    if (relatedTarget?.matches('.clear-input')) {
      this.focusSearchInput();
    }
  }

  public onSearchChange(event: string): void {
    this.empty = !event?.trim();
    this.searchChange.emit(event);
  }

  private focusSearchInput(): void {
    this.search['skipFocusEvent'] = true;
    this.search.input.nativeElement.focus();
  }
}
