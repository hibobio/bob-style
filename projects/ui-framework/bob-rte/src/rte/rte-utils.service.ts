import { escapeSafe } from 'bob-style';
import { RteMentionsOption } from './rte.interface';
import { Injectable, Sanitizer, SecurityContext } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RteUtilsService {
  constructor(private sanitizer: Sanitizer) {
  }

  getSanitizeMentions(mentionsList: RteMentionsOption[]): RteMentionsOption[] {
    return mentionsList.map(mentionListItem => {
      return {
        displayName: escapeSafe(mentionListItem.displayName),
        link: this.sanitizer.sanitize(SecurityContext.URL, mentionListItem.link),
        avatar: escapeSafe(mentionListItem.avatar),
        attributes: mentionListItem.attributes &&
          Object.keys(mentionListItem.attributes).reduce((acc, key) => {
            acc[key] = escapeSafe(mentionListItem.attributes[key]);
            return acc;
          }, {})
      };
    });
  }

}
