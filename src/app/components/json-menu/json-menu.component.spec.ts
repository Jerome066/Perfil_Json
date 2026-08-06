import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonMenuComponent } from './json-menu.component';

describe('JsonMenuComponent', () => {
  let component: JsonMenuComponent;
  let fixture: ComponentFixture<JsonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
