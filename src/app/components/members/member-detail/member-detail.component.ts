import { Component, inject, OnInit } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryComponent, GalleryModule, ImageItem } from 'ng-gallery';
import { MembersService } from '../../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../_models/member';

@Component({
  selector: 'app-member-detail',
  imports: [TabsModule, GalleryModule, GalleryComponent],
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  member?: Member;
  images: GalleryItem[] = [];

  // Get the current route parameter (username) from the URL
  // and load the member details using the memberService
  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.loadMember(username);
    }
  }

  // Load the member details using the memberService
  private loadMember(username: string) {
    this.memberService.getMember(username).subscribe(member => {
      this.member = member;
      this.member.mainPhoto = member.photos.find(p => p.isMain);
      member.photos.map(photo => {
        this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
      });
    });
  }
}
