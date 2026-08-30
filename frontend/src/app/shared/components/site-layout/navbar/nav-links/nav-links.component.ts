import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-links',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-links.component.html',
})
export class NavLinksComponent {
  navItems = [
    { path: '/store', label: 'Store' },
    { path: '/news', label: 'News' },
    { path: '/help', label: 'Help' },
    { path: '/contact', label: 'Contact' },
  ];
}