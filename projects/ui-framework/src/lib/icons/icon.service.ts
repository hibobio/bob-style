import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Icons } from './icons.enum';
import { first } from 'rxjs/operators';

const ICONS_CDN = 'https://images.hibob.com/icons/';

@Injectable()
export class IconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  public initIcon(icon: Icons): void {
    this.iconRegistry
      .getNamedSvgIcon(icon)
      .pipe(first())
      .subscribe(
        () => {},
        () => {
          this.iconRegistry.addSvgIcon(
            icon,
            this.sanitizer.bypassSecurityTrustResourceUrl(
              `${ICONS_CDN}${icon}.svg`
            )
          );
        }
      );
  }
}
