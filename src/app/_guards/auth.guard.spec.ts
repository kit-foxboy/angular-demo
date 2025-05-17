import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AccountService } from '../_services/account.service';
import { provideToastr, ToastrService } from 'ngx-toastr';

describe('authGuard', () => {
  const guard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let accountService: jasmine.SpyObj<AccountService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  const routeMock: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const routerStateMock: RouterStateSnapshot = {
    url: '/test',
  } as RouterStateSnapshot;

  beforeEach(() => {
    const accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'currentUser',
    ]);
    const toastrSpy = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        provideToastr({
          positionClass: 'toast-bottom-right',
        }),
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    accountService = TestBed.inject(
      AccountService
    ) as jasmine.SpyObj<AccountService>;
    
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if user is logged in', () => {
    accountService.currentUser.and.returnValue({
      username: 'test',
      token: 'test',
    });

    expect(guard(routeMock, routerStateMock)).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    accountService.currentUser.and.returnValue(null);

    expect(guard(routeMock, routerStateMock)).toBeFalse();
    expect(toastrService.error).toHaveBeenCalledWith('YOU SHALL NOT PASS!');
  });
});
