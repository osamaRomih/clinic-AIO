export interface TableColumn{
  name:string;
  dataKey:string;
  position?:'right' | 'left';
  type?: 'text' | 'avatar' | 'badge' | 'custom';
  extra?: { nameKey?: string };
  isSortable?:boolean
}