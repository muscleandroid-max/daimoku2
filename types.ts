export interface DataEntry {
  id: string;
  value: number;
  timestamp: number;
  cumulativeAtPoint: number; // Snapshot of total at this time (optional, but useful for static history)
}

export type SortDirection = 'asc' | 'desc';