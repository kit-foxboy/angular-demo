import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListComponent } from './member-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MembersService } from '../../../_services/members.service';
import { Member } from '../../../_models/member';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
  let membersService: MembersService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MemberListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    membersService = TestBed.inject(
      MembersService
    );
    
  });

  // Tests for the MemberListComponent
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load members on init', () => {
    // Mock the members service to return a list of members
    const mockMembers: Member[] = [
      {
        id: 1,
        userName: 'John',
        photos: [{
          isMain: true, url: 'photo1.jpg',
          id: 0,
          isNSFW: false
        }],
        age: 0,
        photoUrl: '',
        knownAs: '',
        created: new Date(),
        lastActive: new Date(),
        gender: '',
        introduction: '',
        interests: '',
        lookingFor: '',
        city: '',
        country: '',
        isPredator: false,
      },
      {
        id: 2,
        userName: 'Jane',
        photos: [{
          isMain: false, url: 'photo2.jpg',
          id: 0,
          isNSFW: false
        }],
        age: 0,
        photoUrl: '',
        knownAs: '',
        created: new Date(),
        lastActive: new Date(),
        gender: '',
        introduction: '',
        interests: '',
        lookingFor: '',
        city: '',
        country: '',
        isPredator: false
      },
    ];

    // Mock the membersService.getMembers method to return the mock members
    spyOn(membersService, 'getMembers').and.callFake(() => {
      return of(mockMembers);
    });

    // Call ngOnInit to trigger the loading of members
    component.ngOnInit();

    // Make assertions
    expect(membersService.getMembers).toHaveBeenCalled();
    expect(component.members.length).toBe(2);
    expect(component.members[0].photos[0].url).toBe('photo1.jpg');
    expect(component.members[1].photos[0].url).toBe('photo2.jpg');
  });

  it('should log an error if getMembers fails', () => {
    // Mock the members service to return an error
    const error: Error = new Error('Error loading members');
    spyOn(console, 'error');

    // Mock the membersService.getMembers method to return an error
    spyOn(membersService, 'getMembers').and.returnValue(throwError(() => error));

    // Call ngOnInit to trigger the loading of members
    component.ngOnInit();

    // Make assertions
    expect(membersService.getMembers).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(error.message, error);
  });
});
