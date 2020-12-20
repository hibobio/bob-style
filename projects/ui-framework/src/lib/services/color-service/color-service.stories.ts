import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const storyTemplate = `
<b-story-book-layout [title]="'ColorService, ColorPaletteService'">

<div>
  <h3>enum: ColorPalette</h3>

  <table>

    <tr>
      <td style="background-color: #f6bbbb; color: black;">
        color1_lighter
        #f6bbbb
      </td>
      <td style="background-color: #f09292; color: black;">
        color1_light
        #f09292
      </td>

      <td style="background-color: #d36565; color: white;">
        color1_base
        #d36565
      </td>
      <td style="background-color: #a54d4d; color: white;">
        color1_dark
        #a54d4d
      </td>
      <td style="background-color: #812525; color: white;">
        color1_darker
        #812525
      </td>
    </tr>

    <tr>
      <td style="background-color: #fbf5d7; color: black;">
        color2_lighter
        #fbf5d7
      </td>
      <td style="background-color: #f8eaa3; color: black;">
        color2_light
        #f8eaa3
      </td>
      <td style="background-color: #e8d883; color: white;">
        color2_base
        #e8d883
      </td>
      <td style="background-color: #c1b051; color: white;">
        color2_dark
        #c1b051
      </td>
      <td style="background-color: #776926; color: white;">
        color2_darker
        #776926
      </td>
    </tr>

    <tr>
      <td style="background-color: #ffdbc1; color: black;">
        color3_lighter
        #ffdbc1
      </td>
      <td style="background-color: #f4b486; color: black;">
        color3_light
        #f4b486
      </td>
      <td style="background-color: #f1a168; color: white;">
        color3_base
        #f1a168
      </td>
      <td style="background-color: #eb7a29; color: white;">
        color3_dark
        #eb7a29
      </td>
      <td style="background-color: #a84f10; color: white;">
        color3_darker
        #a84f10
      </td>
    </tr>

    <tr>
      <td style="background-color: #ffcce2; color: black;">
        color4_lighter
        #ffcce2
      </td>
      <td style="background-color: #feabcf; color: black;">
        color4_light
        #feabcf
      </td>
      <td style="background-color: #c85c8a; color: white;">
        color4_base
        #c85c8a
      </td>
      <td style="background-color: #9b446a; color: white;">
        color4_dark
        #9b446a
      </td>
      <td style="background-color: #642b44; color: white;">
        color4_darker
        #642b44
      </td>
    </tr>

    <tr>
      <td style="background-color: #ceefe9; color: black;">
        color5_lighter
        #ceefe9
      </td>
      <td style="background-color: #a8ded7; color: black;">
        color5_light
        #a8ded7
      </td>
      <td style="background-color: #6cc1c1; color: white;">
        color5_base
        #6cc1c1
      </td>
      <td style="background-color: #46919e; color: white;">
        color5_dark
        #46919e
      </td>
      <td style="background-color: #154156; color: white;">
        color5_darker
        #154156
      </td>
    </tr>

    <tr>
      <td style="background-color: #e6d3f9; color: black;">
        color6_lighter
        #e6d3f9
      </td>
      <td style="background-color: #c9aae8; color: black;">
        color6_light
        #c9aae8
      </td>

      <td style="background-color: #9368bf; color: white;">
        color6_base
        #9368bf
      </td>
      <td style="background-color: #6b4493; color: white;">
        color6_dark
        #6b4493
      </td>
      <td style="background-color: #4b2f67; color: white;">
        color6_darker
        #4b2f67
      </td>
    </tr>

    <tr>
      <td style="background-color: #d3f8d6; color: black;">
        color7_lighter
        #d3f8d6
      </td>
      <td style="background-color: #a9e8ad; color: black;">
        color7_light
        #a9e8ad
      </td>
      <td style="background-color: #85c88a; color: white;">
        color7_base
        #85c88a
      </td>
      <td style="background-color: #589c5c; color: white;">
        color7_dark
        #589c5c
      </td>
      <td style="background-color: #38613a; color: white;">
        color7_darker
        #38613a
      </td>
    </tr>

    <tr>
      <td style="background-color: #f8d5c0; color: black;">
        color8_lighter
        #f8d5c0
      </td>
      <td style="background-color: #e0b69c; color: black;">
        color8_light
        #e0b69c
      </td>
      <td style="background-color: #b48e78; color: white;">
        color8_base
        #b48e78
      </td>
      <td style="background-color: #8b6c59; color: white;">
        color8_dark
        #8b6c59
      </td>
      <td style="background-color: #593e2d; color: white;">
        color8_darker
        #593e2d
      </td>
    </tr>

    <tr>
      <td style="background-color: #deedfd; color: black;">
        color9_lighter
        #deedfd
      </td>
      <td style="background-color: #bed8f5; color: black;">
        color9_light
        #bed8f5
      </td>
      <td style="background-color: #a4c9ef; color: white;">
        color9_base
        #a4c9ef
      </td>
      <td style="background-color: #618cbb; color: white;">
        color9_dark
        #618cbb
      </td>
      <td style="background-color: #2e4d6e; color: white;">
        color9_darker
        #2e4d6e
      </td>
    </tr>

  </table>
</div>


</b-story-book-layout>
`;

const note = `
  ## ColorService, ColorPaletteService


  #### ColorPaletteService methods
  signature | returns | description
  --- | ---
  getPaletteColorByIndex<wbr>(index?: number) | ColorPalette | returns color from the ColorPalette by index, <br>if index is not provided - returns random color
  gerRandomPaletteColor() | ColorPalette | returns random palette color
  gerRandomPaletteColors<wbr>(count = 1) | ColorPalette[] | returns Count number of colors
  paletteColorGenerator<wbr>(startIndex?: number) | PaletteColorGenerator | returns an object with:<br>\
   \`\`\`next()\`\`\` method - will return next color in ColorPalette on each call, <br>\
   \`\`\`nextMultiple(count = 1)\`\`\` method - will return next Count number of colors (ColorPalette[]),<br>\
    also has properties: \`\`\`currentIndex\`\`\`, \`\`\`currentColorName\`\`\`, \`\`\`currentColor\`\`\`.

  ~~~
  colorPalette = this.colorPaletteService.paletteColorGenerator();

  color1 = this.colorPalette.next(); // color1_base #d36565
  color2 = this.colorPalette.next(); // color2_base #e8d883

  color3 = this.colorPaletteService.getPaletteColorByIndex(2); // color3_base #f1a168
  ~~~


`;

story.add(
  'Color services',
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
