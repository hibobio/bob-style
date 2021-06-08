import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  DOMMouseEvent,
  FilterXSSOptions,
  hasChanges,
  SANITIZER_ALLOWED_ATTRS,
  SANITIZER_FILTER_XSS_OPTIONS,
  SanitizerService,
  SelectGroupOption,
} from 'bob-style';

import { PlaceholdersConverterService } from '../rte/placeholders.service';
import { RteViewType } from './rte-view.enum';

export const RTE_VIEW_SANITIZER_OPTIONS: Partial<FilterXSSOptions> = {
  whiteList: {
    ...SANITIZER_FILTER_XSS_OPTIONS.whiteList,
    a: SANITIZER_ALLOWED_ATTRS.filter((a) => a !== 'style'),
  },
};

@Component({
  selector: 'b-rich-text-view',
  template: ``,
  styleUrls: ['./rte-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RteViewComponent implements OnChanges {
  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    private sanitizer: SanitizerService,
    private router: Router,
    private placeholdersConverter: PlaceholdersConverterService
  ) {
    this.hostEl = this.host.nativeElement;
  }

  private hostEl: HTMLElement;

  @Input() placeholderList: SelectGroupOption[];
  @Input() value: string;

  @HostBinding('attr.data-type') @Input() type: RteViewType;
  @HostBinding('class.fr-view') frViewClass = true;

  @HostListener('click.outside-zone', ['$event'])
  onHostClick($event: DOMMouseEvent) {
    const employeeId = $event.target.getAttribute('mention-employee-id');

    if (employeeId) {
      $event.preventDefault();
      this.zone.run(() => {
        this.router.navigate(['/employee-profile', employeeId]);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, null, true)) {
      const sanitized = this.sanitizer.sanitizeHtml(
        this.value,
        RTE_VIEW_SANITIZER_OPTIONS
      );

      this.hostEl.innerHTML = !this.value
        ? ''
        : this.placeholderList
        ? this.placeholdersConverter.toRte(
            sanitized,
            this.placeholderList,
            'viewer'
          )
        : sanitized;
    }
  }
}
