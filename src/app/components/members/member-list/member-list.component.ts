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
  memberService = inject(MembersService);
  
  ngOnInit(): void {
    if (this.memberService.members().length === 0) {
      this.loadMembers();
    }
  }

  // Load the list of members using the memberService
  // and set the main photo for each member
  loadMembers() {
    this.memberService.getMembers();
  }
}
