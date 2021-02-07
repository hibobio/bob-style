import { storiesOf } from '@storybook/angular';
import { number, object, withKnobs, select } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { action } from '@storybook/addon-actions';
import { LegendModule } from './legend.module';
import { makeArray, randomNumber } from '../../services/utils/functional-utils';
import { ColorPaletteService } from '../../services/color-service/color-palette.service';
import { mockText } from '../../mock.const';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const story3 = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-legend [config]="{type:type, columns:columns}"
      [data]="data"></b-legend>`;

const storyTemplate = `<b-story-book-layout [title]="'Legend'">
<div>

  ${template}

    <br><br>
    <h4>Secondary without values:</h4>
    <b-legend [config]="{type:'secondary', columns:columns}"
      [data]="data2"></b-legend>

</div>
</b-story-book-layout>`;

const note = `
  ## Legend
  #### Module
  *LegendModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [config] | LegendConfig | object, containing:<br>\
  <u>type</u> (Types, 'primary' is bigger, 'secondary' is smaller);<br>\
  <u>columns</u> (number)
  [data] | LegendData[] | array of objects, containing:<br>\
    <u>text</u> (string), <u>color</u> (ColorPalette/string - to be displayed as a circle),<br>\
    <u>value</u> (string/number, to be displayed inside the color circle).<br>\
    Only text is mandatory


`;

const colorGenerator = new ColorPaletteService().paletteColorGenerator();

const toAdd = () => ({
  template: storyTemplate,
  props: {
    type: select('type', ['primary', 'secondary'], 'primary'),
    columns: number('columns', 3),
    data: object(
      'data',
      makeArray(9).map((_) => {
        const dice = randomNumber();

        return {
          text: mockText(2),
          value:
            dice > 85
              ? randomNumber(1, 999)
              : dice > 60
              ? randomNumber(1, 99)
              : randomNumber(1, 9),
          color: colorGenerator.next(),
        };
      })
    ),
    data2: makeArray(9).map((_) => {
      const dice = randomNumber();

      return {
        text: mockText(2),
        color: colorGenerator.next(),
      };
    }),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, LegendModule],
  },
});

story.add('Legend', toAdd, { notes: { markdown: note } });
story2.add('Legend', toAdd, { notes: { markdown: note } });
story3.add('Legend', toAdd, { notes: { markdown: note } });
