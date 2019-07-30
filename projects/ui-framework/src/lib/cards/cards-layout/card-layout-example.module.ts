import { Component, Input, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CardsModule } from '../cards.module';
import { BrowserModule } from '@angular/platform-browser';
import { action } from '@storybook/addon-actions';
import { CardType } from '../cards.enum';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { mockAvatar, mockDate, mockImage, mockJobs, mockNames } from '../../mock.const';
import { CardsMockData, EmployeeCardsMockData } from '../cards.mock';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { CardsLayoutComponent } from './cards-layout.component';
import { Subscription } from 'rxjs';
import { Card } from '../card/card.interface';
import { AddCard } from '../card-add/card-add.interface';
import { CardEmployee } from '../card-employee/card-employee.interface';
import { TypographyModule } from '../../typography/typography.module';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'b-card-layout-example-1',
  template: `
    <b-cards [type]="type" [alignCenter]="alignCenter">
      <b-card-add [type]="type" (clicked)="onAddCardClick()" [card]="addCard">
      </b-card-add>
      <b-card *ngFor="let card of cards; let i = index"
              [type]="type"
              (clicked)="onCardClick(card, i)"
              [card]="card">
        <b-avatar card-top
                  [imageSource]="avatars[i].imageUrl"
                  [title]="avatars[i].displayName">
        </b-avatar>
        <div card-content *ngIf="i % 2 === 0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        <div card-content *ngIf="i % 2 !== 0">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </b-card>
    </b-cards>
  `,
})
export class CardLayoutExample1Component implements OnInit {
  @Input() type: CardType = CardType.regular;
  @Input() alignCenter = false;

  addCard: AddCard = {
    title: 'Add a new flow',
    subtitle: 'Right now',
    action: action('Add Card was clicked')
  };

  cards: Card[] = cloneDeep(CardsMockData);
  avatars: any = [];

  constructor() {
  }

  ngOnInit(): void {
    this.cards.forEach((d, index) => {
      this.avatars.push({
        imageUrl: mockAvatar(),
        displayName: mockNames(1)
      });
    });
  }

  onAddCardClick(): void {
    console.log('on add card click');
  }

  onCardClick(cardData: Card, index: number): void {
    console.log('cardData', cardData);
    console.log('index', index);
  }
}

@Component({
  selector: 'b-card-layout-example-2',
  template: `
    <b-cards [type]="type" [alignCenter]="alignCenter">
      <b-card-employee *ngFor="let card of cards; let i = index"
                       [type]="type"
                       (click)="onClick($event)"
                       [card]="card">
        <b-caption card-bottom><b>Likes:</b> {{hobbies[i]}}</b-caption>
      </b-card-employee>
    </b-cards>
  `,
})
export class CardLayoutExample2Component implements OnInit {
  @Input() alignCenter = false;
  @Input() type: CardType = CardType.large;

  cards: CardEmployee[] = EmployeeCardsMockData;
  hobbies: string[] = [];

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.cards.length; i++) {
      const hobbies = 'climbing, hiking';
      this.hobbies.push(hobbies);
    }
  }

  onClick($event): void {
    console.log('navigate to employee');
  }
}

@Component({
  selector: 'b-card-layout-example-3',
  template: `
    <b-cards [type]="type" [alignCenter]="alignCenter">
      <b-card-employee *ngFor="let card of cards; let i = index"
                       [type]="type"
                       (click)="onClick($event)"
                       [card]="card">
        <b-caption card-bottom>{{dates[i]}}</b-caption>
      </b-card-employee>
    </b-cards>
  `,
})
export class CardLayoutExample3Component implements OnInit, OnDestroy {
  @Input() alignCenter = false;
  @Input() type: CardType = CardType.small;

  cards: CardEmployee[] = [];
  dates: string[] = [];

  private numberOfCardsSubscription: Subscription;

  @ViewChild(CardsLayoutComponent, { static: false })
  set amountOfCardsFn(bCardsComponent: CardsLayoutComponent) {
    this.numberOfCardsSubscription = bCardsComponent
      .getCardsInRow$()
      .subscribe(numberOfCards => {
        console.log('number of cards in a row (example 3)', numberOfCards);
      });
  }

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < 5; i++) {
      this.cards.push({
        imageSource: mockAvatar(),
        title: mockNames(1),
        subtitle: mockJobs(1),
        coverColors: {
          color1: '#fea54a',
          color2: '#fe4a4a',
        }
      });
      this.dates.push(mockDate());
    }
  }

  onClick($event): void {
    console.log('navigate to employee');
  }

  ngOnDestroy(): void {
    this.numberOfCardsSubscription.unsubscribe();
  }
}

@Component({
  selector: 'b-card-layout-example-4',
  template: `
    <b-cards [type]="type" [alignCenter]="alignCenter">
      <b-card-add [type]="type" (clicked)="onAddCardClick()" [card]="addCard">
      </b-card-add>
      <b-card *ngFor="let card of cards; let i = index"
              [type]="type"
              (clicked)="onCardClick(card, i)"
              [card]="card">
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
    </b-cards>
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
export class CardLayoutExample4Component implements OnInit {
  @Input() type: CardType = CardType.regular;
  @Input() alignCenter = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  addCard: AddCard = {
    title: 'Add a new flow',
    subtitle: 'Right now',
    action: action('Add Card was clicked')
  };

  cards: Card[] = cloneDeep(CardsMockData);

  constructor() {
  }

  ngOnInit(): void {
    this.cards.forEach((card, index) => {
      card.imageUrl = mockImage(400, 300);
    });
  }

  onAddCardClick(): void {
    console.log('on add card click');
  }

  onCardClick(cardData: Card, index: number): void {
    console.log('cardData', cardData);
    console.log('index', index);
  }
}

@NgModule({
  declarations: [
    CardLayoutExample1Component,
    CardLayoutExample2Component,
    CardLayoutExample3Component,
    CardLayoutExample4Component,
  ],
  imports: [
    BrowserModule,
    CardsModule,
    AvatarModule,
    SliderModule,
    TypographyModule,
    IconsModule,
  ],
  exports: [
    CardLayoutExample1Component,
    CardLayoutExample2Component,
    CardLayoutExample3Component,
    CardLayoutExample4Component,
  ]
})
export class CardLayoutExampleModule {
}
