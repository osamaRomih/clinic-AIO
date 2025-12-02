import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexLegend,
  ApexFill,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { IWidget, ResultsService } from '../../../public-api';
import { AppointmentStatusSegment, IAppointmentStatus } from '../../../models/appointment-status';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  fill: ApexFill;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'lib-appointment-status-widget',
  templateUrl: './appointment-status-widget.component.html',
  styleUrls: ['./appointment-status-widget.component.css'],
  imports: [FormsModule, NgApexchartsModule, CommonModule],
  standalone: true,
})
export class AppointmentStatusWidgetComponent implements OnInit, OnDestroy {
  @Input() data: IWidget = {
    id: 0,
    content: null,
    cols: 1,
    rows: 1,
    label: '',
    iconBackgroundColor: '#000000',
    chartBackgroundColor: 'transparent',
  } as unknown as IWidget;
  private destroy$ = new Subject<void>();

  period: 'monthly' | 'weekly' | 'yearly' = 'monthly';
  periodOptions = ['monthly', 'weekly', 'yearly'];

  // Totals
  totalAll = 0;
  totalCompleted = 0;
  totalBooked = 0;
  totalCancelled = 0;

  // Chart
  chartOptions: ChartOptions = {
    series: [],
    chart: { type: 'bar', stacked: true, height: 330 } as ApexChart,
    xaxis: { categories: [] } as ApexXAxis,
    plotOptions: { bar: { columnWidth: '40%' } } as ApexPlotOptions,
    legend: { position: 'bottom' } as ApexLegend,
    fill: { opacity: 1 } as ApexFill,
    stroke: { width: 1, colors: ['transparent'] } as ApexStroke,
    tooltip: { shared: true, intersect: false } as ApexTooltip,
    colors: ['#00C49F', '#3B82F6', '#FACC15', '#EF4444'],
  };

  segments: AppointmentStatusSegment[] = [];

  constructor(private resultsService: ResultsService) {}

  ngOnInit(): void {
    this.loadDataForPeriod(this.period);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPeriodChange(period: 'monthly' | 'weekly' | 'yearly') {
    console.log(period);
    this.period = period;
    this.loadDataForPeriod(period);
  }

  private loadDataForPeriod(period: string) {
    const { startIso, endIso, year } = this.computeParamsForPeriod(period);

    this.resultsService
      .getAppointmentStatus(period, { start: startIso, end: endIso, year })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.consumeApiResponse(res, period),
        error: (err) => {
          console.error('Error loading appointment status', err);
          // reset chart / totals on error if needed
          this.totalAll = this.totalBooked = this.totalCompleted = this.totalCancelled = 0;
          this.segments = [];
          this.buildEmptyChartForPeriod(period);
        },
      });
  }

  /**
   * Decide and return start/end/year params for the selected period.
   * - daily: last 7 days (start/end)
   * - weekly: last 4 weeks (start/end)
   * - monthly: default to current year (year param)
   * - yearly: last 5 years (start/end covering range)
   */
  private computeParamsForPeriod(period: string): { startIso?: string; endIso?: string; year?: number } {
    const now = new Date();
    if (period === 'weekly') {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 28); // approx last 4 weeks
      return { startIso: start.toISOString().split('T')[0], endIso: end.toISOString().split('T')[0] };
    }

    if (period === 'monthly') {
      // request the current year by default
      return { year: now.getFullYear() };
    }

    if (period === 'yearly') {
      // ask for last 5 years range
      const endYear = now.getFullYear();
      const startYear = endYear - 4;
      // pass start & end as full-year dates
      const start = new Date(Date.UTC(startYear, 0, 1));
      const end = new Date(Date.UTC(endYear, 11, 31, 23, 59, 59));
      return { startIso: start.toISOString().split('T')[0], endIso: end.toISOString().split('T')[0] };
    }

    return {};
  }

  private consumeApiResponse(res: IAppointmentStatus, period: string) {
    // Totals
    this.totalAll = Number(res.allAppointmentsCount ?? 0);
    this.totalCompleted = Number(res.completedCount ?? 0);
    this.totalBooked = Number(res.bookedCount ?? 0);
    this.totalCancelled = Number(res.cancelledCount ?? 0);

    // segments
    this.segments = Array.isArray(res.segmentStatus) ? res.segmentStatus : [];

    // rebuild arrays (in case we filled)
    const finalLabels = this.segments.map((s) => s.label);
    const finalCompleted = this.segments.map((s) => Number(s.completed ?? 0));
    const finalBooked = this.segments.map((s) => Number(s.booked ?? 0));
    const finalCancelled = this.segments.map((s) => Number(s.cancelled ?? 0));

    // assign chartOptions (Partial) to update the chart
    this.chartOptions = {
      series: [
        { name: 'Completed', data: finalCompleted },
        { name: 'Booked', data: finalBooked },
        { name: 'Cancelled', data: finalCancelled },
      ] as ApexAxisChartSeries,
      chart: { type: 'bar', stacked: true, height: 330, toolbar: { show: false } } as ApexChart,
      plotOptions: { bar: { columnWidth: '40%' } } as ApexPlotOptions,
      stroke: { width: 1, colors: ['transparent'] } as ApexStroke,
      fill: { opacity: 1 } as ApexFill,
      xaxis: { categories: finalLabels } as ApexXAxis,
      legend: { position: 'bottom' } as ApexLegend,
      tooltip: { shared: true, intersect: false } as ApexTooltip,
      colors: ['#00C49F', '#3B82F6', '#FACC15', '#EF4444'],
    };
  }

  private buildEmptyChartForPeriod(period: string) {
    // simple empty / fallback
    this.chartOptions = {
      series: [
        { name: 'Completed', data: [] },
        { name: 'Booked', data: [] },
        { name: 'Cancelled', data: [] },
      ] as ApexAxisChartSeries,
      chart: { type: 'bar', stacked: true, height: 330, toolbar: { show: false } } as ApexChart,
      xaxis: { categories: [] } as ApexXAxis,
      plotOptions: { bar: { columnWidth: '40%' } } as ApexPlotOptions,
      stroke: { width: 1, colors: ['transparent'] } as ApexStroke,
      fill: { opacity: 1 } as ApexFill,
      legend: { position: 'bottom' } as ApexLegend,
      tooltip: { shared: true, intersect: false } as ApexTooltip,
      colors: ['#00C49F', '#3B82F6', '#FACC15', '#EF4444'],
    };
  }
}
