import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { Menu } from 'DAL';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [MatListModule,RouterLink,RouterLinkActive,MatIconModule,MatExpansionModule,CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() menu:Menu = []

}
