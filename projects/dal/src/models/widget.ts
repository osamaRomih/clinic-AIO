import { Type } from '@angular/core';

export interface IWidget {
  id: number;
  label: string;
  content: Type<any>;
  rows?: number;
  cols?: number;
  backgroundColor?: string;
  color?: string;
  icon?: string;
  iconBackgroundColor?: string;
  lineColor?: string;
  chartBackgroundColor?: string;
}
