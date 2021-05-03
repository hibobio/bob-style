import '!style-loader!css-loader!sass-loader!../projects/ui-framework/src/lib/style/style.scss';

import { setCompodocJson } from '@storybook/addon-docs/angular';

import docJson from '../documentation.json';

setCompodocJson(docJson);
export const parameters = {
  layout: 'fullscreen',
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true,
    },
  },
  options: {
    storySort: (a, b) => {
      return a[1].id.localeCompare(b[1].id, undefined, {
        numeric: true,
      });
    },
  },
};
