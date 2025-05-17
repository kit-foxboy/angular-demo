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

  // Component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register method of accountService on register', () => {
    // Mock the accountService.register method to return an observable
    const mockResponse: User = { username: '', token: '' };
    accountService.register.and.returnValue(of(mockResponse));

    // Call the register method
    component.register();

    // Make assertions
    expect(accountService.register).toHaveBeenCalledWith(component.model);
  });

  it('should log error on failed register', () => {
    // Mock the accountService.register method to return an observable with an error
    const mockError = { error: 'Registration failed' };
    accountService.register.and.returnValue(throwError(() => mockError));
    spyOn(console, 'log');

    // Call the register method
    component.register();

    // Make assertions
    expect(console.log).toHaveBeenCalledWith(mockError);
  });
});
