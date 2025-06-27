import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected lastNumberDrawn = signal<string | null>(null);

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
  }
}
