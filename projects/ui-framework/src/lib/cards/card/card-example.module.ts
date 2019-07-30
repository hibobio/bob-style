import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsModule } from '../cards.module';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { Card } from './card.interface';
import { CardType } from '../cards.enum';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';

@Component({
  selector: 'b-card-example-1-component',
  template: `
    <b-card [card]="cardMockData"
            [type]="type"
            (clicked)="onCardClick($event)">
      <div card-top
           class="top">
        <b-icon [icon]="icons.surveys"
                [size]="iconSize.small"
                [color]="iconColor.normal">
        </b-icon>
        <span>12 questions</span>
      </div>
      <div card-content>
        <p>
          Dig deeper into your employeesw experience to fully understand their perspectives, attitudes and needs
        </p>
      </div>
    </b-card>
  `,
  styles: [`
    p {
      margin: 0;
    }

    .top {
      display: flex;
      align-items: center;
      color: #9d9d9d;
    }

    .top b-icon {
      margin-right: 4px;
    }`
  ],
})
export class CardExample1Component {

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;

  type: CardType = CardType.large;

  cardMockData: Card = {
    title: 'Extensive Management',
    menuConfig: [
      {
        label: 'duplicate',
        action: () => console.log('duplicate'),
      },
      {
        label: 'delete',
        action: () => console.log('delete'),
      },
    ],
    footerCtaLabel: 'MANAGE',
  };

  constructor() {
  }

  onCardClick($event): void {
    console.log('card cta click');
  }
}

@Component({
  selector: 'b-card-example-2-component',
  template: `
    <b-card [card]="cardMockData"
            [type]="type"
            (clicked)="onCardClick($event)">
      <div card-top
           class="top">
        <b-icon [icon]="icons.person"
                [size]="iconSize.small"
                [color]="iconColor.white">
        </b-icon>
        <span>4 people</span>
      </div>
    </b-card>
  `,
  styles: [`
    .top {
      display: flex;
      align-items: center;
      color: white;
    }

    .top b-icon {
      margin-right: 4px;
    }`
  ],
})
export class CardExample2Component {

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;

  type: CardType = CardType.regular;

  cardMockData: Card = {
    title: 'New York - offices in Brooklyn, door code: 2580*',
    // tslint:disable-next-line: max-line-length
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    menuConfig: [
      {
        label: 'duplicate',
        action: () => console.log('duplicate'),
      },
      {
        label: 'delete',
        action: () => console.log('delete'),
      },
    ],
    footerCtaLabel: 'EDIT',
  };

  constructor() {
  }

  onCardClick($event): void {
    console.log('card cta click');
  }
}

@Component({
  selector: 'b-card-example-3-component',
  template: `
    <b-card [card]="cardMockData"
            [type]="type"
            (clicked)="onCardClick($event)">
      <div card-top
           class="top">
        <b-icon [icon]="icons.person"
                [size]="iconSize.small"
                [color]="iconColor.white">
        </b-icon>
        <span>1 enrolled</span>
      </div>
      <div card-content>
        <div class="benefit-detail">
          <span>Provider</span>
          <span>Aviva</span>
        </div>
        <div class="benefit-detail">
          <span>Renewal</span>
          <span>03/08/2020</span>
        </div>
      </div>
    </b-card>
  `,
  styles: [`
    .top {
      display: flex;
      align-items: center;
      color: white;
    }

    .top b-icon {
      margin-right: 4px;
    }

    .benefit-detail {
      margin-bottom: 8px;
    }

    .benefit-detail span {
      display: block;
    }

    .benefit-detail span:first-child {
      color: #9D9D9D;
    }
  `
  ],
})
export class CardExample3Component {

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;

  type: CardType = CardType.regular;

  cardMockData: Card = {
    title: 'Medical Insurance',
    // tslint:disable-next-line: max-line-length
    imageUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80',
    menuConfig: [
      {
        label: 'duplicate',
        action: () => console.log('duplicate'),
      },
      {
        label: 'delete',
        action: () => console.log('delete'),
      },
    ],
    footerCtaLabel: 'REQUEST',
  };

  constructor() {
  }

  onCardClick($event): void {
    console.log('card cta click');
  }
}

@Component({
  selector: 'b-card-example-4-component',
  template: `
    <b-card [card]="cardMockData"
            [type]="type">
      <div card-top
           class="top">
        <b-avatar
          card-top
          imageSource="https://randomuser.me/api/portraits/women/46.jpg"
          title="Amy Tulin Miles">
        </b-avatar>
      </div>
      <div card-content>
        <b-slider [value]="25"
                  [readOnly]="false">
        </b-slider>
      </div>
    </b-card>
  `,
  styles: [`
    b-slider {
      margin: 8px 0 16px;
    }`
  ],
})
export class CardExample4Component {

  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;

  type: CardType = CardType.small;

  cardMockData: Card = {
    title: 'This is a very long title for a goal card and some of the text will be truncated',
    actionConfig: {
      icon: Icons.delete,
      tooltip: 'delete',
      action: ($event) => console.log('delete'),
    },
  };

  constructor() {
  }
}

@NgModule({
  declarations: [
    CardExample1Component,
    CardExample2Component,
    CardExample3Component,
    CardExample4Component,
  ],
  imports: [
    CommonModule,
    CardsModule,
    IconsModule,
    SliderModule,
    AvatarModule,
  ],
  exports: [
    CardExample1Component,
    CardExample2Component,
    CardExample3Component,
    CardExample4Component,
  ],
})
export class CardExampleModule {
}
