import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorComponent } from './server-error.component';
import { Router } from '@angular/router';

describe('ServerErrorComponent', () => {
  let component: ServerErrorComponent;
  let fixture: ComponentFixture<ServerErrorComponent>;
  let mockRouter: any;

  beforeEach(async () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error from navigation extras', () => {
    expect(component.error.message).toBe('Test error message');
  });

  it('should handle missing error in navigation extras', () => {
    mockRouter.getCurrentNavigation.and.returnValue({
      extras: {},
    });
    fixture = TestBed.createComponent(ServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.error).toBeUndefined();
  });
});
