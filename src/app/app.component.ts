import { Component, OnInit, signal } from '@angular/core';

const lastNumberKey = 'LAST_NUMBER';
const numbersKey = 'NUMBERS';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected lastNumberDrawn = signal<string | null>(null);

  ngOnInit(): void {
    const lastNumber = localStorage.getItem(lastNumberKey);
    const numbers = localStorage.getItem(numbersKey);

    if ((!!numbers && !!lastNumber) == false) {
      return;
    }

    this.numbers = JSON.parse(numbers!);
    this.lastNumberDrawn.set(lastNumber);
  }

  protected numbers = Array.from({ length: 100 }, (_, i) => ({
    num: i.toString(),
    isDrawn: false,
  }));

  protected drawNumber(event: any, input: HTMLInputElement) {
    if (event.key != 'Enter') {
      return;
    }

    var selectedNumber = this.numbers.find(
      (p) => p.num == input.value && p.isDrawn == false,
    );

    input.value = '';

    if (selectedNumber == null) {
      return;
    }

    selectedNumber.isDrawn = true;
    this.lastNumberDrawn.set(selectedNumber.num);

    localStorage.setItem(lastNumberKey, selectedNumber.num);
    localStorage.setItem(numbersKey, JSON.stringify(this.numbers));
  }

  protected clear() {
    localStorage.clear();

    this.numbers = Array.from({ length: 100 }, (_, i) => ({
      num: i.toString(),
      isDrawn: false,
    }));

    this.lastNumberDrawn.set(null);
  }
}
