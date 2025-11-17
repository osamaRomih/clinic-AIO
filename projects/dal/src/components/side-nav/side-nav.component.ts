import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { AuthService, MenuItem, MenuItemComponent } from '../../public-api';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'lib-side-nav',
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    MenuItemComponent,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  protected authService = inject(AuthService);

  sidenavCollapsed = signal(false);

  @Input() menuItems:MenuItem[] = [];
  @Input() set collapsed(val: boolean) {
    this.sidenavCollapsed.set(val);
  }

  profilePicSize = computed(() => (this.sidenavCollapsed() ? '32' : '100'));
}
