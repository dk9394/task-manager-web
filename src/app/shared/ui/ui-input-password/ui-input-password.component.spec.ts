import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiInputPasswordComponent } from './ui-input-password.component';

describe('UiInputPasswordComponent', () => {
  let component: UiInputPasswordComponent;
  let fixture: ComponentFixture<UiInputPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiInputPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
