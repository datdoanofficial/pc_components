import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiltDirective } from '../../shared/directives/tilt.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TiltDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
}