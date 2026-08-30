import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  messageCount = 4;
  notificationCount = 3;
  userRole = 'Admin';
  userName = 'DATDOAN';
  avatarUrl = 'assets/images/admin-page/avatar.png';
}