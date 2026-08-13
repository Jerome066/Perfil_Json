import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonCardsComponent } from './json-cards.component';

describe('JsonCardsComponent', () => {
  let component: JsonCardsComponent;
  let fixture: ComponentFixture<JsonCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
