import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle registerMode', () => {
    expect(component.registerMode).toBeFalse();
    component.registerToggle();
    expect(component.registerMode).toBeTrue();
    component.registerToggle();
    expect(component.registerMode).toBeFalse();
  });

  it('should set registerMode to event value in cancelRegisterMode', () => {
    component.cancelRegisterMode(true);
    expect(component.registerMode).toBeTrue();
    component.cancelRegisterMode(false);
    expect(component.registerMode).toBeFalse();
  });
});
