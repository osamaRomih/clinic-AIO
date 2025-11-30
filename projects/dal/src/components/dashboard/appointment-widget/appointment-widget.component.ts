import { Component, Input, input, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexFill,
  NgApexchartsModule,
  ApexGrid,
} from 'ng-apexcharts';
import { IWidget } from '../../../public-api';
import { MatIcon, MatIconModule } from '@angular/material/icon';

const DEFAULT_LINE_COLOR = '#ff7a00';
const DEFAULT_BG_COLOR = 'transparent';

export type MiniChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  fill: ApexFill;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'lib-appointment-widget',
  standalone: true,
  imports: [MatIconModule, NgApexchartsModule],
  templateUrl: './appointment-widget.component.html',
  styleUrl: './appointment-widget.component.css',
})
export class AppointmentWidgetComponent {
  @Input() data: IWidget = {
    id: 0,
    content: null,
    cols: 1,
    rows: 1,
    label: '',
    iconBackgroundColor: '#000000',
    chartBackgroundColor: 'transparent',
  } as unknown as IWidget;
  operationsCount = 54;

  chartOptions!: MiniChartOptions;

  ngOnInit(): void {
    this.initChartOptions();
  }

  initChartOptions(): void {
    const lineColor = (this.data as any).lineColor ?? DEFAULT_LINE_COLOR;
    const bgColor = (this.data as any).chartBackgroundColor ?? DEFAULT_BG_COLOR;

    this.chartOptions = {
      series: [
        {
          name: 'Appointments',
          data: [10, 18, 14, 22, 19, 30, 27, 35, 28, 32],
        },
      ],
      chart: {
        type: 'area',
        height: 80,
        sparkline: { enabled: true },
        toolbar: { show: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: [lineColor],
      },
      fill: {
        type: '',
        colors: [bgColor],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      grid: {
        show: false,
      },
      tooltip: {
        enabled: true,
        x: { show: false },
        marker: { show: false },
      },
    };
  }
}
