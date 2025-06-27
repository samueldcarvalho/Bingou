import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const lastNumberKey = 'LAST_NUMBER';
const numbersKey = 'NUMBERS';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected router = inject(Router);
  protected lastNumberDrawn = signal<string | null>(null);

  private _numbersQuantity = signal(75);

  protected columnsQuantity = computed(() => {
    const sqrt = Math.ceil(Math.sqrt(this._numbersQuantity()));

    return sqrt.toFixed(0);
  });

  ngOnInit(): void {
    const lastNumber = localStorage.getItem(lastNumberKey);
    const numbers = localStorage.getItem(numbersKey);

    if ((!!numbers && !!lastNumber) == false) {
      this.router.routerState.root.queryParams.subscribe((params) => {
        const quantity = params['quantity'];

        if (quantity == null) {
          this.resetNumbers(this._numbersQuantity());
          return;
        }

        this._numbersQuantity.set(Number.parseInt(quantity));
        this.resetNumbers(this._numbersQuantity());
      });

      return;
    }

    this.numbers = JSON.parse(numbers!);
    this.lastNumberDrawn.set(lastNumber);
  }

  protected numbers = Array.from({ length: 65 }, (_, i) => ({
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
    this.lastNumberDrawn.set(null);
    this.resetNumbers(this._numbersQuantity());
  }

  private resetNumbers(quantity: number) {
    this.numbers = Array.from({ length: quantity }, (_, i) => ({
      num: i.toString(),
      isDrawn: false,
    }));
  }
}
