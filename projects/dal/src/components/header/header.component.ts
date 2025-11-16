import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  output,
  Output,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  AuthService,
  BusyService,
  ResponsiveService,
  ThemeService,
} from '../../public-api';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatProgressBar,MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  busyService = inject(BusyService);
  themeService = inject(ThemeService);

  @Output() onCollapsed = new EventEmitter();

  logout() {
    this.authService.logout();
  }

  setTheme(key: string) {
    // keep current dark state
    const dark = this.themeService.getCurrent().dark;
    this.themeService.apply(key, dark);
  }

  toggleDark() {
    const cur = this.themeService.getCurrent();
    this.themeService.apply(cur.theme, !cur.dark);
  }

  toggleCollapsed() {
    this.onCollapsed.emit();
  }
}
