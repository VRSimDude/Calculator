import { Component, EventEmitter, inject, output, signal } from '@angular/core';
import { CalculatorService } from '../calculator.service';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  updateOutput = output();
  private calculatorService = inject(CalculatorService);

  onClickNumber(number: number) {
    this.calculatorService.addNumber(number);
    this.updateOutput.emit();
  }
  
  onAddComma() {
    this.calculatorService.addComma();
  }
  
  onClickOperator(operator: string) {
    this.calculatorService.addOperator(operator);
    this.updateOutput.emit();
  }
  
  onClickChangeSign() {
    this.calculatorService.changeSign();
    this.updateOutput.emit();
  }
  
  onClickReset() {
    this.calculatorService.reset();
    this.updateOutput.emit();
  }
  
  onClickResult() {
    this.calculatorService.calculate();
    this.updateOutput.emit();
  }
}
