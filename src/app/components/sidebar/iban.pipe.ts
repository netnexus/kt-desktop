import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'iban' })
export class IbanPipe implements PipeTransform {
  transform(text: string): string {
    // remove all spaces
    let lIban: string = text.replace(/ /g, '');

    // place a space after every 4th character
    lIban = lIban.replace(/(.{4})/g, '$1 ');
    return lIban;
  }
}
