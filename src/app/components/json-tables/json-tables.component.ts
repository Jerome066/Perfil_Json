import { Component, effect, inject, input, signal } from '@angular/core';
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
  //Botones para avanzar a la primera y ultima pagina
  showFirstLastButtons = true;
  disabled = false;
  /**DIALOG*/
  private readonly dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      this.arbol();
      this.pageIndex.set(0);
    });
  }

  //verifica si tiene informacion o si esta vacio el nodo
  tieneInformacion(nodo: JsonNode | null | undefined): boolean {

    //Verifica que exista el nodo
    if (!nodo) {
      return false;
    }

    // Si tiene hijos, solamente comprobamos
    // si alguno de sus hijos directos tiene información.
    //Recursivo
    if (nodo.hijos && nodo.hijos.length > 0) {
      return nodo.hijos.some(hijo => this.tieneInformacion(hijo)); // Con some verifica que al menos uno cumpla con la condicion
    }

    // Sin hijos: es un valor.
    // Nodo hoja
    const valor = nodo.valor;
    if (valor === undefined || valor === null) {
      return false; // No hay información.
    }

    if (typeof valor === 'string') { //typeof regresa el TIPO de valor
      return valor.trim().length > 0; //trim permite quitar los espacios de la cadena
    }

    if (Array.isArray(valor)) { // Array.isArray verifica que realmente sea un Array
      return valor.length > 0;
    }

    if (typeof valor === 'object') {
      return Object.keys(valor).length > 0;
    }

    return true;
  }

  // HIJOS CON INFORMACIÓN
  // Devuelve únicamente los hijos que realmente contienen información.
  // Esta función es especialmente importante para los arreglos.
  hijosConInformacion(nodos: JsonNode[]): JsonNode[] {
    return nodos.filter( // filter crea un nuevo arreglo con todos los elementos que cumplen una condición
      nodo => this.tieneInformacion(nodo)
    );
  }

  // ARREGLO TABULABLE
  //  Determina si un arreglo está formado por objetos
  //  que comparten campos simples con información.
  esArregloDeObjetosTabulable(nodos: JsonNode[]): boolean {
    if (nodos.length === 0 || !nodos.every(nodo => nodo.tipo === 'object')) { // Every revisa que todos los arreglos cumplan la condicion
      return false;
    }
    return (this.columnasArreglo(nodos).length > 0);
  }

  // COLUMNAS PRINCIPALES
  /**
   * Limita la tabla de un arreglo a ocho columnas.
   */
  columnasPrincipales(nodos: JsonNode[]): string[] {
    return this.columnasArreglo(nodos).slice(0, 8);
  }

  columnasArreglo(nodos: JsonNode[]): string[] {
    const columnas = new Set<string>();
    for (const nodo of nodos) {
      if (nodo.tipo !== 'object') {
        continue; // continue permite saltar una iteracion de un bucle 
      }
      for (const campo of nodo.hijos) {
        if (this.esValorSimple(campo) && this.tieneInformacion(campo) && campo.nombre) {
          columnas.add(campo.nombre);
        }
      }
    }
    return Array.from(columnas);
  }

  // ELEMENTOS VISIBLES DE UNA PÁGINA
  /**
   * Devuelve únicamente los elementos que contienen información
   * correspondientes a la página actual.
   */
  elementosPagina(nodos: JsonNode[]): JsonNode[] {

    const inicio =
      this.pageIndex() * this.pageSize();

    return nodos.slice(
      inicio,
      inicio + this.pageSize()
    );

  }

  // VALOR DE CAMPO
  /**
   * Busca un campo dentro de una fila.
   */
  valorDeCampo(fila: JsonNode, columna: string): string {

    const campo = fila.hijos.find(
      nodo =>
        nodo.nombre === columna &&
        this.tieneInformacion(nodo)
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
        width: '1200px',
        maxWidth: '100vw',
        maxHeight: '100vh',
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

    const hijosValidos =
      this.hijosConInformacion(nodo.hijos);

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

  tieneHijosComplejos(nodo: JsonNode): boolean {
    return nodo.hijos.some(
      hijo =>
        !this.esValorSimple(hijo) &&
        this.tieneInformacion(hijo)
    );
  }

  ////////////////////////////////////////////////////////////
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

    return (
      nodo.tipo === 'string' ||
      nodo.tipo === 'number' ||
      nodo.tipo === 'boolean' ||
      nodo.tipo === 'null'
    );

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
