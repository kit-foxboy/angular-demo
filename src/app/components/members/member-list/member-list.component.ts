import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MembersService } from '../../../_services/members.service';
import { Member } from '../../../_models/member';
import { MemberCardComponent } from "../member-card/member-card.component";
import { first } from 'rxjs';

@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  private memberService = inject(MembersService);
  members: Member[] = [];
  
  ngOnInit(): void {
    this.loadMembers();
  }

  // Load the list of members using the memberService
  // and set the main photo for each member
  loadMembers() {
    this.memberService.getMembers().pipe(first()).subscribe({
      next: (members) => {
        this.members = members;
        this.members.forEach(member => {
          member.mainPhoto = member.photos.find(p => p.isMain);
        });
      },
      error: (err) => console.error('Error loading members', err),
    });
  }
}
