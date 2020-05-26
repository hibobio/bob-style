import { escapeSafe } from 'bob-style';
import { RteMentionsOption } from './rte.interface';
import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class RteUtilsService {
  constructor(private sanitizer: DomSanitizer) {}

  getSanitizeMentions(mentionsList: RteMentionsOption[]): RteMentionsOption[] {
    return mentionsList.map((mentionListItem) => {
      return {
        displayName: escapeSafe(mentionListItem.displayName),
        link:
          mentionListItem.link &&
          this.sanitizer.sanitize(SecurityContext.URL, mentionListItem.link),
        avatar:
          mentionListItem.avatar &&
          this.sanitizer.sanitize(SecurityContext.URL, mentionListItem.avatar),
        attributes:
          mentionListItem.attributes &&
          Object.keys(mentionListItem.attributes).reduce((acc, key) => {
            acc[key] = escapeSafe(mentionListItem.attributes[key]);
            return acc;
          }, {}),
      };
    });
  }
}
