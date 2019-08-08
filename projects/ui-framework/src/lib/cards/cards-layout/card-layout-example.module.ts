import {
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CardsModule } from '../cards.module';
import { BrowserModule } from '@angular/platform-browser';
import { CardType } from '../cards.enum';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import {
  mockAvatar,
  mockDate,
  mockImage,
  mockNames,
  mockHobbies,
  mockText
} from '../../mock.const';
import {
  AddCardMockData,
  getEmployeeCardsMockData,
  getCardsMockData
} from '../cards.mock';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { CardsLayoutComponent } from './cards-layout.component';
import { Subscription } from 'rxjs';
import { Card } from '../card/card.interface';
import { AddCard } from '../card-add/card-add.interface';
import { TypographyModule } from '../../typography/typography.module';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { randomNumber } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-card-layout-example-1',
  template: `
    <b-cards [type]="type" [alignCenter]="alignCenter">
      <b-card-add [type]="type" (clicked)="onAddCardClick()" [card]="addCard">
      </b-card-add>
      <b-card
        *ngFor="let card of cards; let i = index"
        [type]="type"
        (clicked)="onCardClick(card, i)"
        [card]="card"
      >
        <b-avatar
          card-top
          [imageSource]="card.avatarImgUrl"
          [title]="card.avatarDisplayName"
        >
        </b-avatar>
        <div card-content>
          {{ card.text }}
        </div>
      </b-card>
    </b-cards>
  `,
  styles: [':host {display: block;}']
})
export class CardLayoutExample1Component implements OnInit {
  @Input() type: CardType = CardType.regular;
  @Input() alignCenter = false;

  addCard: AddCard = AddCardMockData;

  cards: any[] = getCardsMockData(5).map(card => ({
    ...card,
    text: mockText(randomNumber(10, 25)) + '.',
    avatarImgUrl: mockAvatar(),
    avatarDisplayName: mockNames(1)
  }));

  constructor() {}

  ngOnInit(): void {}

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
      <b-card-employee
        *ngFor="let card of cards; let i = index"
        [type]="type"
        (clicked)="onClick($event)"
        [card]="card"
      >
        <div card-bottom data-min-lines="2">
          <b>Likes:</b> {{ card.hobbies }}
        </div>
      </b-card-employee>
    </b-cards>
  `,
  styles: [':host {display: block;}']
})
export class CardLayoutExample2Component implements OnInit {
  @Input() alignCenter = false;
  @Input() type: CardType = CardType.large;

  cards: any[] = getEmployeeCardsMockData(6).map(card => ({
    ...card,
    hobbies: mockHobbies(4).join(', ')
  }));

  constructor() {}

  ngOnInit(): void {}

  onClick($event): void {
    console.log('navigate to employee');
  }
}

@Component({
  selector: 'b-card-layout-example-3',
  template: `
    <b-cards [type]="type" [alignCenter]="alignCenter">
      <b-card-employee
        *ngFor="let card of cards; let i = index"
        [type]="type"
        (clicked)="onClick($event)"
        [card]="card"
      >
        <b-caption card-bottom>{{ card.date }}</b-caption>
      </b-card-employee>
    </b-cards>
  `,
  styles: [':host {display: block;}']
})
export class CardLayoutExample3Component implements OnInit, OnDestroy {
  @Input() alignCenter = false;
  @Input() type: CardType = CardType.small;

  cards: any[] = getEmployeeCardsMockData(6).map(card => ({
    ...card,
    date: mockDate()
  }));
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

  constructor() {}

  ngOnInit(): void {}

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
      <b-card
        *ngFor="let card of cards; let i = index"
        [type]="type"
        (clicked)="onCardClick(card, i)"
        [card]="card"
      >
        <div card-top class="top">
          <b-icon
            [icon]="icons.person"
            [size]="iconSize.small"
            [color]="iconColor.white"
          >
          </b-icon>
          <span>{{ card.number }} enrolled</span>
        </div>
        <div card-content>
          <div class="benefit-detail">
            <span>Provider</span>
            <span>{{ card.provider }}</span>
          </div>
          <div class="benefit-detail">
            <span>Renewal</span>
            <span>{{ card.date }}</span>
          </div>
        </div>
      </b-card>
    </b-cards>
  `,
  styles: [
    `
      :host {
        display: block;
      }
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
        color: #9d9d9d;
      }
    `,
    ''
  ],
  providers: []
})
export class CardLayoutExample4Component implements OnInit {
  @Input() type: CardType = CardType.regular;
  @Input() alignCenter = false;

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  addCard: AddCard = AddCardMockData;

  cards: any[] = getCardsMockData(5).map(card => ({
    ...card,
    imageUrl: mockImage(400, 300),
    provider: mockText(1),
    date: mockDate(),
    number: randomNumber(1, 1000)
  }));

  constructor() {}

  ngOnInit(): void {}

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
    CardLayoutExample4Component
  ],
  imports: [
    BrowserModule,
    CardsModule,
    AvatarModule,
    SliderModule,
    TypographyModule,
    IconsModule
  ],
  exports: [
    CardLayoutExample1Component,
    CardLayoutExample2Component,
    CardLayoutExample3Component,
    CardLayoutExample4Component
  ]
})
export class CardLayoutExampleModule {}
