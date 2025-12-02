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
import { MatIcon } from '@angular/material/icon';
import { IPatientsPerDay } from '../../../models/results';
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
  selector: 'app-patients-widget',
  standalone: true,
  imports: [NgApexchartsModule, MatIcon, CommonModule],
  templateUrl: './patients-widget.component.html',
  styleUrl: './patients-widget.component.scss',
})
export class PatientsWidgetComponent {
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
  protected patients = signal<IPatientsPerDay[]>([]);

  protected totalPatients = computed(() => {
    return this.patients().reduce((acc, curr) => acc + Number(curr.count), 0);
  });

  ngOnInit(): void {
    this.loadPatientsPerDays();
  }

  loadPatientsPerDays() {
    this.resultService.getPatientsPerDay().subscribe({
      next: (result) => {
        this.patients.set(result);
        console.log(this.patients().map((x) => Number(x.count)));
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
          name: 'Patients',
          data: this.patients()
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
        categories: this.patients()
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
          // `w.globals.categoryLabels` contains the xaxis categories
          const rawDate = w?.globals?.categoryLabels?.[dataPointIndex];
          const value = series?.[seriesIndex]?.[dataPointIndex];

          // Format the date
          const d = rawDate ? new Date(rawDate) : null;
          const formattedDate = d
            ? d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
            : rawDate ?? '';

          return `
      <div class="apx-custom-tooltip">
        <div class="apx-tooltip-date">${formattedDate}</div>
        <div class="apx-tooltip-sep" role="separator" aria-hidden="true"></div>
        <div class="apx-tooltip-value d-flex align-items-center">
          <span class="apx-tooltip-num" style="color:${lineColor}">${value ?? '-'}</span>
          <span class="apx-tooltip-label"> patients</span>
        </div>
      </div>
    `;
        },
      },
    };
  }
}
