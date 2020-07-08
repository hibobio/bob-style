import {
  Component,
  Input,
  ElementRef,
  HostListener,
  SimpleChanges,
  OnChanges,
  HostBinding,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SanitizerService, SelectGroupOption, hasChanges } from 'bob-style';
import { PlaceholdersConverterService } from '../rte/placeholders.service';
import { RteViewType } from './rte-view.enum';
import { SANITIZER_FILTER_XSS_OPTIONS } from '../../../src/lib/services/utils/sanitizer.service';

@Component({
  selector: 'b-rich-text-view',
  template: ``,
  styleUrls: ['./rte-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RteViewComponent implements OnChanges {
  constructor(
    private host: ElementRef,
    private zone: NgZone,
    private sanitizer: SanitizerService,
    private router: Router,
    private placeholdersConverter: PlaceholdersConverterService
  ) {
    this.hostEl = this.host.nativeElement as HTMLElement;
  }

  private hostEl: HTMLElement;

  @Input() placeholderList: SelectGroupOption[];
  @Input() value: string;

  @HostBinding('attr.data-type') @Input() type: RteViewType;
  @HostBinding('class.fr-view') frViewClass = true;

  @HostListener('click.outside-zone', ['$event'])
  onHostClick($event: MouseEvent) {
    const employeeId = ($event.target as HTMLElement).getAttribute(
      'mention-employee-id'
    );

    if (employeeId) {
      $event.preventDefault();
      this.zone.run(() => {
        this.router.navigate(['/employee-profile', employeeId]);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes, null, true)) {
      const sanitized = this.sanitizer.sanitizeHtml(this.value, {
        css: {
          whiteList: {
            ...SANITIZER_FILTER_XSS_OPTIONS.css.whiteList,
            color: true,
            'text-decoration': true,
          },
        },
      });

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
