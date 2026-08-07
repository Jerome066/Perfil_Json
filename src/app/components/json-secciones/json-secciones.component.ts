import { Component, effect, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-json-secciones',
  imports: [JsonSeccionesComponent, MatExpansionModule, MatPaginatorModule],
  templateUrl: './json-secciones.component.html',
  styleUrl: './json-secciones.component.css'
})
export class JsonSeccionesComponent {
  /** Nodo seleccionado cuyo contenido se representa de forma recursiva. */
  arbol = input.required<JsonNode | null>();

  /** Estado local del paginador; cada instancia recursiva administra su propia página. */
  pageIndex = signal(0);
  pageSize = signal(10);

  constructor() {
    // Al navegar a otro nodo se vuelve a la primera página de sus arreglos.
    effect(() => {
      this.arbol();
      this.pageIndex.set(0);
    });
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

  mostrarValor(nodo: JsonNode): string {
    if (nodo.tipo === 'null') return 'Nulo';
    return String(nodo.valor ?? '');
  }

  esValorSimple(nodo: JsonNode): boolean {
    return nodo.hijos.length === 0;
  }

  columnasArreglo(nodos: JsonNode[]): string[] {
    return nodos[0]?.hijos.map((nodo) => nodo.nombre) ?? [];
  }

  /** Propiedades escalares del objeto, separadas de sus objetos y arreglos hijos. */
  camposSimples(nodos: JsonNode[]): JsonNode[] {
    return nodos.filter((nodo) => this.esValorSimple(nodo));
  }

  /** Limita la tabla principal a ocho columnas para conservar una lectura cómoda. */
  camposPrincipales(nodos: JsonNode[]): JsonNode[] {
    return this.camposSimples(nodos).slice(0, 8);
  }

  /** Los campos a partir de la novena columna se muestran en paneles expandibles. */
  camposRestantes(nodos: JsonNode[]): JsonNode[] {
    return this.camposSimples(nodos).slice(8);
  }

  columnasPrincipales(nodos: JsonNode[]): string[] {
    return this.columnasArreglo(nodos).slice(0, 8);
  }

  columnasRestantes(nodos: JsonNode[]): string[] {
    return this.columnasArreglo(nodos).slice(8);
  }

  /** Verifica que el arreglo pueda mostrarse como una tabla con columnas consistentes. */
  esArregloDeObjetosUniformes(nodos: JsonNode[]): boolean {
    if (nodos.length === 0 || !nodos.every((nodo) => nodo.tipo === 'object')) {
      return false;
    }

    const columnas = this.columnasArreglo(nodos);
    if (columnas.length === 0 || nodos[0].hijos.some((nodo) => !this.esValorSimple(nodo))) {
      return false;
    }

    return nodos.every((fila) =>
      fila.hijos.length === columnas.length &&
      fila.hijos.every((campo) => this.esValorSimple(campo) && columnas.includes(campo.nombre))
    );
  }

  valorDeCampo(fila: JsonNode, columna: string): string {
    const campo = fila.hijos.find((nodo) => nodo.nombre === columna);
    return campo ? this.mostrarValor(campo) : '';
  }

  /** Obtiene únicamente los elementos visibles de la página activa. */
  elementosPagina(nodos: JsonNode[]): JsonNode[] {
    const inicio = this.pageIndex() * this.pageSize();
    return nodos.slice(inicio, inicio + this.pageSize());
  }

  /** Sincroniza el estado local con las acciones del componente MatPaginator. */
  cambiarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
  }
}
