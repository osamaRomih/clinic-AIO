import { Component, computed, inject, Input, input, signal, ViewChild } from '@angular/core';
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
import { IWidget, ResultsService } from '../../../public-api';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { IAppointmentsPerDay } from '../../../models/results';
import { CommonModule } from '@angular/common';

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
  imports: [MatIconModule, NgApexchartsModule, CommonModule],
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

  private resultService = inject(ResultsService);
  private appointments = signal<IAppointmentsPerDay[]>([]);

  protected totalAppointments = computed(() => {
    return this.appointments().reduce((acc, curr) => acc + Number(curr.count), 0);
  });

  ngOnInit(): void {
    this.loadAppointmentsPerDays();
  }

  loadAppointmentsPerDays() {
    this.resultService.getAppointmentsPerDay().subscribe({
      next: (result) => {
        this.appointments.set(result);
        console.log(this.appointments().map((x) => Number(x.count)));
        this.initChartOptions();
      },
    });
  }

  initChartOptions(): void {
    const lineColor = (this.data as any).lineColor ?? DEFAULT_LINE_COLOR;
    const bgColor = (this.data as any).chartBackgroundColor ?? DEFAULT_BG_COLOR;

    this.chartOptions = {
      series: [
        {
          name: 'Appointments',
          data: this.appointments()
            .map((x) => Number(x.count))
            .reverse(),
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
        categories: this.appointments()
          .map((x) => x.date)
          .reverse(),
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
        shared: false,
        x: { show: false },
        y: { formatter: (v: number) => v?.toString() ?? '' },
        marker: { show: false },
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          // `w.globals.categoryLabels` contains the xaxis categories (your dates)
          const rawDate = w?.globals?.categoryLabels?.[dataPointIndex];
          const value = series?.[seriesIndex]?.[dataPointIndex];

          // Format the date
          const d = rawDate ? new Date(rawDate) : null;
          const formattedDate = d
            ? d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
            : rawDate ?? '';

          // Build HTML — date on top, a thin separator, then the count
          return `
      <div class="apx-custom-tooltip">
        <div class="apx-tooltip-date">${formattedDate}</div>
        <div class="apx-tooltip-sep" role="separator" aria-hidden="true"></div>
        <div class="apx-tooltip-value d-flex align-items-center">
          <span class="apx-tooltip-num" style="color:${lineColor}">${value ?? '-'}</span>
          <span class="apx-tooltip-label"> appointments</span>
        </div>
      </div>
    `;
        },
      },
    };
  }
}
