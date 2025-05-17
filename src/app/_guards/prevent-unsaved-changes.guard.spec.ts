import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn, provideRouter, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './prevent-unsaved-changes.guard';

describe('preventUnsavedChangesGuard', () => {
  let component: MemberEditComponent;
  let currentRoute: ActivatedRouteSnapshot;
  let currentState: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  // Mock component to test the guard
  const executeGuard: CanDeactivateFn<MemberEditComponent> = (component, currentRoute, currentState, nextState) =>
      TestBed.runInInjectionContext(() => preventUnsavedChangesGuard(component, currentRoute, currentState, nextState));

  beforeEach(() => {
    component = { editForm: { dirty: false } } as unknown as MemberEditComponent;
    currentRoute = {} as ActivatedRouteSnapshot;
    currentState = {} as RouterStateSnapshot;
    nextState = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the form is not dirty', () => {
    expect(executeGuard(component, currentRoute, currentState, nextState)).toBe(true);
  });

  it('should return a confirmation dialog if the form is dirty', () => {
    const component = { editForm: { dirty: true } } as unknown as MemberEditComponent;
    
    spyOn(window, 'confirm').and.returnValue(true);
    expect(executeGuard(component, currentRoute, currentState, nextState)).toBe(true);
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to continue? Any unsaved changes will be lost');
  });
  it('should return false if the user cancels the confirmation dialog', () => {
    const component = { editForm: { dirty: true } } as unknown as MemberEditComponent;
    
    spyOn(window, 'confirm').and.returnValue(false);
    expect(executeGuard(component, currentRoute, currentState, nextState)).toBe(false);
  });
});
