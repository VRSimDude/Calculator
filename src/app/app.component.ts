import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { OutputComponent } from './output/output.component';
import { InputComponent } from './input/input.component';
import { CalculatorService } from './calculator.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, OutputComponent, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'calculator';

  private calculatorService = inject(CalculatorService);
  history = signal<string>('');
  currentNumber = signal<string>('0');

  updateOutput() {
    this.history.set(this.calculatorService.getHistory());
    this.currentNumber.set(this.calculatorService.getCurrentNumber());
  }
}
