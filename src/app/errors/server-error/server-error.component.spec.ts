import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorComponent } from './server-error.component';
import { Router } from '@angular/router';

describe('ServerErrorComponent', () => {
  let component: ServerErrorComponent;
  let fixture: ComponentFixture<ServerErrorComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    // Mock the Router to simulate navigation extras
    mockRouter = {
      getCurrentNavigation: jasmine
        .createSpy('getCurrentNavigation')
        .and.returnValue({
          extras: {
            state: {
              error: {
                message: 'Test error message',
                details: 'Test error details'
              },
            },
          },
        }),
    };

    await TestBed.configureTestingModule({
      imports: [ServerErrorComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error from navigation extras', () => {
    expect(component.error.message).toBe('Test error message');
  });

  it('should handle missing error in navigation extras', () => {
    // Mock the Router to simulate missing error in navigation extras
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {},
    });

    // Recreate the component to trigger constructor
    fixture = TestBed.createComponent(ServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Make assertions
    expect(component.error).toBeUndefined();
  });
});
