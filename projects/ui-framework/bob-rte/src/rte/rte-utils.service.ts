import Tribute from 'tributejs';

import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  DOMhelpers,
  escapeSafe,
  Func,
  HtmlParserHelpers,
  isNotEmptyObject,
  joinArrays,
  SanitizerService,
  SelectGroupOption,
  stringyOrFail,
} from 'bob-style';

import { PlaceholdersConverterService } from './placeholders.service';
import {
  RTE_CONTROLS_DEF,
  RTE_DISABLE_CONTROLS_DEF,
  RTE_HTML_CLEANUP_REPLACERS_INPUT,
  RTE_HTML_CLEANUP_REPLACERS_OUTPUT,
  RTE_MENTIONS_OPTIONS_DEF,
} from './rte.const';
import { BlotType, RTEMode } from './rte.enum';
import { RteMentionsOption } from './rte.interface';
import { TributeInstance, TributeItem } from './tribute.interface';

// import { HtmlParserHelpers } from '../../../../ui-framework/src/lib/services/html/html-parser.service';

@Injectable()
export class RteUtilsService {
  constructor(
    private domSanitizer: DomSanitizer,
    private parserService: HtmlParserHelpers,
    private sanitizer: SanitizerService,
    private DOM: DOMhelpers,
    private placeholdersConverter: PlaceholdersConverterService
  ) {}

  public getSanitizeMentions(mentionsList: RteMentionsOption[]): RteMentionsOption[] {
    return mentionsList.map((mentionListItem) => {
      return {
        displayName: escapeSafe(mentionListItem.displayName),
        link: mentionListItem.link && this.domSanitizer.sanitize(SecurityContext.URL, mentionListItem.link),
        avatar: mentionListItem.avatar && this.domSanitizer.sanitize(SecurityContext.URL, mentionListItem.avatar),
        attributes:
          mentionListItem.attributes &&
          Object.keys(mentionListItem.attributes).reduce((acc, key) => {
            acc[key] = escapeSafe(mentionListItem.attributes[key]);
            return acc;
          }, {}),
      };
    });
  }

  public getControls(
    mode: RTEMode,
    controls: BlotType[],
    disableControls: BlotType[]
  ): { controls: BlotType[]; disableControls: BlotType[] } {
    //
    if (mode === RTEMode.plainText) {
      return { controls: [BlotType.placeholder], disableControls: [] };
    } else if (controls.length === 1 && controls[0] === BlotType.placeholder) {
      controls = Object.values(BlotType);
    }

    if (controls.includes(BlotType.list)) {
      controls = joinArrays(controls, [BlotType.ul, BlotType.ol]);
    }

    if (controls.includes(BlotType.direction)) {
      controls = joinArrays(controls, [BlotType.rightToLeft, BlotType.leftToRight]);
    }

    if (disableControls.includes(BlotType.list)) {
      disableControls = joinArrays(disableControls, [BlotType.ul, BlotType.ol]);
    }

    if (disableControls.includes(BlotType.direction)) {
      disableControls = joinArrays(disableControls, [BlotType.rightToLeft, BlotType.leftToRight]);
    }

    controls = joinArrays(RTE_CONTROLS_DEF, [BlotType.removeFormat, BlotType.pasteAsText]).filter(
      (cntrl: BlotType) =>
        (controls || RTE_CONTROLS_DEF).includes(cntrl) && !(disableControls || RTE_DISABLE_CONTROLS_DEF).includes(cntrl)
    );

    return { controls, disableControls };
  }

