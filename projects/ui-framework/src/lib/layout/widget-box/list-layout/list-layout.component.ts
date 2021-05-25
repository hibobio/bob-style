import { Component, Input } from '@angular/core';
import { ButtonType, ButtonSize } from '../../../buttons/buttons.enum';
import { ContentTemplateConsumer } from '../../../services/utils/contentTemplate.directive';

@Component({
  selector: 'b-list-layout',
  templateUrl: 'list-layout.component.html',
  styleUrls: ['./list-layout.component.scss']
})

export class ListLayoutComponent extends ContentTemplateConsumer {
  @Input() items: any[];
  showAll: boolean;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly defaultNumOfItems = 3;

  ngOnInit() { }
}
