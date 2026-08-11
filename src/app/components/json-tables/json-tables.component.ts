import { Component, inject, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-json-tables',
  imports: [MatPaginatorModule, MatButtonModule],
  templateUrl: './json-tables.component.html',
  styleUrl: './json-tables.component.css'
})
export class JsonTablesComponent {

  //Nodo que será representado.
  arbol = input.required<JsonNode | null>();
  //Página actual.
  pageIndex = signal(0);
  //Cantidad de elementos por página.
  pageSize = signal(10);
  /**DIALOG*/
  private readonly dialog = inject(MatDialog);

  tieneInformacion(nodo: JsonNode | null | undefined): boolean {
    if (!nodo) {
      return false;
    }
    // NODO CON HIJOS
    if (nodo.hijos && nodo.hijos.length > 0) {
      return nodo.hijos.some(
        hijo =>
          this.tieneInformacion(hijo)
      );
    }
    // VALOR
    const valor = nodo.valor;
    // null / undefined
    if (valor === undefined || valor === null) {
      return false;
    }

    // STRING
    if (typeof valor === 'string') {
      return valor.trim().length > 0;
    }
    // ARRAY
    if (Array.isArray(valor)) {
      return valor.length > 0;
    }

    // OBJETO
    if (typeof valor === 'object') {
      return Object.keys(valor).length > 0;
    }
    // NUMBER / BOOLEAN
    return true;
  }

  // ARREGLO TABULABLE
  /**
   * Determina si un arreglo está formado por objetos
   * que comparten campos simples con información.
   */
  esArregloDeObjetosTabulable(nodos: JsonNode[]): boolean {
    if (nodos.length === 0 || !nodos.every(nodo => nodo.tipo === 'object')) {
      return false;
    }
    return (this.columnasArreglo(nodos).length > 0);
  }

  // HIJOS CON INFORMACIÓN
  /**
      Devuelve únicamente los hijos que realmente contienen
      información.
      Esta función es especialmente importante para los arreglos.
   */
  hijosConInformacion(nodos: JsonNode[]): JsonNode[] {
    return nodos.filter(
      nodo => this.tieneInformacion(nodo)
    );
  }

  // COLUMNAS PRINCIPALES
  /**
   * Limita la tabla de un arreglo a ocho columnas.
   */
  columnasPrincipales(nodos: JsonNode[]): string[] {
    return this.columnasArreglo(nodos).slice(0, 8);
  }

  columnasArreglo(nodos: JsonNode[]): string[] {
    const primeraFila = nodos[0];
    if (!primeraFila || primeraFila.tipo !== 'object') {
      return [];
    }
    return primeraFila.hijos.filter(campo => this.esValorSimple(campo) && this.tieneInformacion(campo))
      .filter(
        campo => nodos.every(
          fila => fila.hijos.some(
            valor => valor.nombre === campo.nombre && this.esValorSimple(valor) && this.tieneInformacion(valor)
          )
        )
      ).map(campo => campo.nombre);
  }

  // ELEMENTOS VISIBLES DE UNA PÁGINA
  /**
   * Devuelve únicamente los elementos que contienen información
   * correspondientes a la página actual.
   */
  elementosPagina(nodos: JsonNode[]): JsonNode[] {
    const nodosValidos = this.hijosConInformacion(nodos);
    const inicio = this.pageIndex() * this.pageSize();
    return nodosValidos.slice(inicio, inicio + this.pageSize()
    );
  }

  // VALOR DE CAMPO
  /**
   * Busca un campo dentro de una fila.
   */
  valorDeCampo(fila: JsonNode, columna: string): string {
    const campo = fila.hijos.find(
      nodo => nodo.nombre === columna && this.tieneInformacion(nodo)
    );
    if (!campo) {
      return '—';
    }
    return this.mostrarValor(campo);
  }

  // DETALLE
  /**
   * Abre el diálogo con el detalle completo de un nodo.
   */
  async abrirDetalle(nodo: JsonNode): Promise<void> {
    const { JsonDetalleDialogComponent } = await import('../json-detalle-dialog/json-detalle-dialog.component');
    this.dialog.open(JsonDetalleDialogComponent,
      {
        data: nodo,
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '85vh',
        autoFocus: false
      }
    );
  }

  // CAMBIAR PÁGINA
  /**
   * Actualiza el estado del paginador.
   */
  cambiarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
  }

  // RESUMEN DEL NODO
  /**
   * Genera un resumen para los elementos complejos
   * de un arreglo.
   */
  resumenNodo(nodo: JsonNode): string {
    if (this.esValorSimple(nodo)) {
      return this.mostrarValor(nodo);
    }

    const hijosValidos = this.hijosConInformacion(nodo.hijos);

    const etiqueta =
      nodo.tipo === 'array'
        ? 'elementos'
        : 'campos';
    return `${hijosValidos.length} ${etiqueta}`;
  }

  // CAMPOS PRINCIPALES
  /**
   * Obtiene los primeros ocho campos simples.
   */
  camposPrincipales(nodos: JsonNode[]): JsonNode[] {
    return this.camposSimples(nodos).slice(0, 8);
  }

  // CAMPOS SIMPLES
  /**
      Obtiene únicamente los campos simples que contieneninformación.
   */
  camposSimples(nodos: JsonNode[]): JsonNode[] {
    return nodos.filter(
      nodo => this.esValorSimple(nodo) && this.tieneInformacion(nodo)
    );
  }

  // INFORMACIÓN ADICIONAL
  /**
   * Determina si el panel "Información" realmente tiene
   */
  tieneInformacionAdicional(nodo: JsonNode): boolean {

    // CAMPOS SIMPLES RESTANTES
    const camposRestantes = this.camposRestantes(nodo.hijos);

    if (camposRestantes.some(campo => this.tieneInformacion(campo))) {
      return true;
    }
    // OBJETOS / ARREGLOS HIJOS
    const hijosComplejos = nodo.hijos.filter(
      hijo => !this.esValorSimple(hijo)
    );

    if (hijosComplejos.some(hijo => this.tieneInformacion(hijo))) {
      return true;
    }
    return false;
  }
  // CAMPOS RESTANTES
    /**
     * Obtiene los campos simples después de los primeros ocho.
     *
     * Estos campos se muestran dentro del panel "Información".
     */
    camposRestantes(nodos: JsonNode[]): JsonNode[] {
        return this.camposSimples(nodos).slice(8);
    }



  //////////////////////////////////////
  // FORMATEAR NOMBRES
  formarString(key: string): string {

    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[\_-]/g, ' ');

    return withSpaces
      .split(' ')
      .map(
        word =>
          word.charAt(0).toUpperCase()
          + word.slice(1)
      )
      .join(' ');
  }

  esValorSimple(nodo: JsonNode): boolean {
    return nodo.hijos.length === 0;
  }

  //Convierte el valor del nodo a texto.
  mostrarValor(nodo: JsonNode): string {
    if (nodo.tipo === 'null') {
      return 'Nulo';
    }
    return String(
      nodo.valor ?? ''
    );
  }
}
