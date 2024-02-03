import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeDividerComponent } from './shape-divider.component';

describe('ShapeDividerComponent', () => {
  let component: ShapeDividerComponent;
  let fixture: ComponentFixture<ShapeDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeDividerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShapeDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
