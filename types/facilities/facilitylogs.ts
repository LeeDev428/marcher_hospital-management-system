export interface FacilityLog {
  id: number;
  timestamp: string;        // ISO date string
  user: string;             // Username or Staff ID
  role: string;             // Role of the user (Admin, Nurse, System)
  action: string;           // e.g. Created Room, Updated Status
  roomIdentifier: string;   // e.g. Room 1B
  type: string;         // e.g. Main, Building 1
  oldStatus?: string;       // Optional: previous status
  newStatus?: string;       // Optional: updated status
}