  public getTransformers(
    mode: RTEMode,
    placeholdersEnabled: boolean,
    placeholderList: SelectGroupOption[]
  ): {
    pasteTransformers: Func[];
    inputTransformers: Func[];
    outputTransformers: Func[];
  } {
    //
    const pasteTransformers =
      mode === RTEMode.plainText
        ? [(value: string): string => this.parserService.getPlainText(value)]
        : [
            (value: string): string => {
              return value
                .replace(
                  /(<(\\?xml|meta|link|del|ins|st1:|[ovwxpm]:)((.|\s)*?)>[^<]*)|(<\/(\\?xml|meta|link|del|ins|st1:|[ovwxpm]:)((.|\s)*?)>)/gi,
                  ''
                )
                .replace(/<!--([\S\s]*?)-->/g, '');
            },

            (value: string): string =>
              this.sanitizer.filterXSS(value, {
                css: true,
              }),

            (value: string): string => this.parserService.cleanupHtml(value, RTE_HTML_CLEANUP_REPLACERS_INPUT),

            (value: string): string | HTMLElement =>
              this.parserService.replaceElements(
                value,
                {
                  font: {
                    with: 'span',
                  },

                  i: {
                    with: 'em',
                  },

                  b: {
                    withFnc: (el: HTMLElement) =>
                      el.style.fontWeight !== 'normal' && el.style.fontWeight !== '400' ? 'strong' : 'span',
                  },

                  pre: {
                    with: 'span',
                  },

                  span: {
                    withFnc: (el: HTMLElement) => {
                      if (el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight, 10) > 500) {
                        return 'strong';
                      }

                      if (el.style.textDecoration === 'underline') {
                        return 'u';
                      }

                      if (el.style.fontStyle === 'italic') {
                        return 'em';
                      }

                      if (el.style.display === 'block') {
                        if (this.DOM.isEmpty(el) && el.style.height) {
                          el.innerHTML = '<br>';
                        }

                        return 'div';
                      }

                      return null;
                    },
                  },
                },
                true
              ),

            (value: string | HTMLElement): string | HTMLElement => this.parserService.unwrapInlineElements(value, true),

            (value: string | HTMLElement): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  '*': {
                    '.*': null,
                    href: true,
                    lang: true,
                    dir: true,
                  },
                  a: {
                    class: 'fr-deletable',
                    target: '_blank',
                    spellcheck: 'false',
                    rel: 'noopener noreferrer',
                    tabindex: '-1',
                    style: null,
                  },
                  '[href*="/employee-profile/"]': {
                    class: 'fr-deletable',
                    target: null,
                    spellcheck: 'false',
                    rel: null,
                    contenteditable: false,
                  },
                },
                false
              ) as string,

            (value: string): string =>
              this.parserService.linkify(value, 'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'),
          ];

    const inputTransformers = [
      stringyOrFail,

      ...(mode === RTEMode.plainText
        ? [(value: string): string => this.parserService.getPlainText(value)]
        : [
            (value: string | HTMLElement): string | HTMLElement => this.parserService.unwrapInlineElements(value, true),

            (value: string): string | HTMLElement =>
              this.parserService.enforceAttributes(
                value,
                {
                  '*': {
                    '^on.*': null,
                    class: null,
                    id: null,
                  },
                  br: {
                    '.*': null,
                  },
                },
                false
              ),

            (value: string): string => this.parserService.cleanupHtml(value, RTE_HTML_CLEANUP_REPLACERS_INPUT),

            (value: string | HTMLElement): string | HTMLElement =>
              this.parserService.replaceElements(
                value,
                {
                  font: {
                    with: 'span',
                  },

                  i: {
                    with: 'em',
                  },

                  b: {
                    with: 'strong',
                  },

                  pre: {
                    with: 'span',
                  },
                },
                true
              ),

            (value: string | HTMLElement): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  a: {
                    class: 'fr-deletable',
                    target: '_blank',
                    spellcheck: 'false',
                    rel: 'noopener noreferrer',
                    tabindex: '-1',
                    style: null,
                  },
                  // '[mention-employee-id],[class*="mention"]'
                  '[href*="/employee-profile/"]': {
                    class: 'fr-deletable',
                    target: null,
                    spellcheck: 'false',
                    rel: null,
                    contenteditable: false,
                  },
                },
                false
              ) as string,

            (value: string): string =>
              this.parserService.linkify(value, 'class="fr-deletable" spellcheck="false" rel="noopener noreferrer"'),
          ]),
    ];

    const outputTransformers =
      mode === RTEMode.plainText
        ? [(value: string): string => this.parserService.getPlainText(value)]
        : [
            (value: string): string =>
              this.parserService.enforceAttributes(
                value,
                {
                  'span,p,div,a': {
                    contenteditable: null,
                    tabindex: null,
                    spellcheck: null,
                    class: {
                      'fr-.*': false,
                    },
                  },
                  ...(mode === RTEMode.htmlInlineCSS
                    ? {
                        a: {
                          style: 'color: #fea54a; font-weight: 600; text-decoration: none;',
                        },
                      }
                    : {}),
                },
                false
              ) as string,

            (value: string): string => this.parserService.cleanupHtml(value, RTE_HTML_CLEANUP_REPLACERS_OUTPUT),
          ];

    mode === RTEMode.htmlInlineCSS &&
      outputTransformers.unshift(
        (value: string): string => this.parserService.addLangAttributes(value, false, ['hebrew'], ['style']) as string
      );

    if (placeholdersEnabled) {
      inputTransformers.push((value: string): string => this.placeholdersConverter.toRte(value, placeholderList));
      pasteTransformers.push((value: string): string => this.placeholdersConverter.toRte(value, placeholderList));
      outputTransformers.unshift(this.placeholdersConverter.fromRte);
    }

    return { pasteTransformers, inputTransformers, outputTransformers };
  }

  public getTributeInstance(mentionsList: RteMentionsOption[]): TributeInstance {
    return new Tribute({
      ...RTE_MENTIONS_OPTIONS_DEF,

      values: this.getSanitizeMentions(mentionsList),

      selectTemplate: (item: TributeItem) => {
        // prettier-ignore
        // tslint:disable-next-line: max-line-length
        let html = `<a href="${item.original.link}" class="fr-deletable" spellcheck="false" contenteditable="false" tabindex="-1">@${item.original.displayName}</a>`;

        if (isNotEmptyObject(item.original.attributes)) {
          html = this.parserService.enforceAttributes(
            html,
            {
              a: item.original.attributes,
            },
            false
          ) as string;
        }

        return html;
      },
    }) as TributeInstance;
  }
}
