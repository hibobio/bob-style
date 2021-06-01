import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, object, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import {
  AvatarBadge,
  AvatarOrientation,
} from '../../avatar/avatar/avatar.enum';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { CardsModule } from '../../cards/cards.module';
import { ChipListModule } from '../../chips/chip-list/chip-list.module';
import { ComponentGroupType } from '../../consts';
import { EyeCandyModule } from '../../eye-candy/eye-candy.module';
import { Icons } from '../../icons/icons.enum';
import { ProgressBarModule } from '../../indicators/progress/progress-bar/progress-bar.module';
import { ProgressDonutModule } from '../../indicators/progress/progress-donut/progress-donut.module';
import { SwitchToggleModule } from '../../indicators/switch-toggle/switch-toggle.module';
import {
  disease,
  funnyImg,
  funnyName,
  joke,
  mockBadJobs,
  mockThings,
  sadAvatar,
  uselessURLs,
} from '../../mock.const';
import { BreadcrumbsModule } from '../../navigation/breadcrumbs/breadcrumbs.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { SideMenuOption } from '../../navigation/side-menu/side-menu.interface';
import { SideMenuModule } from '../../navigation/side-menu/side-menu.module';
import {
  COLOR_PALETTE_SET1_COLOR_ORDER,
  COLOR_PALETTE_SET5_COLOR_ORDER,
} from '../../services/color-service/color-palette.const';
import {
  ColorPalette,
  ColorsGrey,
} from '../../services/color-service/color-palette.enum';
import {
  makeArray,
  randomFromArray,
  randomNumber,
} from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { EE_LAYOUT_CONFIG_BY_TYPE } from './ee-layout.const';
import { EELayoutModule } from './ee-layout.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-confetti #confetti
              [colors]="confettiColors"
              [numberOfConfetti]="30">
  </b-confetti>
  <b-snow #snow
          [numberOfFlakes]="120"
          [snowDuration]="10000">
  </b-snow>

<b-ee-layout
      [type]="type === 'null' ? null : type"
      [config]="config"
      [showNext]="showNext"
      [showPrev]="showPrev"
      [disableNext]="disableNext"
      [disablePrev]="disablePrev"
      [tooltipNext]="tooltipNext"
      [tooltipPrev]="tooltipPrev"
      (nextClicked)="onNextClicked($event)"
      (prevClicked)="onPrevClicked($event)"
      [avatar]="avatars[avIndx]">
      <ng-container ee-layout-header>

        <b-menu [menu]="headerMenu">
          <b-chevron-button menu-trigger type="primary" text="Today's tasks">
          </b-chevron-button>
        </b-menu>

        <b-heading class="mrg-l-auto mrg-r-16">Your progress:</b-heading>

        <b-breadcrumbs type="primary"
                [alwaysShowTitle]="true"
                [steps]="breadcrumbs"></b-breadcrumbs>

      </ng-container>

      <ng-container ee-layout-sidebar>

        <p class="b-quote mrg-0">
          <span [innerHTML]="jokes[jokeIndex]"></span>
        </p>

        <b-side-menu [options]="sideMenu"
                    headerLabel="Because">
        </b-side-menu>

      </ng-container>

      <ng-container ee-layout-section-header>
        <b-display-2>Shiny happy people</b-display-2>

        <b-group class="mrg-l-auto">
          <b-square-button size="small" type="tertiary"
                          [icon]="icons.file_upload"
                          (clicked)="snow.stop();confetti.fireConfetti(pos)">
          </b-square-button>
          <b-square-button size="small" type="tertiary"
                          [icon]="icons.file_download"
                          (clicked)="confetti.stop();snow.makeSnow()">
          </b-square-button>
        </b-group>
      </ng-container>

      <ng-container ee-layout-content-header>

        <b-chip-list [chips]="chips" [config]="{type:'label'}">
        </b-chip-list>

      </ng-container>

      <ng-container ee-layout-content>

        <div class="flx flx-row-align-y">
          <ng-container *ngFor="let donut of donuts; let index=index; let last=last;">

            <b-progress-donut *ngIf="index<3"
              [data]="donut"
              [size]="zoom ? 'medium' : 'small'"
              [config]="{showValueInCenter:false}"
              [class.brd-r]="!last"
              [class.pad-r-16]="!last"
              [class.mrg-r-16]="!last"></b-progress-donut>

            <b-progress-bar *ngIf="index>=3"
              class="mrg-l-auto"
              type="primary"
              [data]="donut"
              [size]="zoom ? 'medium' : 'small'"
              [config]="{hideValue:true}"></b-progress-bar>

          </ng-container>
        </div>

        <div class="flx flx-row-align-y mrg-t-16">
          <b-display-3>You can be anyone you want to be</b-display-3>

          <b-switch-toggle
            class="mrg-l-auto"
            label="Make it better"
            [isChecked]="zoom" (changed)="zoom=$event; jokeIndex=jokeIndex+1"></b-switch-toggle>
        </div>

        <b-cards [type]="zoom ? 'regular' : 'small'">
          <b-card-image *ngFor="let card of cards" [card]="card"
                        [type]="zoom ? 'regular' : 'small'">
          </b-card-image>
        </b-cards>

      </ng-container>

      <ng-container ee-layout-content-footer>
        <span class="mrg-l-auto">&copy; 2021 Pasha Golovin</span>
      </ng-container>

