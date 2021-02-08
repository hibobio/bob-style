import { storiesOf } from '@storybook/angular';
import { number, object, withKnobs, select } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LegendModule } from './legend.module';
import {
  getColorGenerator,
  makeArray,
  randomNumber,
  sortByLength,
} from '../../services/utils/functional-utils';
import { badJobsList, mockHobbiesList } from '../../mock.const';
import { PalletteColorSet } from '../../services/color-service/color-palette.enum';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const story3 = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-legend [config]="{
        type: type,
        layout: layout,
        flow: flow,
        columns: columns,
        maxHeight: maxHeight,
        rowGap: rowGap,
        sortByValue: sortByValue
      }"
    [data]="data">
</b-legend>`;

const storyTemplate = `<b-story-book-layout [title]="'Legend'">
<div>

  ${template}

    <br><br>
    <h4>Secondary without values:</h4>
    <b-legend [config]="{type:'secondary', layout:layout, flow:flow, columns:3, maxHeight:maxHeight, rowGap:rowGap}"
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
  --- | --- | ---
  [config] | LegendConfig | object, containing:<br>\
    <u>type</u> (Types, 'primary' is bigger, 'secondary' is smaller);<br>\
    <u>layout</u> ('grid'/'flex'); <u>flow</u> ('row'/'column'); <u>columns</u> (number), <br>\
    <u>maxHeight</u> (number) - you can set max-height, when reached there will be scroll;<br>\
    <u>rowGap</u> (number) - margin between rows;<br>\
    <u>sortByValue</u> ('asc'/'desc') - if data should be sorted by value;<br>\
    <u>listClass, cellClass</u> (supports what ngClass binding supports - string, string[], object);<br>\
    <u>listStyle, cellStyle</u> (supports what ngStyle supports).<br>\
    **All props are optional**.
  [data] | LegendData[] | array of objects, containing:<br>\
    <u>text</u> (string), <u>color</u> (ColorPalette/string - to be displayed as a circle),<br>\
    <u>value</u> (string/number, to be displayed inside the color circle).<br>\
    **Only text is mandatory**


`;

const colorGenerator = getColorGenerator(PalletteColorSet.set5);
const colorGenerator2 = getColorGenerator(PalletteColorSet.set6);

const badJobs: string[] = badJobsList.sort(sortByLength);
const hobbies: string[] = mockHobbiesList
  .sort(sortByLength)
  .slice(Math.floor(mockHobbiesList.length / 2));

const data1 = makeArray(39).map((_, i) => {
  const dice = randomNumber();
  return {
    text: hobbies[i],
    value:
      dice > 85
        ? randomNumber(1, 999)
        : dice > 60
        ? randomNumber(1, 99)
        : randomNumber(1, 9),
    color: colorGenerator.next(),
  };
});

const data2 = makeArray(9).map((_, i) => {
  return {
    text: badJobs[i],
    color: colorGenerator2.next(),
  };
});

const toAdd = () => ({
  template: storyTemplate,
  props: {
    type: select('type', ['primary', 'secondary'], 'primary'),
    layout: select('layout', ['grid', 'flex'], 'grid'),
    flow: select('flow', ['row', 'column'], 'row'),
    columns: number('columns', 3),
    maxHeight: number('maxHeight', 140),
    rowGap: number('rowGap', 8),
    sortByValue: select('sortByValue', [false, 'asc', 'desc'], false),
    data: object('data', data1),
    data2: data2,
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, LegendModule],
  },
});

story.add('Legend', toAdd, { notes: { markdown: note } });
story2.add('Legend', toAdd, { notes: { markdown: note } });
story3.add('Legend', toAdd, { notes: { markdown: note } });
