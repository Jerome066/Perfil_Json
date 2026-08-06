import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonNodeComponent } from './json-node.component';

describe('JsonNodeComponent', () => {
  let component: JsonNodeComponent;
  let fixture: ComponentFixture<JsonNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
