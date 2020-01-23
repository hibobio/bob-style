import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emojiFromCode'
})
export class EmojiFromCodePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    return String.fromCodePoint(...value.split('-').map(u => Number(`0x${u}`)));
  }
}
