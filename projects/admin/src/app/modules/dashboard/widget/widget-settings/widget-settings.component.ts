import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { DashboardService, IWidget } from 'DAL';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-widget-settings',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatIconModule, MatButtonModule],
  templateUrl: './widget-settings.component.html',
  styleUrl: './widget-settings.component.scss',
})
export class WidgetSettingsComponent {
  data = input.required<IWidget>();
  store = inject(DashboardService);

  @Output() toggleSettings = new EventEmitter<void>();

  onClose() {
    this.toggleSettings.emit();
  }
}
