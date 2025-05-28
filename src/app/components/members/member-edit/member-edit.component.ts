import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../_models/member';
import { AccountService } from '../../../_services/account.service';
import { MembersService } from '../../../_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  imports: [TabsModule, FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member?: Member;
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.loadMember();
  }

  private loadMember() {
    const username = this.accountService.currentUser()?.username;
    if (username) {
      this.memberService.getMember(username).subscribe(member => {
        this.member = member;
        this.member.mainPhoto = member.photos.find(p => p.isMain);
      });
    }
  }

  updateMember() {
    if (this.member) {
      this.memberService.updateMember(this.member).subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully');
          this.editForm?.reset(this.member);
        }
      });
    }
  }
}