</b-ee-layout>`;

const note = `
  ## EE Layout
  #### Module
  *EELayoutModule*


  <table style="background-color:#faf7f2; text-align:center; font-size:12px">
    <thead>
      <tr style="background-color:transparent;">
        <td colspan="2" style="border-color:grey; background-color:transparent;text-align:center;">
          &lt;ng-container ee-layout-<b>header</b>&gt;
        </td>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color:transparent;">
        <td width="30%" height="100%" rowspan="4" valign="top" style="border-color:grey; background-color:transparent;text-align:center;">
          <div style="width: 100%; height: 100%; display: flex; flex-direction:column;align-items: center;">

            <span style="display:flex; justify-content:center; align-items:center; width:60px;height:60px;border-radius:50%;background:white;border:1px solid grey;margin-bottom:30px;margin-top:20px;">
  <svg style="width:50%; height:50%;" xmlns="http://www.w3.org/2000/svg"
     height="24"
     viewBox="0 0 24 24"
     width="24">
  <path fill="#9d9d9d"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
            </span>

            <span style="flex-grow:1; display: flex;align-items: center;">
              &lt;ng-container ee-layout-<b>sidebar</b>&gt;
            </span>

          </div>
        </td>
        <td width="70%" style="border-color:grey; background-color:transparent;text-align:center;">
           &lt;ng-container ee-layout-<b>section-header</b>&gt;
        </td>
      </tr>
      <tr style="background-color:transparent;">
        <td width="70%" style="border-color:black; border-width:2px;background-color:white;text-align:center;">
           &lt;ng-container ee-layout-<b>content-header</b>&gt;
        </td>
      </tr>
      <tr style="background-color:transparent;">
        <td width="70%" height="100" style="border-color:black; border-width:2px;background-color:white;text-align:center;">
           &lt;ng-container ee-layout-<b>content</b>&gt;
        </td>
      </tr>
      <tr style="background-color:transparent;">
        <td width="70%" style="border-color:black; border-width:2px;background-color:white;text-align:center;">
           &lt;ng-container ee-layout-<b>content-footer</b>&gt;
        </td>
      </tr>
    </tbody>
  </table>

  **Note**: All template parts are optional. Use what you need. You don't have to pass [avatar], you can also place it in the sidebar with transclude. Pass [type]="null" if you want just the layout, without most of the styles.

  ~~~
<b-ee-layout
      [type]="type"
      [config]="config"
      [avatar]="avatar">

    <ng-container ee-layout-header> ... </ng-container>

    <ng-container ee-layout-sidebar> ... </ng-container>

    <ng-container ee-layout-section-header> ... </ng-container>

    <ng-container ee-layout-content-header> ... </ng-container>

    <ng-container ee-layout-content> ... </ng-container>

    <ng-container ee-layout-content-footer> ... </ng-container>

