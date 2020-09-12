import { Injectable } from '@angular/core';

function _document(): Document {
  // return the global native browser document object
  return document;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentRef {
  get nativeDocument(): Document {
    return _document();
  }
}
