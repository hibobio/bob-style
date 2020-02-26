import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[froalaView]'
})
export class FroalaViewDirective {

  private _element: HTMLElement;

  constructor(private renderer: Renderer2, element: ElementRef) {
    this._element = element.nativeElement;
  }

  // update content model as it comes
  @Input() set froalaView(content: string){
    this._element.innerHTML = content;
  }

  ngAfterViewInit() {
    this.renderer.addClass(this._element, "fr-view");
  }
}
