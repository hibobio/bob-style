import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  COLOR_PALETTE_MAIN_COLOR_ORDER,
  COLOR_PALETTE_SET1_COLOR_ORDER,
  COLOR_PALETTE_SET2_COLOR_ORDER,
  COLOR_PALETTE_SET3_COLOR_ORDER,
  COLOR_PALETTE_SET4_COLOR_ORDER,
  COLOR_PALETTE_SET5_COLOR_ORDER,
  COLOR_PALETTE_SET6_COLOR_ORDER,
} from './color-palette.const';
import { ColorService } from './color.service';
import { ColorPalette } from './color-palette.enum';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const getTextColor = (color: string): string => {
  return ColorService.prototype.isDark(color) ? 'white' : 'black';
};

const orderedPalette = Object.keys(ColorPalette)
  .slice()
  .sort((k1, k2) => {
    const k1Split = k1.split('_');
    const k2Split = k2.split('_');

    const colorInd1 = parseInt(k1Split[0].replace('color', ''), 10);
    const colorInd2 = parseInt(k2Split[0].replace('color', ''), 10);

    const shadeInd1 =
      k1Split[1] === 'darker'
        ? 1
        : k1Split[1] === 'dark'
        ? 2
        : k1Split[1] === 'base'
        ? 3
        : k1Split[1] === 'light'
        ? 4
        : 5;

    const shadeInd2 =
      k2Split[2] === 'darker'
        ? 0
        : k2Split[2] === 'dark'
        ? 1
        : k2Split[2] === 'base'
        ? 2
        : k2Split[2] === 'light'
        ? 3
        : 4;

    return (
      parseFloat(`${colorInd1}.${shadeInd1}`) -
      parseFloat(`${colorInd2}.${shadeInd2}`)
    );
  });

const storyTemplate = `
<b-story-book-layout [title]="'ColorPalette'">

<div style="margin-top: -20px;">
  <h3 class="mrg-t-0">enum: ColorPalette</h3>

  <p>more details: <a href="https://www.figma.com/file/5XEoqCtcQtS6gf97J517fp/Design-System-(Web)?node-id=14%3A123" target="_blank"><strong>Figma</strong></a></p>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${orderedPalette
    .map((key, i) => {
      return (
        '<div class="mrg-4 pad-4" style="background-color:' +
        ColorPalette[key] +
        '; color: ' +
        getTextColor(ColorPalette[key]) +
        ';">' +
        key +
        '<br>' +
        ColorPalette[key] +
        '</div>'
      );
    })
    .join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.main</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_MAIN_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.set1</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_SET1_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.set2</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_SET2_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.set3</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_SET3_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.set4</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_SET4_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.set5</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_SET5_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

  <h3 class="mrg-t-40">PalletteColorSet.set6</h3>

  <div class="flx" style="display: grid; grid-template-columns: repeat(5, 1fr);">
  ${COLOR_PALETTE_SET6_COLOR_ORDER.map((key, i) => {
    return (
      '<div class="mrg-4 pad-4" style="background-color:' +
      ColorPalette[key] +
      '; color: ' +
      getTextColor(ColorPalette[key]) +
      ';">' +
      i +
      '<br>' +
      key +
      '<br>' +
      ColorPalette[key] +
      '</div>'
    );
  }).join('')}
  </div>

</div>


</b-story-book-layout>
`;

const note = `
  ## ColorService, ColorPaletteService


  #### ColorPaletteService methods
  signature | returns | description
  --- | ---
  getPaletteColorByIndex<wbr>(index?: number, colorSet?: PalletteColorSet) | ColorPalette | returns color from the ColorPalette by index, <br>\
  by default, returns colors from 'main' set, unless a differen set requested, <br>\
  if index is not provided - returns random color
  gerRandomPaletteColor(colorSet?: PalletteColorSet) | ColorPalette | returns random palette color (by default from 'main' set)
  gerRandomPaletteColors<wbr>(count = 1, colorSet?: PalletteColorSet) | ColorPalette[] | returns Count number of colors (by default from 'main' set)
  <u>paletteColorGenerator</u><wbr>(colorSet?: PalletteColorSet, startIndex?: number) | PaletteColorGenerator | returns PaletteColorGenerator object with:<br><br>\
  **methods:**<br>\
   \`\`\`next()\`\`\` - will return next color in ColorPalette on each call, <br>\
   \`\`\`nextMultiple(count = 1)\`\`\` - will return next Count number of colors (ColorPalette[]),<br>\
   \`\`\`reset()\`\`\` - will reset generator, so on next <u>next()</u> call will return first color in set, <br><br>\
   **properties:** <br>\
   \`\`\`colorSet\`\`\` (set in use, dafaults to 'main'),<br>\
    \`\`\`currentIndex\`\`\` - increases with every <u>next()</u> call, <br>\
    \`\`\`currentColorName\`\`\` - current ColorPalette key,<br>\
     \`\`\`currentColor\`\`\` - current ColorPalette value

  ~~~
  colorPalette = this.colorPaletteService.paletteColorGenerator();

  color1 = this.colorPalette.next(); // color1_base #d36565
  color2 = this.colorPalette.next(); // color2_base #e8d883

  color3 = this.colorPaletteService.getPaletteColorByIndex(2); // color3_base #f1a168
  ~~~


`;

story.add(
  'ColorPalette',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        declarations: [],
        imports: [StoryBookLayoutModule, BrowserAnimationsModule],
        entryComponents: [],
      },
    };
  },
  { notes: { markdown: note } }
);