</b-ee-layout>
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [type] | Types / null | style config preset
  [avatar] | Avatar | ee avatar config
  [config] | EELayoutConfig | layout style config
  [showNext] | boolean | true will show the next button, false will hide it. The default is true.
  [showPrev] | boolean | true will show the prev button, false will hide it. The default is true.
  [disableNext] | boolean | true will disable the next button, false will enable it. The default is false.
  [disablePrev] | boolean | true will disable the prev button, false will enable it. The default is false.
  [tooltipNext] | string | The tooltip strings that will be added to the next button. There is no tooltip by default.
  [tooltipPrev] | string | The tooltip strings that will be added to the previous buttons. There is no tooltip by default.

  #### interface: EELayoutConfig
  Name | Type | Description
  --- | --- | ---
  headerClass, sidebarClass, sectionHeaderClass, contentHeaderClass, contentClass, contentFooterClass | string / string[] / object | custom layout parts classes - support what ngClass binding supports
  headerStyle, sidebarStyle, sectionHeaderStyle, contentHeaderStyle, contentStyle, contentFooterStyle | object | custom css styles - support what ngStyle supports
  [wideSidebar] | boolean | changes the width of the sidebar to a wider width. the default is false and results 180px width sidebar. 240px when set to true.
`;

const storyTemplate = `
<style>
  .b-quote {
    padding: 10px;
    border-radius: 6px;
    background-color: #a8ded7;
    font-size: 18px;
    font-style: italic;
    line-height: 1.2;
    font-family: var(--display-font-family);
    position: relative;
  }
  .b-quote:before {
    content: '';
    position: absolute;
    top: 0;
    right: 30%;
    width: 0;
    height: 0;
    border: 15px solid transparent;
    border-bottom-color: #a8ded7;
    border-top: 0;
    border-left: 0;
    margin-left: -10px;
    margin-top: -15px;
  }
  .b-quote>span:before {
    content: '“';
    display: block;
    font-size: 200%;
    line-height: 1px;
    margin-top: 15px;
    /*display: inline-block;
    position: relative;
    bottom: -12px;
    left: -4px;*/
  }
  .b-quote>span:after {
    content: '”';
    display: block;
    font-size: 200%;
    line-height: 1px;
    margin-top: 20px;
    /*display: inline-block;
    position: relative;
    bottom: -12px;
    left: -2px;*/
  }
  b-progress-bar {
    max-width: 250px;
  }
</style>
<b-story-book-layout style="background-color:#faf7f2;" [title]="'EE Layout'">
    <div style="max-width:none;margin-top: -24px;">${template}</div>
