import { Directive, OnInit, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[spy]',
})
export class SpyDirective implements OnInit {
  @Input() spy: string;

  public ngOnInit(): void {
    console.log(`Spy initialized: [${this.spy}].`);
  }
}
