import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { signal } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideRouter, Router } from '@angular/router';
describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let accountService: jasmine.SpyObj<AccountService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'login',
      'logout',
    ]);
    accountServiceSpy.currentUser = signal<User | null>(null);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        { provide: AccountService, useValue: accountServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr({
          positionClass: 'toast-bottom-right',
        })
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(
      AccountService
    ) as jasmine.SpyObj<AccountService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  // Component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and handle success', () => {
    // Mock the response from the accountService
    const response: User = { username: '', token: '' };
    accountService.login.and.returnValue(of(response));

    // Call the login method
    component.login();

    // Make assertions
    expect(accountService.login).toHaveBeenCalledWith(component.model);
    expect(accountService.login).toHaveBeenCalledTimes(1);
  });

  it('should call login and handle error', () => {
    // Mock the error response from the accountService
    const error = { message: 'Login failed' };
    accountService.login.and.returnValue(throwError(() => error));

    // Call the login method
    component.login();

    // Make assertions
    expect(accountService.login).toHaveBeenCalledWith(component.model);
    expect(accountService.login).toHaveBeenCalledTimes(1);
  });

  it('should call logout and handle success', () => {
    // Delegate the logout method to the actual implementation
    spyOn(component, 'logout').and.callThrough();

    // Mock the router's navigateByUrl method
    spyOn(router, 'navigateByUrl');

    // Mock the logout method from the accountService 
    accountService.logout.and.returnValue(void 0);

    // Call the logout method
    component.logout();

    // Make assertions
    expect(accountService.logout).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/'); 
  });
});
