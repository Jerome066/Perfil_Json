import { Component, effect, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-json-secciones',
    imports: [JsonSeccionesComponent, MatPaginatorModule],
    templateUrl: './json-secciones.component.html',
    styleUrl: './json-secciones.component.css'
})
export class JsonSeccionesComponent {

    //Nodo que será representado.
    arbol = input.required<JsonNode | null>();
    //Página actual.
    pageIndex = signal(0);
    //Cantidad de elementos por página.
    pageSize = signal(10);

    constructor() {
        effect(() => {
            this.arbol();
            this.pageIndex.set(0);
        });
    }

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

    /**
     * Convierte el valor del nodo a texto.
     */
    mostrarValor(nodo: JsonNode): string {
        if (nodo.tipo === 'null') {
            return 'Nulo';
        }
        return String(
            nodo.valor ?? ''
        );
    }

    /**
     * Determina si un nodo es un valor simple.
     * Un nodo sin hijos se considera primitivo.
     */
    esValorSimple(nodo: JsonNode): boolean {
        return nodo.hijos.length === 0;
    }

    /**
     * Determina si un nodo realmente contiene información.
     */
    tieneInformacion(nodo: JsonNode | null | undefined): boolean {
        if (!nodo) {
            return false;
        }
        if (nodo.hijos && nodo.hijos.length > 0) {
            return nodo.hijos.some(
                hijo => this.tieneInformacion(hijo)
            );
        }
        const valor = nodo.valor;
        if (valor === undefined || valor === null) {
            return false;
        }
        if (typeof valor === 'string') {
            return valor.trim().length > 0;
        }
        if (Array.isArray(valor)) {
            return valor.length > 0;
        }
        if (typeof valor === 'object') {
            return Object.keys(valor).length > 0;
        }
        return true;
    }

    /**
     * Devuelve únicamente los hijos que realmente contienen información.
     * Especialmente importante para los arreglos.
     */
    hijosConInformacion(nodos: JsonNode[]): JsonNode[] {
        return nodos.filter(
            nodo => this.tieneInformacion(nodo)
        );
    }

    /**
     * Obtiene los campos simples con información de un objeto.
     */
    camposSimples(nodos: JsonNode[]): JsonNode[] {
        return nodos.filter(
            nodo => this.esValorSimple(nodo) && this.tieneInformacion(nodo)
        );
    }

    /**
     * Devuelve únicamente los elementos con información
     * correspondientes a la página actual.
     */
    elementosPagina(nodos: JsonNode[]): JsonNode[] {
        const nodosValidos = this.hijosConInformacion(nodos);
        const inicio = this.pageIndex() * this.pageSize();
        return nodosValidos.slice(inicio, inicio + this.pageSize());
    }

    // CAMBIAR PÁGINA
    cambiarPagina(evento: PageEvent): void {
        this.pageIndex.set(evento.pageIndex);
        this.pageSize.set(evento.pageSize);
    }

}