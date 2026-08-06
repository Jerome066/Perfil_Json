import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonLevelsComponent } from './json-levels.component';

describe('JsonLevelsComponent', () => {
  let component: JsonLevelsComponent;
  let fixture: ComponentFixture<JsonLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonLevelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
