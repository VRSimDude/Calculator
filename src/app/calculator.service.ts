import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private currentNumber = 0;
  private decimals = 0;
  private isCommaAdded = false;
  private isCalculated = false;
  private oldEntry = new Array<{
    oldNumber: number;
    operator: string;
  }>();

  getCurrentNumber(): string {
    return this.roundedNumber();
  }

  getHistory(): string {
    let history = '';

    for (let i = 0; i < this.oldEntry.length; i++) {
      history += Number.isInteger(this.oldEntry[i].oldNumber)
        ? this.oldEntry[i].oldNumber.toString()
        : this.oldEntry[i].oldNumber.toFixed(
            this.oldEntry[i].oldNumber.toString().split('.').length === 2
              ? Math.min(
                  this.oldEntry[i].oldNumber.toString().split('.')[1].length,
                  9
                )
              : 0
          );
      history += ' ' + this.oldEntry[i].operator + ' ';
    }

    return history;
  }

  addNumber(number: number) {
    if (this.isCalculated) {
      this.isCalculated = false;
      this.reset();
      this.currentNumber = number;
    } else if (!this.isNumberMaxValue()) {
      if (!this.isCommaAdded) {
        this.addNumberWithoutComma(number);
      } else {
        this.addNumberWithComma(number);
      }
    }
  }

  private addNumberWithoutComma(number: number) {
    if (
      this.currentNumber !== 0 &&
      number !== 0 &&
      this.currentNumber < 999999999
    ) {
      this.currentNumber *= 10;
      if (this.currentNumber < 0) {
        this.currentNumber -= number;
      } else {
        this.currentNumber += number;
      }
    } else {
      this.currentNumber = number;
    }
  }

  private addNumberWithComma(number: number) {
    if (this.decimals >= 9) {
      return;
    }

    this.decimals++;

    if (number === 0) {
      return;
    }

    let tempNumber: number = number;

    for (let i = 0; i < this.decimals; i++) {
      tempNumber *= 0.1;
    }

    if (this.currentNumber < 0) {
      this.currentNumber -= tempNumber;
    } else {
      this.currentNumber += tempNumber;
    }
  }

  addComma() {
    if (!this.isCalculated) {
      this.isCommaAdded = true;
    }
  }

  changeSign() {
    if (this.currentNumber !== 0) {
      this.currentNumber *= -1;
      if (this.isCalculated) {
        this.isCalculated = false;
        let tempNumber = this.currentNumber;
        let tempDecimals = this.decimals;
        this.reset();
        this.currentNumber = tempNumber;
        this.decimals = tempDecimals;
      }
    }
  }

  addOperator(operator: string) {
    if (this.isCalculated) {
      this.isCalculated = false;
      let tempNumber = this.currentNumber;
      this.reset();
      this.oldEntry.push({
        oldNumber: tempNumber,
        operator: operator,
      });
      return;
    }

    if (this.oldEntry.length !== 0) {
      if (operator === '+' || operator === '-') {
        for (let i = this.oldEntry.length - 1; i >= 0; i--) {
          if (this.oldEntry[i].operator === '+') {
            this.currentNumber =
              this.oldEntry[i].oldNumber + this.currentNumber;
          } else if (this.oldEntry[i].operator === '-') {
            this.currentNumber =
              this.oldEntry[i].oldNumber - this.currentNumber;
          } else if (this.oldEntry[i].operator === '*') {
            this.currentNumber =
              this.oldEntry[i].oldNumber * this.currentNumber;
          } else if (this.oldEntry[i].operator === '/') {
            this.currentNumber =
              this.oldEntry[i].oldNumber / this.currentNumber;
          }
        }
        this.oldEntry = [];
        this.oldEntry.push({
          oldNumber: this.currentNumber,
          operator: operator,
        });
      } else {
        if (this.oldEntry[this.oldEntry.length - 1].operator === '*') {
          this.oldEntry[this.oldEntry.length - 1].oldNumber =
            this.oldEntry[this.oldEntry.length - 1].oldNumber *
            this.currentNumber;
          this.oldEntry[this.oldEntry.length - 1].operator = operator;
        } else if (this.oldEntry[this.oldEntry.length - 1].operator === '/') {
          this.oldEntry[this.oldEntry.length - 1].oldNumber =
            this.oldEntry[this.oldEntry.length - 1].oldNumber /
            this.currentNumber;
          this.oldEntry[this.oldEntry.length - 1].operator = operator;
        } else {
          this.oldEntry.push({
            oldNumber: this.currentNumber,
            operator: operator,
          });
        }
      }
    } else {
      this.oldEntry.push({
        oldNumber: this.currentNumber,
        operator: operator,
      });
    }

    this.currentNumber = 0;
    this.isCommaAdded = false;
    this.decimals = 0;
  }

  reset() {
    this.currentNumber = 0;
    this.isCommaAdded = false;
    this.isCalculated = false;
    this.decimals = 0;
    this.oldEntry = [];
  }

  calculate() {
    if (this.oldEntry.length === 0) {
      return;
    } else if (this.oldEntry[this.oldEntry.length - 1].operator === '=') {
      return;
    }

    let tempNumber = this.currentNumber;

    for (let i = this.oldEntry.length - 1; i >= 0; i--) {
      if (this.oldEntry[i].operator === '+') {
        this.currentNumber = this.oldEntry[i].oldNumber + this.currentNumber;
      } else if (this.oldEntry[i].operator === '-') {
        this.currentNumber = this.oldEntry[i].oldNumber - this.currentNumber;
      } else if (this.oldEntry[i].operator === '*') {
        this.currentNumber = this.oldEntry[i].oldNumber * this.currentNumber;
      } else if (this.oldEntry[i].operator === '/') {
        this.currentNumber = this.oldEntry[i].oldNumber / this.currentNumber;
      }
    }
    this.oldEntry.push({
      oldNumber: tempNumber,
      operator: '=',
    });

    this.isCommaAdded = false;
    this.isCalculated = true;
    this.decimals = -1;
  }

  private roundedNumber(): string {
    if (this.isCommaAdded) {
      return this.currentNumber.toFixed(this.decimals);
    } else if (Number.isInteger(this.currentNumber)) {
      return this.currentNumber.toFixed(0);
    } else {
      return this.currentNumber.toFixed(
        this.currentNumber.toString().split('.').length === 2
          ? Math.min(this.currentNumber.toString().split('.')[1].length, 9)
          : 0
      );
    }
  }

  private isNumberMaxValue(): boolean {
    if (
      Number.isInteger(this.currentNumber) &&
      (this.currentNumber >= 999999999 || this.currentNumber <= -999999999)
    ) {
      return true;
    } else if (
      !Number.isInteger(this.currentNumber) &&
      (this.currentNumber >= 999999999.999999999 ||
        this.currentNumber <= -999999999.999999999)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
