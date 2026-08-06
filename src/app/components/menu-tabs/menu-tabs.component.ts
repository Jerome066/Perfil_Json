import { Component, input, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';
import { MatTabsModule } from '@angular/material/tabs';
import { JsonMenuComponent } from '../json-menu/json-menu.component';

@Component({
  selector: 'app-menu-tabs',
  imports: [MatTabsModule, JsonMenuComponent],
  templateUrl: './menu-tabs.component.html',
  styleUrl: './menu-tabs.component.css'
})
export class MenuTabsComponent {
  arbol = input.required<JsonNode[]>();

  formarTab(key: string): string {
    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/[_-]/g, ' ');               // snake_case / kebab-case
    return withSpaces
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }


}
