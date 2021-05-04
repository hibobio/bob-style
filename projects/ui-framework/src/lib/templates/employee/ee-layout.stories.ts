import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import {
  AvatarBadge,
  AvatarOrientation,
  AvatarSize,
} from '../../avatar/avatar/avatar.enum';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { CardsModule } from '../../cards/cards.module';
import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import {
  disease,
  funnyImg,
  funnyName,
  joke,
  mockBadJobs,
  sadAvatar,
} from '../../mock.const';
import { BreadcrumbsModule } from '../../navigation/breadcrumbs/breadcrumbs.module';
import { MenuModule } from '../../navigation/menu/menu.module';
import { SideMenuOption } from '../../navigation/side-menu/side-menu.interface';
import { SideMenuModule } from '../../navigation/side-menu/side-menu.module';
import {
  makeArray,
  randomFromArray,
} from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { EE_LAYOUT_CONFIG_BY_TYPE } from './ee-layout.const';
import { EELayoutModule } from './ee-layout.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-ee-layout
  [type]="type"
  [config]="config"
  [avatar]="avatars[avIndx]">

  <ng-container header>

    <b-menu [menu]="headerMenu">
      <b-chevron-button menu-trigger type="primary" text="Today's tasks">
      </b-chevron-button>
    </b-menu>

    <b-heading class="mrg-l-auto mrg-r-16">Your progress:</b-heading>

    <b-breadcrumbs type="primary"
             [alwaysShowTitle]="true"
             [steps]="breadcrumbs"></b-breadcrumbs>

  </ng-container>

  <ng-container sidebar>

    <p class="b-quote mrg-t-24 mrg-b-0">
      <span>{{joke}}</span>
    </p>

    <b-side-menu class="mrg-t-24" [options]="sideMenu"
                headerLabel="Because">
    </b-side-menu>

  </ng-container>

  <ng-container title>
    <b-display-2>You can be anyone you want to be</b-display-2>
  </ng-container>

  <ng-container content>

    <b-cards type="small">
      <b-card-image *ngFor="let card of cards" [card]="card"
                    type="small">
      </b-card-image>
    </b-cards>

  </ng-container>

</b-ee-layout>`;

const note = `
 ## EE Layout
  #### Module
  *EELayoutModule*
  ~~~
  ${template}
  ~~~
  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | EmployeeTemplateType | regular or transparentSidebar | regular
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
  size: AvatarSize.medium,
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

const sideMenu: SideMenuOption[] = makeArray(4).map((i, index) => ({
  id: index,
  displayName: diseases[index + 4],
  icon: Icons.folder,
  actions: disease(4).map((dis, i) => ({
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

const cards = funnyImg(9).map((img, i) => ({
  imageUrl: img,
  imageRatio: 1,
  title: jobs[i + 10],
}));

story.add(
  'Employee template',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select(
          'type',
          ['null', ...Object.keys(EE_LAYOUT_CONFIG_BY_TYPE)],
          'primary'
        ),

        config: object('config', {
          headerClass: ['flx', 'flx-row-align-y', 'brd-b', 'pad-b-8'],
          contentClass: ['row-gap'],
        }),

        avIndx: 0,
        avatars: avatars,
        sideMenu: sideMenu,
        cards: cards,
        joke: joke(),
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
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    };
  },
  { notes: { markdown: note } }
);
