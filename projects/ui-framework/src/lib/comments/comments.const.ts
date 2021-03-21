import {
  FilterXSSOptions,
  SANITIZER_ALLOWED_ATTRS,
  SANITIZER_FILTER_XSS_OPTIONS,
} from '../services/html/sanitizer.service';
import { MentionsOption } from '../services/mentions/mentions.service';
import { randomNumber } from '../services/utils/functional-utils';
import { CommentItem } from './comments.interface';

export const HTML_COMMENT_SANITIZER_OPTIONS: Partial<FilterXSSOptions> = {
  whiteList: {
    ...SANITIZER_FILTER_XSS_OPTIONS.whiteList,
    a: SANITIZER_ALLOWED_ATTRS.filter((a) => a !== 'style'),
  },
};

export const COMMENT_EQ_CHECK = (a: CommentItem, b: CommentItem): boolean => {
  return (
    a?.name === b?.name && a?.content === b?.content && a?.date === b?.date
  );
};

export const MENTIONS_LIST_EQ_CHECK = (
  a: MentionsOption[],
  b: MentionsOption[]
): boolean => {
  const randomIndex = randomNumber(0, a?.length || 0);
  return (
    a?.length === b?.length && (!a || a[randomIndex]?.id === b[randomIndex]?.id)
  );
};
