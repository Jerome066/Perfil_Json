import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSeccionesComponent } from './json-secciones.component';

describe('JsonSeccionesComponent', () => {
  let component: JsonSeccionesComponent;
  let fixture: ComponentFixture<JsonSeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonSeccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonSeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
