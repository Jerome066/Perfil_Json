import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonInputComponent } from './components/json-input/json-input.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Perfil';
}
