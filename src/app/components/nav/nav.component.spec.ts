import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { signal } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let accountService: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'login',
      'logout',
    ]);
    accountServiceSpy.currentUser = signal<User | null>(null);

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and handle success', () => {
    const response: User = { username: '', token: '' };
    accountService.login.and.returnValue(of(response));

    component.login();

    expect(accountService.login).toHaveBeenCalledWith(component.model);
    expect(accountService.login).toHaveBeenCalledTimes(1);
  });

  it('should call login and handle error', () => {
    const error = { message: 'Login failed' };
    accountService.login.and.returnValue(throwError(() => error));

    component.login();

    expect(accountService.login).toHaveBeenCalledWith(component.model);
    expect(accountService.login).toHaveBeenCalledTimes(1);
  });
});
