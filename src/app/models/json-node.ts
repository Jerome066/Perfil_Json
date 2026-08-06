export interface JsonNode {

    nombre: string;

    ruta: string;

    nivel: number;

    tipo: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

    valor?: unknown;

    hijos: JsonNode[];

}