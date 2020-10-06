import { addParameters, configure } from '@storybook/angular';
import { create } from '@storybook/theming';
import '!style-loader!css-loader!sass-loader!../projects/ui-framework/src/lib/style/style.scss';

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Bob UI Framework!',
      brandUrl: 'https://github.com/hibobio/bob-style',
      brandImage: 'https://images.hibob.com/icons/bob_avatar.png'
    }),
    isFullscreen: false,
    panelPosition: 'right'
  }
});

// automatically import all files ending in *.stories.ts
const req = require.context('../projects/ui-framework', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
