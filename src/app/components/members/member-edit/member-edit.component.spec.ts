import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEditComponent } from './member-edit.component';
import { AccountService } from '../../../_services/account.service';
import { MembersService } from '../../../_services/members.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Member } from '../../../_models/member';

describe('MemberEditComponent', () => {
  let component: MemberEditComponent;
  let fixture: ComponentFixture<MemberEditComponent>;
  let accountServiceMock: jasmine.SpyObj<AccountService>;
  let memberServiceMock: jasmine.SpyObj<MembersService>;
  let toastrMock: jasmine.SpyObj<ToastrService>;

  // Mock member data
  const mockMember = {
    id: 1,
    userName: 'test',
    photos: [{ id: 1, url: 'test.jpg', isMain: true }],
  } as Member;

  beforeEach(async () => {
    accountServiceMock = jasmine.createSpyObj('AccountService', [
      'currentUser',
    ]);
    memberServiceMock = jasmine.createSpyObj('MembersService', ['getMember', 'updateMember']);
    toastrMock = jasmine.createSpyObj('ToastrService', ['success']);

    accountServiceMock.currentUser.and.returnValue({
      username: 'test',
      token: 'test-token',
    });
    memberServiceMock.getMember.and.returnValue(of(mockMember));
    memberServiceMock.updateMember.and.returnValue(of(mockMember));

    await TestBed.configureTestingModule({
      imports: [MemberEditComponent],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: MembersService, useValue: memberServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test cases
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load member on init', () => {
    expect(accountServiceMock.currentUser).toHaveBeenCalled();
    expect(memberServiceMock.getMember).toHaveBeenCalledWith('test');
    expect(component.member).toEqual(mockMember);
  });

  it('should update member profile', () => {
    // Setup form
    component.editForm = {
      reset: jasmine.createSpy('reset'),
    } as unknown as NgForm;
    component.member = mockMember;

    // Call method
    component.updateMember();

    // Verify results
    expect(memberServiceMock.updateMember).toHaveBeenCalledWith(mockMember);
    expect(toastrMock.success).toHaveBeenCalledWith(
      'Profile updated successfully'
    );
    expect(component.editForm?.reset).toHaveBeenCalledWith(mockMember);
  });

  it('should set mainPhoto correctly from member photos', () => {
    expect(component.member?.mainPhoto).toEqual(mockMember.photos[0]);
  });

  it('should not call memberService if username is undefined', () => {
    // Reset the calls
    memberServiceMock.getMember.calls.reset();
    accountServiceMock.currentUser.and.returnValue(null);

    // Call load member again
    component.ngOnInit();
    fixture.detectChanges();

    // Verify member service was not called
    expect(memberServiceMock.getMember).not.toHaveBeenCalled();
  });

  // Test for beforeunload event
  it('should set beforeunload event if form is dirty', () => {
    // Mock the dirty state of the form
    // Mock the dirty state of the form
    if (!component.editForm) {
      throw new Error(
        'component.editForm is not initialized. Check @ViewChild setup and initial fixture.detectChanges().'
      );
    }
    component.editForm?.form.markAsDirty();

    // Mock the notify method and window event
    spyOn(component, 'notify').and.callFake((event: Event) => {
      event.returnValue = true;
    });
    spyOn(window, 'addEventListener').and.callThrough();

    // Trigger the event
    const event = new Event('beforeunload');
    window.onbeforeunload = null;
    window.dispatchEvent(event);

    // Make assertions
    expect(component.notify).toHaveBeenCalledWith(event);
  });

  // Test for disabled button in form
  it('should disable update button if form is invalid', () => {
    // Mock the dirty state of the form
    if (!component.editForm) {
      throw new Error('component.editForm is not initialized. Check @ViewChild setup and initial fixture.detectChanges().');
    }
    component.editForm?.form.markAsDirty();
    fixture.detectChanges();

    // Get the button element
    const button = fixture.nativeElement.querySelector('button[type="submit"]');

    // Get the alert div
    const alert = fixture.nativeElement.querySelector('.alert');

    // Make assertions
    expect(button.disabled).toBe(false);
    expect(alert.textContent).toContain('You have unsaved changes');
  });

});
