import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { NavLinksComponent } from './nav-links/nav-links.component';
import { NavToolsComponent } from './nav-tools/nav-tools.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NavLinksComponent, NavToolsComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);

  isHomePage = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects === '/'),
      startWith(this.router.url === '/')
    ),
    { initialValue: this.router.url === '/' }
  );
}