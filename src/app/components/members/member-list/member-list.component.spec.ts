import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListComponent } from './member-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MembersService } from '../../../_services/members.service';
import { Member } from '../../../_models/member';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
  let membersService: jasmine.SpyObj<MembersService>;

  beforeEach(async () => {
    const membersServiceSpy = jasmine.createSpyObj('MembersService', [
      'getMembers',
    ]);

    await TestBed.configureTestingModule({
      imports: [MemberListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MembersService, useValue: membersServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    membersService = TestBed.inject(
      MembersService
    ) as jasmine.SpyObj<MembersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load members on init', () => {
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
    membersService.getMembers.and.returnValue(of(mockMembers));

    component.ngOnInit();

    expect(membersService.getMembers).toHaveBeenCalled();
    expect(component.members.length).toBe(2);
    expect(component.members[0].photos[0].url).toBe('photo1.jpg');
    expect(component.members[1].photos[0].url).toBe('photo2.jpg');
  });
});
