import Quill from 'quill';
import startsWith from 'lodash/startsWith';

const Inline = Quill.import('blots/inline');

export class LinkBlot extends Inline {

  static blotName = 'Link';
  static tagName = 'a';

  static create(url) {
    const node = super.create();
    node.setAttribute('href', startsWith(url, 'http') ? url : `http://${url}`);
    node.setAttribute('target', '_blank');
    node.setAttribute('style', 'color:#e52c51; text-decoration:underline;');
    return node;
  }

  static formats(node) {
    return node.getAttribute('href');
  }
}
