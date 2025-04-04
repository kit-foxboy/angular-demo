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
        isNSFW: false
      }
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display member photo', () => {
    const photoElement =
      fixture.debugElement.nativeElement.querySelector('img'); // Assuming there is an <img> tag for the photo
    expect(photoElement.src).toContain('photo1.jpg');
  });

  it('should display placeholder if no photo is available', () => {
    component.member!.mainPhoto = undefined; // Set mainPhoto to undefined
    fixture.detectChanges(); // Trigger change detection

    const photoElement =
      fixture.debugElement.nativeElement.querySelector('img'); // Assuming there is an <img> tag for the photo
    expect(photoElement.src).toContain('/assets/user.png'); // Check for placeholder image
  });
});
