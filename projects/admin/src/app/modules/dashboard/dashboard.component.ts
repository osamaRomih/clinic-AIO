import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from 'DAL';
import { WidgetComponent } from './widget/widget.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, WidgetComponent, MatIconModule, MatButtonModule, MatMenuModule],
  providers: [DashboardService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected store = inject(DashboardService);
}
