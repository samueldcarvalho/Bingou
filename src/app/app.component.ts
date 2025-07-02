import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

const lastNumberKey = 'LAST_NUMBER';
const columnsKey = 'COLUMNS';

interface columnType {
  columnId: string;
  numbers: numberType[];
}

interface numberType {
  num: string;
  isDrawn: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('inputNumber')
  protected inputNumber!: ElementRef;
  protected headers = ['B', 'I', 'N', 'G', 'O'];
  protected columns = signal<columnType[]>([]);
  protected lastNumberDrawn = signal<string | null>(null);

  protected router = inject(Router);

  ngOnInit(): void {
    const lastNumber = localStorage.getItem(lastNumberKey);
    const columns = localStorage.getItem(columnsKey);

    if ((!!columns && !!lastNumber) == true) {
      this.columns.set(JSON.parse(columns!));
      this.lastNumberDrawn.set(lastNumber);

      return;
    }

    this.generateColumns();
  }

  private generateColumns() {
    this.columns.set([]);
    let count = 0;

    for (let header of this.headers) {
      const column = {
        columnId: header,
        numbers: [],
      } as columnType;

      const initialValue = count * 15 + 1;

      column.numbers = Array.from({ length: 15 }, (_, j) => ({
        num: (initialValue + j).toString(),
        isDrawn: false,
      }));

      this.columns.update((old) => [...old, column]);

      count++;
    }
  }

  protected onPressEnterOnCell(event: any, number: string) {
    if (event.key != 'Enter') {
      return;
    }

    this.drawNumber(number);
  }

  protected drawNumber(selectedNumber: string) {
    const allNumbers = this.columns().flatMap((i) => i.numbers);
    const selectedItem = allNumbers.find((p) => p.num == selectedNumber);

    console.log(this.inputNumber);

    this.inputNumber.nativeElement.value = '';
    this.inputNumber.nativeElement.focus();

    if (selectedItem == null) {
      return;
    }

    selectedItem.isDrawn = true;
    this.lastNumberDrawn.set(selectedItem.num);

    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    localStorage.setItem(lastNumberKey, this.lastNumberDrawn() ?? '');
    localStorage.setItem(columnsKey, JSON.stringify(this.columns()));
  }

  protected clear() {
    localStorage.clear();
    this.lastNumberDrawn.set(null);
    this.generateColumns();
  }
}
