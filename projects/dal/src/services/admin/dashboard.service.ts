import { computed, Injectable, signal } from '@angular/core';
import { IWidget } from '../../public-api';
import { PatientsWidgetComponent } from '../../components/dashboard/patients-widget/patients-widget.component';
import { AppointmentWidgetComponent } from '../../components/dashboard/appointment-widget/appointment-widget.component';

@Injectable()
export class DashboardService {
  widgets = signal<IWidget[]>([
    {
      id: 1,
      label: 'Patients',
      content: PatientsWidgetComponent,
    },
    {
      id: 2,
      label: 'Appointments',
      content: AppointmentWidgetComponent,
    },
  ]);

  addedWidgets = signal<IWidget[]>([
    {
      id: 1,
      label: 'Patients',
      content: PatientsWidgetComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#d7e9e2',
      color: '#000',
      icon: 'person_add',
      iconBackgroundColor: '#4caf50',
      lineColor: '#4caf50',
      chartBackgroundColor: '#c1e1ca',
    },
    {
      id: 2,
      label: 'Appointments',
      content: AppointmentWidgetComponent,
      rows: 1,
      cols: 1,
      backgroundColor: '#ddd9f3',
      color: '#000',
      icon: 'face',
      iconBackgroundColor: '#6f42c1',
      lineColor: '#6f42c1',
      chartBackgroundColor: '#ccc1eb',
    },
  ]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map((w) => w.id);
    return this.widgets().filter((w) => !addedIds.includes(w.id));
  });

  addWidget(widget: IWidget) {
    this.addedWidgets.update((widgets) => [...widgets, widget]);
  }

  deleteWidget(id: number) {
    this.addedWidgets.update((widgets) => widgets.filter((w) => w.id !== id));
  }

  updateWidgetLayout(id: number, widget: Partial<IWidget>) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index !== -1) {
      const updatedWidgets = [...this.addedWidgets()];
      updatedWidgets[index] = { ...updatedWidgets[index], ...widget };
      this.addedWidgets.set(updatedWidgets);
    }
  }

  moveWidgetRight(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === this.addedWidgets().length - 1) return;

    const updatedWidgets = [...this.addedWidgets()];
    // swap positions of widgets
    [updatedWidgets[index], updatedWidgets[index + 1]] = [updatedWidgets[index + 1], updatedWidgets[index]];
    this.addedWidgets.set(updatedWidgets);
  }

  moveWidgetLeft(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === 0) return;

    const updatedWidgets = [...this.addedWidgets()];
    // swap positions of widgets
    [updatedWidgets[index], updatedWidgets[index - 1]] = [updatedWidgets[index - 1], updatedWidgets[index]];
    this.addedWidgets.set(updatedWidgets);
  }
  constructor() {}
}
