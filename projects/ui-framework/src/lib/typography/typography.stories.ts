import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { TypographyModule } from './typography.module';
import {ComponentGroupType} from '../consts';

const typographyStories = storiesOf(ComponentGroupType.Typography, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const displayTemplate = `
  <style>
    div { border-bottom: 1px solid #C4CDD5; }
    div > * { line-height: 70px !important; }
  </style>
  <div>
    <b-display-1>Display XLarge</b-display-1>
  </div>
  <div>
    <b-display-2>Display Large</b-display-2>
  </div>
  <div>
    <b-display-3>Display Medium</b-display-3>
  </div>
  <div>
    <b-display-4>Display Small</b-display-4>
  </div>
  <div>
    <b-heading>Heading</b-heading>
  </div>
  <div>
    <b-subheading>Sub heading</b-subheading>
  </div>
    <div>
    <b-big-body>Big Body</b-big-body>
  </div>
  <div>
    <span>Body</span>
  </div>
  <div>
    <b-caption>Caption</b-caption>
  </div>
  <ul>
`;
const note = `
  ## Typography
  The typography is arranged into multiple levels:
  - display: Which are large titles (usually top of page)
  - heading: Which are section headings


  #### Style customization

  property name | Description
  --- | ---
  display-font-family | The display elements font family
  heading-font-family | The heading elements font family
  body-font-family | The body elements font family
  text-color | The font color

  ~~~
  <b-display-1>Display XLarge</b-display-1>
  <b-display-2>Display Large</b-display-2>
  <b-display-3>Display Medium</b-display-3>
  <b-display-4>Display Small</b-display-4>
  <b-heading>Heading</b-heading>
  <b-subheading>Sub heading</b-subheading>
  Body
  <b-caption>Caption</b-caption>
  ~~~
`;
typographyStories.add(
    'Text', () => ({
      template: displayTemplate,
      props: {
      },
      moduleMetadata: {
        imports: [TypographyModule]
      }
    }),
    { notes: { markdown: note }  }
  );

