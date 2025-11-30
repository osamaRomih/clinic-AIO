import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { DashboardService, IWidget } from 'DAL';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WidgetSettingsComponent } from './widget-settings/widget-settings.component';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatButtonToggleModule, WidgetSettingsComponent],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
  host: {
    '[style.grid-column]': 'gridColumn',
    '[style.grid-row]': 'gridRow',
  },
})
export class WidgetComponent {
  // data = input.required<IWidget>();
  @Input() data!: IWidget;
  showSettings = signal<boolean>(false);
  store = inject(DashboardService);

  get componentInputs() {
    return {
      data: this.data,
    };
  }

  get gridColumn(): string {
    const cols = this.data.cols ?? 1;
    return `span ${cols}`;
  }

  get gridRow(): string {
    const rows = this.data.rows ?? 1;
    return `span ${rows}`;
  }

  toggleSettings() {
    this.showSettings.update((value) => !value);
  }
}
