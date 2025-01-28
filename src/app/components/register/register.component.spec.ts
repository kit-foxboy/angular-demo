import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { signal } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let accountService: jasmine.SpyObj<AccountService>;

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'register',
    ]);
    accountServiceSpy.currentUser = signal<User | null>(null);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AccountService, useValue: accountServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(
      AccountService
    ) as jasmine.SpyObj<AccountService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register method of accountService on register', () => {
    const mockResponse: User = { username: '', token: '' };
    accountService.register.and.returnValue(of(mockResponse));

    component.register();

    expect(accountService.register).toHaveBeenCalledWith(component.model);
  });

  it('should log error on failed register', () => {
    const mockError = { error: 'Registration failed' };
    accountService.register.and.returnValue(throwError(mockError));
    spyOn(console, 'log');

    component.register();

    expect(console.log).toHaveBeenCalledWith(mockError);
  });
});
