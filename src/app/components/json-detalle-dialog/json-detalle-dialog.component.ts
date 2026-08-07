import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { JsonNode } from '../../models/json-node';
import { JsonSeccionesComponent } from '../json-secciones/json-secciones.component';

@Component({
  selector: 'app-json-detalle-dialog',
  imports: [MatButtonModule, MatDialogModule, JsonSeccionesComponent],
  templateUrl: './json-detalle-dialog.component.html',
  styleUrl: './json-detalle-dialog.component.css'
})
export class JsonDetalleDialogComponent {
  /** Registro seleccionado desde la tabla principal. */
  readonly nodo = inject<JsonNode>(MAT_DIALOG_DATA);
}
