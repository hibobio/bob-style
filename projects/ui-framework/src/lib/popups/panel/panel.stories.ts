import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { PanelModule } from './panel.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CheckboxModule } from '../../form-elements/checkbox/checkbox.module';
import { PanelDefaultPosVer, PanelSize } from './panel.enum';
import { values } from 'lodash';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { mockAvatar, mockName, mockJobs } from '../../mock.const';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const panelSize = values(PanelSize);

const template = `<b-panel [panelClass]="panelClass"
          [size]="panelSize"
          [defaultPosVer]="defaultPosVer"
          [showBackdrop]="showBackdrop"
          [openOnHover]="openOnHover"
          [disabled]="disabled"
          (closed)="onPanelDestroyed()"
          (opened)="onPanelOpened()">

    <b-button panel-trigger>
      Time Off Policies info
    </b-button>

    <div panel-content>
      <b-display-3>Time Off Policies info</b-display-3>
      <p>A ‘policy’ is the a collection of rules which govern a type of leave.
      With bob you can add as many holiday policies as you need for your organisation.
      Before we create a policy, a note on what types are.
      <img style="display: block; width: 100%; margin-top: 20px;"
      src="\
      https://downloads.intercomcdn.com/i/o/86579629/3d3ae5d60c93aed41996abed/Screen+Shot+2018-11-20+at+11.19.09.png" />
      </p>
    </div>

</b-panel>`;

const customUseTemplate = `<b-panel #panel
          [openOnHover]="true"
          [showBackdrop]="false"
          [hoverTriggerDelay]="600"
          [overlayOrigin]="{elementRef: panelOrigin}">

    <div panel-content>
     My fancy panel
    </div>

</b-panel>

<b-avatar #avatar
      [imageSource]="imageSource"
      [title]="title"
      [subtitle]="subtitle"
      [isClickable]="true"
      (clicked)="panel.closePanel(); avatar.avatarImage.host.blur();">

      <span #panelOrigin
          (mouseenter)="panel.onMouseEnter(); avatar.avatarImage.host.classList.remove('icon-on-hover');"
          (mouseleave)="panel.onMouseLeave()"
          style="display: block; width: 100%; height: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0;">
      </span>
</b-avatar>`;

const storyTemplate = `<b-story-book-layout [title]="'Overlay panel'">
  <div style="max-width: none; text-align: left; display: flex; justify-content: space-evenly;">
    ${template}
    ${customUseTemplate}
  </div>
</b-story-book-layout>`;

const note = `
  ## Panel

  #### Module
  *PanelModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [panelClass] | string | panel class | &nbsp;
  [size] | PanelSize | panel size | "medium"
  [defaultPosVer] | PanelDefaultPosVer | default vertical position | PanelDefaultPosVer.above
  [showBackdrop] | boolean | show backdrop | true
  [openOnHover] | boolean | trigger panel open on hover (delay 300ms) | false
  [hoverTriggerDelay] | number | delay (in ms) before hover triggers panel open | 300
  [overlayOrigin] | CdkOverlayOrigin | you can provide your own element for the OverlayOrigin:<br>\
   \`\`\`[overlayOrigin]="{ elementRef: elementToAttachPanelTo }"\`\`\`
  [disabled] | boolean | will not open panel on trigger | false
  (opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | Emits panel Opened event | &nbsp;
  (closed) | EventEmitter<wbr>&lt;void&gt; | Emits panel Closed event | &nbsp;
  (positionChanged) | EventEmitter<wbr>&lt;OverlayPositionClasses&gt; | Emits\
   when panel changes position during scrolling (above/below trigger) | &nbsp;


  ~~~
  ${template}
  ~~~

  #### Public methods & properties
  Name | Description
  --- | ---
  openPanel() | opens panel
  closePanel() | destroys panel
  overlayRef | public property that is truthy when panel is opened, and falsy when its not

  ### Trick to load panel content only on panel open
  By default, whatever you put into panel-content will initialize immidiately. You can overcome this with the following trick:

  ~~~
<b-panel #panel (opened)="opened = 1" ....>
    <b-button panel-trigger>My Trigger</b-button>

    <div panel-content>
      <my-component *ngIf="opened === 1">
        ...
      </my-component>
    </div>
</b-panel>
  ~~~

  **Note**: you will have layout issues that you will need to overcome, basically [panel-content] element needs some dimentions set in css.

  ### (More complex) example with external control of panel

  ~~~
  ${customUseTemplate}
  ~~~
`;
story.add(
  'Panel',
  () => ({
    template: storyTemplate,
    props: {
      imageSource: mockAvatar(),
      title: mockName(),
      subtitle: mockJobs(1),
      panelClass: text('panelClass', 'my-panel-class'),
      panelSize: select('size', panelSize, PanelSize.medium),
      defaultPosVer: select(
        'defaultPosVer',
        Object.values(PanelDefaultPosVer),
        PanelDefaultPosVer.above
      ),
      showBackdrop: boolean('showBackdrop', true),
      openOnHover: boolean('openOnHover', false),
      disabled: boolean('disabled', false),
      onPanelDestroyed: action('Panel destroyed'),
      onPanelOpened: action('Panel opened'),
    },
    moduleMetadata: {
      imports: [
        PanelModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        CheckboxModule,
        AvatarModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
