import { Component, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { JsonSeccionesComponent } from '../json-secciones/json-secciones.component';

@Component({
  selector: 'app-json-menu',
  imports: [MatButtonModule, MatListModule, JsonSeccionesComponent],
  templateUrl: './json-menu.component.html',
  styleUrl: './json-menu.component.css'
})
export class JsonMenuComponent {
  [x: string]: any;
  arbol = input.required<JsonNode[]>();
  mensaje = signal<string>("");
  nodoActual = signal<JsonNode | null>( null);

  informacionNodo(nodo: JsonNode): void {
    this.nodoActual.set(nodo);
  }

  msjValor(cadena: string): void {
    this.mensaje.set(this.mensaje + cadena);
  }

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