</b-story-book-layout>
`;

const jokes = joke(null);
const names = funnyName(null);
const jobs = mockBadJobs();
const diseases = disease(null);

const avatars = sadAvatar(10).map((avtr, i) => ({
  size: 90,
  avatarSize: 90,
  orientation: AvatarOrientation.vertical,
  imageSource: avtr,
  badge: randomFromArray([
    AvatarBadge.rejected,
    AvatarBadge.error,
    AvatarBadge.pending,
  ]),
  title: names[i + 1],
  subtitle: jobs[i + 1],
}));

const sideMenu: SideMenuOption[] = makeArray(4).map((_, index) => ({
  id: index,
  displayName: diseases[index + 4],
  icon: Icons.folder,
  actions: disease(4).map((dis) => ({
    label: dis,
  })),
}));

const headerMenu = [
  'Expect the worst',
  'Envy other people’s success',
  'Pick a fight',
  'Glorify the past',
  'Play the victim',
  'Revel in your negative identity',
  'Watch some TV',
].map((o) => ({ label: o }));

const urls = randomFromArray(uselessURLs, null);

const cards = funnyImg(9).map((img, i) => ({
  imageUrl: img,
  imageRatio: 1,
  title: jobs[i + 10],
  action: () => window.open(urls[i], '_blank'),
}));

const metrics1 = [
  {
    headerTextPrimary: 'Quality of work',
    value: randomNumber(5, 50),
  },
  {
    headerTextPrimary: 'Efficiency',
    value: randomNumber(5, 50),
  },
  {
    headerTextPrimary: 'Satisfaction',
    value: randomNumber(5, 35),
  },
  {
    headerTextPrimary: 'Health Index',
    value: randomNumber(5, 35),
  },
  {
    headerTextPrimary: 'Boredom',
    value: randomNumber(50, 100),
  },
  {
    headerTextPrimary: 'Happiness',
    value: randomNumber(0, 50),
  },
  {
    headerTextPrimary: 'Cultural fit',
    value: randomNumber(50, 100),
  },
  {
    headerTextPrimary: 'Absenteeism',
    value: randomNumber(50, 100),
  },
];

const metrics2 = [
  {
    headerTextPrimary: 'Goals achieved',
    value: randomNumber(0, 30),
  },
  {
    headerTextPrimary: 'Personal growth',
    value: randomNumber(0, 30),
  },
];

const donuts = randomFromArray(metrics1, 3)
  .concat(randomFromArray(metrics2, 1))
  .map((m, i) => {
    const headerTextSecondary =
      // i >= 3
      //   ? null :
      m.value < 50 / 3
        ? 'none'
        : m.value > 50 / 3 && m.value < (50 / 3) * 2
        ? 'poor'
        : m.value > (50 / 3) * 2 && m.value < 50
        ? 'a little bit'
        : m.value > 50 && m.value < 50 + 50 / 3
        ? 'average'
        : m.value > 50 + 50 / 3 && m.value < 50 + (50 / 3) * 2
        ? 'considerable'
        : 'overwhelming';
    return {
      ...m,
      headerTextSecondary,
      color: ColorPalette[COLOR_PALETTE_SET1_COLOR_ORDER[i]],
      trackColor: ColorsGrey.grey_400,
    };
  });

const pos: { x: number; y: number }[] = makeArray(5).map(() => ({
  x: Math.random() * document.documentElement.clientWidth,
  y: Math.random() * document.documentElement.clientHeight,
}));

const randomItems = mockThings();

const chips = makeArray(randomNumber(3, 5)).map((_, i) => ({
  text: randomItems[i],
  color: ColorPalette[COLOR_PALETTE_SET5_COLOR_ORDER[i]],
}));

story.add(
  'EE Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select(
          'type',
          ['null', ...Object.keys(EE_LAYOUT_CONFIG_BY_TYPE)],
          'primary'
        ),

        showNext: boolean('showNext', true),
        showPrev: boolean('showPrev', true),

        disablePrev: boolean('disablePrev', false),
        disableNext: boolean('disableNext', false),

        tooltipNext: text('tooltipNext', 'this is the next button tooltip'),
        tooltipPrev: text('tooltipPrev', 'this is the prev button tooltip'),

        onNextClicked: action('nextClicked'),
        onPrevClicked: action('prevClicked'),

        config: object('config', {
          headerClass: ['brd-b', 'pad-b-8', 'b-sticky'],
          headerStyle: {
            top: 0,
            'background-color': '#faf7f2',
            'z-index': 2,
          },
          sidebarClass: ['b-sticky'],
          sidebarStyle: {
            top: '100px',
          },
          contentClass: ['row-gap'],
          sectionTitleClass: ['flx', 'flx-row-align-y'],
          wideSidebar: true,
        }),

        zoom: false,
        avIndx: 0,
        avatars: avatars,
        sideMenu: sideMenu,
        cards: cards,
        jokes: jokes,
        jokeIndex: 0,
        headerMenu: headerMenu,
        breadcrumbs: [
          {
            title: 'Birth',
            state: 'success',
          },
          {
            title: 'Marriage',
            state: 'success',
          },
          {
            title: 'Misery',
            state: 'active',
          },
          {
            title: 'Death',
            state: 'closed',
          },
        ],
        donuts: donuts,
        chips: chips,
        pos: pos,
        icons: Icons,
        confettiColors: Object.values(ColorPalette),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          EELayoutModule,
          StoryBookLayoutModule,
          AvatarModule,
          SideMenuModule,
          CardsModule,
          TypographyModule,
          BreadcrumbsModule,
          ButtonsModule,
          MenuModule,
          ProgressDonutModule,
          ProgressBarModule,
          SwitchToggleModule,
          EyeCandyModule,
          ChipListModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    };
  },
  { notes: { markdown: note } }
);
