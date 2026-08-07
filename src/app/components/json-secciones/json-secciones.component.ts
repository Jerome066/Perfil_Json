import { Component, effect, inject, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-json-secciones',
  imports: [JsonSeccionesComponent, MatButtonModule, MatExpansionModule, MatPaginatorModule],
  templateUrl: './json-secciones.component.html',
  styleUrl: './json-secciones.component.css'
})
export class JsonSeccionesComponent {
  /** Nodo seleccionado cuyo contenido se representa de forma recursiva. */
  arbol = input.required<JsonNode | null>();

  /** Estado local del paginador; cada instancia recursiva administra su propia página. */
  pageIndex = signal(0);
  pageSize = signal(10);
  private readonly dialog = inject(MatDialog);

  /** Restablece la página al recibir un nuevo nodo, evitando índices inválidos. */
  constructor() {
    // Al navegar a otro nodo se vuelve a la primera página de sus arreglos.
    effect(() => {
      this.arbol();
      this.pageIndex.set(0);
    });
  }

  /** Convierte nombres técnicos de propiedades en etiquetas legibles para la interfaz. */
  formarString(key: string): string {
    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/[_-]/g, ' ');               // snake_case / kebab-case
    return withSpaces
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  /** Convierte el valor de un nodo a texto y representa explícitamente los valores null. */
  mostrarValor(nodo: JsonNode): string {
    if (nodo.tipo === 'null') return 'Nulo';
    return String(nodo.valor ?? '');
  }

  /** Determina si el nodo no contiene hijos y se puede mostrar directamente. */
  esValorSimple(nodo: JsonNode): boolean {
    return nodo.hijos.length === 0;
  }

  /**
   * Obtiene los campos simples presentes en todos los registros. Solo esos
   * campos son seguros para convertirse en columnas de la tabla resumida.
   */
  columnasArreglo(nodos: JsonNode[]): string[] {
    const primeraFila = nodos[0];
    if (!primeraFila || primeraFila.tipo !== 'object') return [];

    return primeraFila.hijos
      .filter((campo) => this.esValorSimple(campo))
      .filter((campo) =>
        nodos.every((fila) =>
          fila.hijos.some((valor) => valor.nombre === campo.nombre && this.esValorSimple(valor))
        )
      )
      .map((campo) => campo.nombre);
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

  /** Selecciona un máximo de ocho columnas para la vista resumida de un arreglo. */
  columnasPrincipales(nodos: JsonNode[]): string[] {
    return this.columnasArreglo(nodos).slice(0, 8);
  }

  /**
   * Un arreglo de objetos es tabulable cuando comparte al menos un campo
   * simple. Los objetos y arreglos anidados se reservan para el diálogo.
   */
  esArregloDeObjetosTabulable(nodos: JsonNode[]): boolean {
    if (nodos.length === 0 || !nodos.every((nodo) => nodo.tipo === 'object')) {
      return false;
    }

    return this.columnasArreglo(nodos).length > 0;
  }

  /** Busca el valor de una columna dentro de una fila; devuelve vacío si no existe. */
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

  /** Resume nodos complejos en la tabla sin renderizar todo su contenido. */
  resumenNodo(nodo: JsonNode): string {
    if (this.esValorSimple(nodo)) return this.mostrarValor(nodo);
    const etiqueta = nodo.tipo === 'array' ? 'elementos' : 'campos';
    return `${nodo.hijos.length} ${etiqueta}`;
  }

  /** Carga el diálogo bajo demanda para no incluir el detalle en la tabla principal. */
  async abrirDetalle(nodo: JsonNode): Promise<void> {
    const { JsonDetalleDialogComponent } = await import('../json-detalle-dialog/json-detalle-dialog.component');

    this.dialog.open(JsonDetalleDialogComponent, {
      data: nodo,
      width: '960px',
      maxWidth: '95vw',
      maxHeight: '85vh',
      autoFocus: false
    });
  }
}
