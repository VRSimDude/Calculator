import { Component, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-output',
  imports: [],
  templateUrl: './output.component.html',
  styleUrl: './output.component.css'
})
export class OutputComponent {
  history = input.required<string>();
  currentNumber = input.required<string>();
}