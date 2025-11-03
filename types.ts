
export type UserRole = 'student' | 'admin';

export interface Guardian {
    name: string;
    contactNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  rollNumber?: string;
  room?: Room;
  feePaid: boolean;
  contactNumber?: string;
  guardian?: Guardian;
}

export enum GatePassStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  OUT = 'out',
  IN = 'in',
  REJECTED = 'rejected',
}

export interface GatePass {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: GatePassStatus;
  approvalQrCodeData: string; // For admin scan-to-approve
  qrCodeData?: string; // For security gate, generated on approval
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  reason: string;
  status: RequestStatus;
  requestDate: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  description: string;
  status: RequestStatus;
}

export interface Room {
  id: string;
  roomNumber: string;
  block: string;
  capacity: number;
  occupants: string[]; // array of student IDs
}

export interface Parcel {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courier: string;
  trackingId: string;
  receivedDate: string;
  collected: boolean;
}

export interface MessMenuItem {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface AdminDashboardAnalytics {
  totalStudents: number;
  studentsOnLeave: number;
  studentsOut: number;
  pendingComplaints: number;
  feesPending: number;
  feesPaid: number;
  parcelsToCollect: number;
  pendingEmergencies: number;
  leaveRequestsOverTime: { date: string; count: number }[];
}

export enum EmergencyType {
  MEDICAL = 'Medical',
  FIRE = 'Fire',
  SECURITY = 'Security',
  OTHER = 'Other'
}

export enum AlertStatus {
    SENT = 'Sent',
    ACKNOWLEDGED = 'Acknowledged'
}

export interface EmergencyAlert {
    id: string;
    studentId: string;
    studentName: string;
    rollNumber: string;
    roomDetails: string;
    emergencyType: EmergencyType;
    description: string;
    timestamp: string;
    status: AlertStatus;
}

export enum LostAndFoundStatus {
    OPEN = 'Open',
    CLAIMED = 'Claimed'
}

export interface LostAndFoundItem {
    id: string;
    studentId: string;
    studentName: string;
    itemType: 'lost' | 'found';
    description: string;
    location: string;
    datePosted: string;
    status: LostAndFoundStatus;
}