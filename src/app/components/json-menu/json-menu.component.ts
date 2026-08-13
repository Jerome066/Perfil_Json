import { Component, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { JsonSeccionesComponent } from '../json-secciones/json-secciones.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { JsonTablesComponent } from '../json-tables/json-tables.component';
import { JsonCardsComponent } from '../json-cards/json-cards.component';

@Component({
  selector: 'app-json-menu',
  imports: [MatButtonModule, MatListModule, MatButtonToggleModule, JsonTablesComponent, MatIconModule,JsonCardsComponent],
  templateUrl: './json-menu.component.html',
  styleUrl: './json-menu.component.css'
})
export class JsonMenuComponent {
  /** Nodos del segundo nivel que se presentan como opciones del menú. */
  arbol = input.required<JsonNode[]>();

  /** Nodo elegido por el usuario; su detalle se delega a JsonSeccionesComponent. */
  nodoActual = signal<JsonNode | null>(null);

  /**Cambio de vista */
  vista = signal<'card' | 'table'>('table');

  /** Actualiza la sección cuyo contenido se muestra debajo del menú. */
  informacionNodo(nodo: JsonNode): void {
    this.nodoActual.set(nodo);
  }

  /** Convierte claves técnicas (camelCase, snake_case o kebab-case) en etiquetas legibles. */
  formarString(key: string): string {
    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/[_-]/g, ' ');               // snake_case / kebab-case
    return withSpaces
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }


  //Cambio de vista entre tarjetas y tabla
  cambiarVista(valor: 'card' | 'table') {
    this.vista.set(valor);
  }
}
