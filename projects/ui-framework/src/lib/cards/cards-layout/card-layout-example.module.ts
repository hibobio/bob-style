import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CardsModule } from '../cards.module';
import { BrowserModule } from '@angular/platform-browser';
import { action } from '@storybook/addon-actions';
import { AddCardData, CardData, CardEmployee } from '../cards.interface';
import { CardType } from '../cards.enum';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { mockAvatar, mockJobs, mockNames } from '../../mock.const';
import { CardsMockData } from '../cards.mock';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { randomNumber } from '../../services/utils/functional-utils';
import {MiniEmployeeCard} from '../mini-card-employee/mini-card-employee.component';

@Component({
  selector: 'b-card-layout-example-1',
  template: `
    <b-cards [type]="type">
      <b-card-add [type]="type"
                  (clicked)="onAddCardClick()"
                  [card]="addCard">
      </b-card-add>
      <b-card *ngFor="let card of cards; let i = index"
              [type]="type"
              [clickable]="true"
              (clicked)="onCardClick(card, i)"
              [card]="card">
        <b-avatar card-top
                  [imageSource]="avatars[i].imageUrl"
                  [title]="avatars[i].displayName">
        </b-avatar>
        <b-slider card-bottom
                  [value]="sliders[i].value"
                  [readOnly]="sliders[i].readOnly">
        </b-slider>
      </b-card>
    </b-cards>
  `,
})
export class CardLayoutExample1Component implements OnInit {

  @Input() type: CardType = CardType.regular;

  addCard: AddCardData = {
    title: 'Add a new flow',
    subtitle: 'Right now',
    action: action('Add Card was clicked')
  };

  cards: CardData[] = CardsMockData;
  avatars: any = [];
  sliders: any = [];

  constructor() {
  }

  ngOnInit(): void {
    this.cards.forEach((d, index) => {
      this.avatars.push({
        imageUrl: mockAvatar(),
        displayName: mockNames(30)[index],
      });
      this.sliders.push({
        value: randomNumber(10, 90),
        readOnly: true
      });
    });
  }

  onAddCardClick(): void {
    console.log('on add card click');
  }

  onCardClick(cardData: CardData, index: number): void {
    console.log('cardData', cardData);
    console.log('index', index);
  }
}

@Component({
  selector: 'b-card-layout-example-2',
  template: `
    <b-cards [type]="type">
      <b-card-employee *ngFor="let card of cards; let i = index"
                       [clickable]="true"
                       (clicked)="onCardClick(card, i)"
                       [card]="card">
      </b-card-employee>
    </b-cards>
  `,
})
export class CardLayoutExample2Component implements OnInit {

  @Input() type: CardType = CardType.regular;

  cards: CardEmployee[] = [];

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < 6; i++) {
      this.cards.push({
        imageSource: mockAvatar(),
        title: mockNames(30)[i],
        subtitle: mockJobs(1),
      });
    }
  }

  onCardClick(cardData: CardEmployee, index: number): void {
    console.log('cardData', cardData);
    console.log('index', index);
  }
}

@Component({
  selector: 'b-card-layout-example-3',
  template: `
    <b-cards [type]="type">
      <b-mini-employee-card *ngFor="let card of cards; let i = index"
                       [clickable]="true"
                       [card]="card">
      </b-mini-employee-card>
    </b-cards>
  `,
})
export class CardLayoutExample3Component implements OnInit {

  @Input() type: CardType = CardType.small;

  cards: MiniEmployeeCard[] = [];

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < 6; i++) {
      this.cards.push({
        imageSource: mockAvatar(),
        title: mockNames(30)[i],
        subtitle: mockJobs(1),
        footer: 'mock'
      });
    }
  }

  onCardClick(cardData: CardEmployee, index: number): void {
    console.log('cardData', cardData);
    console.log('index', index);
  }
}


@NgModule({
  declarations: [
    CardLayoutExample1Component,
    CardLayoutExample2Component,
    CardLayoutExample3Component
  ],
  imports: [
    BrowserModule,
    CardsModule,
    AvatarModule,
    SliderModule,
  ],
  exports: [
    CardLayoutExample1Component,
    CardLayoutExample2Component,
    CardLayoutExample3Component
  ],
})
export class CardLayoutExampleModule {
}
