import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListComponent } from './member-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MembersService } from '../../../_services/members.service';
import { Member } from '../../../_models/member';
import { signal } from '@angular/core';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MembersService', ['getMembers'], {
      members: signal<Member[]>([])
    });

    await TestBed.configureTestingModule({
      imports: [MemberListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MembersService, useValue: spy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    membersServiceSpy = TestBed.inject(MembersService) as jasmine.SpyObj<MembersService>;
    
  });
  // Tests for the MemberListComponent
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMembers if members signal is empty', () => {
    // Initially empty signal
    membersServiceSpy.members.set([]);
    
    // Call ngOnInit
    component.ngOnInit();

    // Should call getMembers since signal is empty
    expect(membersServiceSpy.getMembers).toHaveBeenCalled();
  });

  it('should not call getMembers if members signal already has data', () => {
    // Set up signal with existing data
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
    ];
    
    membersServiceSpy.members.set(mockMembers);
    
    // Call ngOnInit
    component.ngOnInit();

    // Should not call getMembers since signal already has data
    expect(membersServiceSpy.getMembers).not.toHaveBeenCalled();
  });

  it('should call loadMembers method', () => {
    // Spy on loadMembers method
    spyOn(component, 'loadMembers').and.callThrough();
    
    // Set empty signal so ngOnInit will call loadMembers
    membersServiceSpy.members.set([]);
    
    // Call ngOnInit
    component.ngOnInit();

    expect(component.loadMembers).toHaveBeenCalled();
    expect(membersServiceSpy.getMembers).toHaveBeenCalled();
  });
});
