import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor() { }
  preventFromAlphabet(e) {
  const excludedKeys = [8, 37, 39, 46];
    if (!((e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      (excludedKeys.includes(e.keyCode)))) {
      console.log('in of parttt', e);
      event.preventDefault();
    }
  }
}
