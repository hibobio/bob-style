import { Injectable } from '@angular/core';

import { HTML_TAG_TEST } from '../services/html/html-parser.const';
import { HtmlParserHelpers } from '../services/html/html-parser.service';
import { SanitizerService } from '../services/html/sanitizer.service';
import { HTML_COMMENT_SANITIZER_OPTIONS } from './comments.const';

@Injectable()
export class CommentsUtilService {
  constructor(
    private htmlParser: HtmlParserHelpers,
    private sanitizer: SanitizerService
  ) {}

  private linkify(value: string, editable = false): string {
    return this.htmlParser.linkify(
      value,
      (editable ? 'contenteditable="false" ' : '') + 'rel="noopener noreferrer"'
    );
  }

  sanitizeValue(value: string, isHtml = null, editable = false): string {
    if (isHtml === null) {
      isHtml = HTML_TAG_TEST.test(value);
    }
    return !isHtml
      ? this.linkify(value, editable)
      : this.sanitizer.sanitizeHtml(
          editable ? this.linkify(value, editable) : value,
          HTML_COMMENT_SANITIZER_OPTIONS
        );
  }
}
