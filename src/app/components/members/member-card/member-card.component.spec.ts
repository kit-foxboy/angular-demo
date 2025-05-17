import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCardComponent } from './member-card.component';
import { Component, ComponentRef, OnInit } from '@angular/core';
import { Member } from '../../../_models/member';
import { provideRouter } from '@angular/router';

@Component({
  template: `<app-member-card [member]="member"></app-member-card>`,
  standalone: true,
  imports: [MemberCardComponent],
})

// This is a wrapper component to test the MemberCardComponent in isolation
// Necessary for testing components that use @Input properties
class WrapperComponent implements OnInit {
  member: Member | undefined;

  ngOnInit() {
    this.member = {
      id: 0,
      userName: '',
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
      photos: [],
      isPredator: false,
      mainPhoto: {
        id: 0,
        url: 'photo1.jpg',
        isMain: false,
        isNSFW: false,
      },
    };
  }
}

describe('MemberCardComponent', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display member photo', () => {
    // Get the photo element from the fixture
    const photoElement =
      fixture.debugElement.nativeElement.querySelector('img');
    
    // Make assertions
    expect(photoElement.src).toContain('photo1.jpg');
  });

  it('should display placeholder if no photo is available', () => {
    // Set member's mainPhoto to undefined to simulate no photo available
    component.member!.mainPhoto = undefined;
    fixture.detectChanges();

    // Get the photo element from the fixture
    const photoElement =
      fixture.debugElement.nativeElement.querySelector('img');
    
    // Make assertions
    expect(photoElement.src).toContain('/assets/user.png');
  });
});
