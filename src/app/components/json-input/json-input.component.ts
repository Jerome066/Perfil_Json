import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonNodeComponent } from '../json-node/json-node.component';
import { JsonLevelsComponent } from '../json-levels/json-levels.component';
@Component({
  selector: 'app-json-input',
  imports: [CommonModule,JsonNodeComponent, JsonLevelsComponent],
  templateUrl: './json-input.component.html',
  styleUrl: './json-input.component.css'
})
export class JsonInputComponent {
  jsonData = signal<unknown>(null);
  error = signal<string | null>(null);

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error.set(null);

    try {
      const text = await file.text(); // File API moderna, sin FileReader manual
      const parsed = JSON.parse(text);
      this.jsonData.set(parsed);
    } catch (e) {
      this.error.set('El archivo no contiene un JSON válido.');
      this.jsonData.set(null);
    }
  }
}
