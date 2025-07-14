import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Perros } from './perros';

describe('Perros', () => {
  let component: Perros;
  let fixture: ComponentFixture<Perros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Perros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
