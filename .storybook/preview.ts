import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import '!style-loader!css-loader!sass-loader!../projects/ui-framework/src/lib/style/style.scss';

setCompodocJson(docJson);
export const parameters = {
  layout: 'fullscreen',
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true,
    },
  },
};
