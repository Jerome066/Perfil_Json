import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './json-node.component.html',
  styleUrl: './json-node.component.css'
})
export class JsonNodeComponent {
  @Input({ required: true }) label!: string;
  @Input() value: unknown = null;
  @Input() level = 1; // controla el tamaño del encabezado

  isObject(v: unknown): v is Record<string, unknown> {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  isArray(v: unknown): v is unknown[] {
    return Array.isArray(v);
  }

  isPrimitive(v: unknown): boolean {
    return !this.isObject(v) && !this.isArray(v);
  }

  objectEntries(v: Record<string, unknown>) {
    return Object.entries(v);
  }

  // Convierte "fechaNacimiento" o "user_email" en "Fecha Nacimiento" / "User Email"
  formatLabel(key: string): string {
    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/[_-]/g, ' ');               // snake_case / kebab-case
    return withSpaces
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  formatValue(v: unknown): string {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    return String(v);
  }

  // ¿Es un array de objetos "planos" y con las mismas claves? -> se puede mostrar como tabla
  isUniformObjectArray(arr: unknown[]): boolean {
    if (arr.length === 0 || !this.isObject(arr[0])) return false;
    const firstKeys = Object.keys(arr[0] as object).sort().join(',');
    return arr.every(item =>
      this.isObject(item) &&
      Object.keys(item).sort().join(',') === firstKeys &&
      Object.values(item).every(val => this.isPrimitive(val))
    );
  }

  tableColumns(arr: unknown[]): string[] {
    return Object.keys(arr[0] as Record<string, unknown>);
  }
}