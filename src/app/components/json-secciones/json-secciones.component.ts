import { Component, input } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-json-secciones',
  imports: [MatListModule],
  templateUrl: './json-secciones.component.html',
  styleUrl: './json-secciones.component.css'
})
export class JsonSeccionesComponent {
  arbol = input.required<JsonNode | null>();
  formarString(key: string): string {
    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/[_-]/g, ' ');               // snake_case / kebab-case
    return withSpaces
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
