import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonTablesComponent } from './json-tables.component';

describe('JsonTablesComponent', () => {
  let component: JsonTablesComponent;
  let fixture: ComponentFixture<JsonTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
