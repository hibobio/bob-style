import Quill from 'quill';
import startsWith from 'lodash/startsWith';

const Inline = Quill.import('blots/inline');

export const checkUrl = (url: string) => {
  url = url ? url.trim() : url;
  return startsWith(url, 'http') ? url : `http://${url}`;
};

export class LinkBlot extends Inline {
  static blotName = 'Link';
  static tagName = 'a';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('href', checkUrl(value));
    node.setAttribute('target', '_blank');
    node.setAttribute('style', 'color:#e52c51; text-decoration:underline;');
    return node;
  }

  static formats(node: HTMLElement) {
    return node.getAttribute('href');
  }
}
