import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonLevelsComponent } from './components/json-levels/json-levels.component';

@Component({
  selector: 'app-root',
  imports: [JsonLevelsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Perfil';
}
