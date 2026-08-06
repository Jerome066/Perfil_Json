import { Component, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-json-menu',
  imports: [MatButtonModule, MatListModule],
  templateUrl: './json-menu.component.html',
  styleUrl: './json-menu.component.css'
})
export class JsonMenuComponent {
  arbol = input.required<JsonNode[]>();
  mensaje = signal<string>("");
  mostrarContenidoH = signal<true | false>(false);


  msjValor (cadena: string):void{
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
