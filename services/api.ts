import {
    User, UserRole, GatePass, LeaveRequest, Complaint, Room, Parcel, MessMenuItem,
    RequestStatus, GatePassStatus, AdminDashboardAnalytics, EmergencyAlert, EmergencyType, AlertStatus, Guardian, LostAndFoundItem, LostAndFoundStatus
} from '../types';

// --- MOCK DATABASE with localStorage persistence ---
let nextId = parseInt(localStorage.getItem('hms_nextId') || '1');
const generateId = (prefix: string) => {
    const id = nextId++;
    localStorage.setItem('hms_nextId', id.toString());
    return `${prefix}${id}`;
}


const D = {
    getItem: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage key “${key}”:`, error);
            return defaultValue;
        }
    },
    setItem: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }
};

const HASHED_PASSWORD = 'hashed_password_placeholder';

const initialUsers: User[] = [
    { id: 'student1', name: 'Alice Smith', email: 'alice@iiitk.ac.in', passwordHash: HASHED_PASSWORD, role: 'student', rollNumber: 'S2021001', room: undefined, feePaid: false, contactNumber: '9876543210', guardian: { name: 'John Smith', contactNumber: '9876543211' } },
    { id: 'student2', name: 'Bob Johnson', email: 'bob@iiitk.ac.in', passwordHash: HASHED_PASSWORD, role: 'student', rollNumber: 'S2021002', room: undefined, feePaid: true, contactNumber: '8765432109', guardian: { name: 'Robert Johnson', contactNumber: '8765432108' } },
    { id: 'student3', name: 'Charlie Brown', email: 'charlie@iiitk.ac.in', passwordHash: HASHED_PASSWORD, role: 'student', rollNumber: 'S2021003', room: undefined, feePaid: true, contactNumber: '7654321098', guardian: { name: 'Charles Brown Sr.', contactNumber: '7654321097' } },
    { id: 'admin1', name: 'Admin User', email: 'admin@iiitk.ac.in', passwordHash: HASHED_PASSWORD, role: 'admin', feePaid: true },
];
let users: User[] = D.getItem('hms_users', initialUsers);
if (users.length === 0) users = initialUsers;

const initialRooms: Room[] = [
    { id: 'room1', roomNumber: '101', block: 'A', capacity: 2, occupants: [] },
    { id: 'room2', roomNumber: '102', block: 'A', capacity: 2, occupants: [] },
    { id: 'room3', roomNumber: '201', block: 'B', capacity: 3, occupants: [] },
];
let rooms: Room[] = D.getItem('hms_rooms', initialRooms);

// Sync room occupancy from user data
rooms.forEach(r => r.occupants = []);
users.forEach(u => {
    if (u.room) {
        const room = rooms.find(r => r.id === (u.room as Room).id);
        if (room && room.occupants.length < room.capacity) {
            room.occupants.push(u.id);
            u.room = room;
        } else {
            u.room = undefined;
        }
    }
});


let gatePasses: GatePass[] = D.getItem('hms_gatePasses', []);

const initialLeaveRequests: LeaveRequest[] = [
    { id: 'lr1', studentId: 'student1', studentName: 'Alice Smith', rollNumber: 'S2021001', reason: 'Family function', status: RequestStatus.APPROVED, requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lr2', studentId: 'student2', studentName: 'Bob Johnson', rollNumber: 'S2021002', reason: 'Medical appointment', status: RequestStatus.APPROVED, requestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lr3', studentId: 'student3', studentName: 'Charlie Brown', rollNumber: 'S2021003', reason: 'Feeling unwell', status: RequestStatus.PENDING, requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lr4', studentId: 'student1', studentName: 'Alice Smith', rollNumber: 'S2021001', reason: 'Conference', status: RequestStatus.PENDING, requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lr5', studentId: 'student2', studentName: 'Bob Johnson', rollNumber: 'S2021002', reason: 'Personal work', status: RequestStatus.PENDING, requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];
let leaveRequests: LeaveRequest[] = D.getItem('hms_leaveRequests', initialLeaveRequests.length > 0 ? initialLeaveRequests : []);
if (D.getItem('hms_leaveRequests', []).length === 0) leaveRequests = initialLeaveRequests;


let complaints: Complaint[] = D.getItem('hms_complaints', []);
let emergencyAlerts: EmergencyAlert[] = D.getItem('hms_emergencyAlerts', []);
const initialParcels: Parcel[] = [
    { id: 'parcel1', studentId: 'student2', studentName: 'Bob Johnson', rollNumber: 'S2021002', courier: 'Amazon', trackingId: 'AMZ123', receivedDate: new Date().toISOString(), collected: false }
];
let parcels: Parcel[] = D.getItem('hms_parcels', D.getItem('hms_parcels', []).length > 0 ? D.getItem('hms_parcels', []) : initialParcels);

const initialLostAndFoundItems: LostAndFoundItem[] = [
    { id: 'lf1', studentId: 'student1', studentName: 'Alice Smith', itemType: 'lost', description: 'Blue water bottle (Cello)', location: 'Mess Hall', datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: LostAndFoundStatus.OPEN },
    { id: 'lf2', studentId: 'student2', studentName: 'Bob Johnson', itemType: 'found', description: 'Physics textbook - "Concepts of Physics"', location: 'Library 1st floor', datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: LostAndFoundStatus.OPEN },
];
let lostAndFoundItems: LostAndFoundItem[] = D.getItem('hms_lostAndFound', D.getItem('hms_lostAndFound', []).length > 0 ? D.getItem('hms_lostAndFound', []) : initialLostAndFoundItems);

const initialMessMenu: MessMenuItem[] = [
    { day: 'Monday', breakfast: 'Idli, Sambar', lunch: 'Rice, Dal, Veg Curry', dinner: 'Chapathi, Paneer Butter Masala' },
    { day: 'Tuesday', breakfast: 'Puri, Aloo Curry', lunch: 'Veg Biryani, Raita', dinner: 'Rice, Sambar, Fry' },
    { day: 'Wednesday', breakfast: 'Dosa, Chutney', lunch: 'Rice, Dal, Veg Curry', dinner: 'Chapathi, Veg Kurma' },
    { day: 'Thursday', breakfast: 'Upma', lunch: 'Lemon Rice, Curd Rice', dinner: 'Rice, Sambar, Fry' },
    { day: 'Friday', breakfast: 'Pongal, Vada', lunch: 'Rice, Dal, Veg Curry', dinner: 'Chapathi, Chana Masala' },
    { day: 'Saturday', breakfast: 'Bread, Jam', lunch: 'Special Lunch', dinner: 'Rice, Sambar, Fry' },
    { day: 'Sunday', breakfast: 'Aloo Paratha', lunch: 'Chicken Biryani (Non-veg) / Paneer Biryani (Veg)', dinner: 'Dosa, Sambar' },
];
let messMenu: MessMenuItem[] = D.getItem('hms_messMenu', initialMessMenu);

let currentUser: User | null = null;

const persistData = () => {
    D.setItem('hms_users', users);
    D.setItem('hms_rooms', rooms);
    D.setItem('hms_gatePasses', gatePasses);
    D.setItem('hms_leaveRequests', leaveRequests);
    D.setItem('hms_complaints', complaints);
    D.setItem('hms_parcels', parcels);
    D.setItem('hms_messMenu', messMenu);
    D.setItem('hms_emergencyAlerts', emergencyAlerts);
    D.setItem('hms_lostAndFound', lostAndFoundItems);
};

// --- API FUNCTIONS ---

// Authentication
export const checkSession = async (): Promise<User | null> => {
    const sessionUser = sessionStorage.getItem('currentUser');
    if (sessionUser) {
        currentUser = JSON.parse(sessionUser);
        return currentUser;
    }
    return null;
};

export const login = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.email === email);
            if (user) {
                currentUser = user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                resolve(user);
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 500);
    });
};

export const register = async (userData: Partial<User> & { password?: string }): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (users.some(u => u.email === userData.email)) {
                return reject(new Error('User with this email already exists.'));
            }
            const newUser: User = {
                id: generateId(userData.role === 'student' ? 's' : 'a'),
                name: userData.name!,
                email: userData.email!,
                passwordHash: HASHED_PASSWORD,
                role: userData.role!,
                rollNumber: userData.rollNumber,
                feePaid: false,
            };
            users.push(newUser);
            persistData();
            currentUser = newUser;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            resolve(newUser);
        }, 500);
    });
};

export const logout = async (): Promise<void> => {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
};


// Student Data
export const getStudentData = async (userId: string): Promise<any> => {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");

    return {
        user,
        room: rooms.find(r => r.id === (user.room as Room)?.id),
        gatePass: gatePasses.find(gp => gp.studentId === userId && gp.status !== GatePassStatus.IN && gp.status !== GatePassStatus.REJECTED) || null,
        leaves: leaveRequests.filter(l => l.studentId === userId).sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
        complaints: complaints.filter(c => c.studentId === userId).sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1))),
        parcels: parcels.filter(p => p.studentId === userId).sort((a,b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()),
        messMenu,
        emergencyAlerts: emergencyAlerts.filter(a => a.studentId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        lostAndFoundItems: lostAndFoundItems.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()),
    };
};

// Admin Data
export const getAdminData = async (): Promise<any> => {
    const students = users.filter(u => u.role === 'student');
    const feesPendingCount = students.filter(s => !s.feePaid).length;

    // Calculate leave requests over time
    const leaveCountsByDate = leaveRequests.reduce((acc, req) => {
        const date = new Date(req.requestDate).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const leaveRequestsOverTime = Object.entries(leaveCountsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const analytics: AdminDashboardAnalytics = {
        totalStudents: students.length,
        studentsOnLeave: leaveRequests.filter(l => l.status === RequestStatus.APPROVED).length,
        studentsOut: gatePasses.filter(gp => gp.status === GatePassStatus.OUT).length,
        pendingComplaints: complaints.filter(c => c.status === RequestStatus.PENDING).length,
        feesPending: feesPendingCount,
        feesPaid: students.length - feesPendingCount,
        parcelsToCollect: parcels.filter(p => !p.collected).length,
        pendingEmergencies: emergencyAlerts.filter(a => a.status === AlertStatus.SENT).length,
        leaveRequestsOverTime,
    };
    return {
        analytics,
        gatePassRequests: gatePasses.sort((a, b) => parseInt(b.id.slice(2)) - parseInt(a.id.slice(2))),
        leaveRequests: leaveRequests.filter(l => l.status === RequestStatus.PENDING).sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
        complaints: complaints.filter(c => c.status === RequestStatus.PENDING).sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1))),
        emergencyAlerts: emergencyAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        rooms,
        students,
        parcels: parcels.sort((a,b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()),
        messMenu,
        lostAndFoundItems: lostAndFoundItems.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()),
    };
};


// Gate Pass
export const applyForGatePass = async (studentId: string, data: { reason: string, fromDate: string, toDate: string }): Promise<GatePass> => {
    const student = users.find(u => u.id === studentId);
    if (!student) throw new Error("Student not found");
    const existingPass = gatePasses.find(gp => gp.studentId === studentId && gp.status !== GatePassStatus.IN && gp.status !== GatePassStatus.REJECTED);
    if (existingPass) throw new Error("You already have an active gate pass request.");
    
    const passId = generateId('gp');

    const newPass: GatePass = {
        id: passId,
        studentId,
        studentName: student.name,
        rollNumber: student.rollNumber!,
        ...data,
        status: GatePassStatus.PENDING,
        approvalQrCodeData: passId, // Simple ID for admin approval scan
        qrCodeData: undefined, // Will be generated on approval
    };
    gatePasses.push(newPass);
    persistData();
    return newPass;
};

export const approveGatePass = async (passId: string, approve: boolean): Promise<GatePass> => {
    const pass = gatePasses.find(p => p.id === passId);
    if (!pass) throw new Error("Gate Pass not found");
    
    pass.status = approve ? GatePassStatus.APPROVED : GatePassStatus.REJECTED;

    if (approve) {
        const student = users.find(u => u.id === pass.studentId);
        if (student) {
             // Generate the detailed QR code for the security gate now that it's approved
            const qrCodePayload = {
                passId: pass.id,
                studentId: student.id,
                name: student.name,
                rollNumber: student.rollNumber!,
                reason: pass.reason,
                fromDate: pass.fromDate,
                toDate: pass.toDate,
            };
            pass.qrCodeData = JSON.stringify(qrCodePayload);

            console.log(`[EMAIL SIMULATION]
To: ${student.email}
Subject: Your Gate Pass Request has been Approved

Dear ${student.name},

Your gate pass request for the reason "${pass.reason}" from ${new Date(pass.fromDate).toLocaleString()} to ${new Date(pass.toDate).toLocaleString()} has been approved.

You can now print the gate pass from the student portal.

Regards,
Hostel Administration
IIITDM Kurnool`);
        }
    }
    persistData();
    return pass;
};

export const updateGatePassStatusFromQR = async (qrData: string): Promise<GatePass> => {
    let passId: string;
    let studentId: string;

    try {
        const qrPayload = JSON.parse(qrData);
        if (!qrPayload.passId || !qrPayload.studentId) {
             throw new Error("Invalid QR Code: Missing required pass details.");
        }
        passId = qrPayload.passId;
        studentId = qrPayload.studentId;
    } catch (e) {
        throw new Error("Invalid QR Code: Not in the expected JSON format.");
    }

    const pass = gatePasses.find(p => p.id === passId && p.studentId === studentId);
    if (!pass) throw new Error("Gate Pass not found from QR Code data");

    if (pass.status === GatePassStatus.APPROVED) {
        pass.status = GatePassStatus.OUT;
    } else if (pass.status === GatePassStatus.OUT) {
        pass.status = GatePassStatus.IN;
    } else {
        throw new Error(`Cannot update status. Current status is ${pass.status}.`);
    }
    persistData();
    return pass;
};


// Leave & Complaints
export const applyForLeave = async (studentId: string, reason: string): Promise<LeaveRequest> => {
    const student = users.find(u => u.id === studentId);
    if (!student) throw new Error("Student not found");
    const newLeave: LeaveRequest = {
        id: generateId('lr'),
        studentId,
        studentName: student.name,
        rollNumber: student.rollNumber!,
        reason,
        status: RequestStatus.PENDING,
        requestDate: new Date().toISOString(),
    };
    leaveRequests.push(newLeave);
    persistData();
    return newLeave;
};

export const approveLeave = async (leaveId: string, approve: boolean): Promise<LeaveRequest> => {
    const leave = leaveRequests.find(l => l.id === leaveId);
    if (!leave) throw new Error("Leave Request not found");
    leave.status = approve ? RequestStatus.APPROVED : RequestStatus.REJECTED;
    persistData();
    return leave;
};

export const fileComplaint = async (studentId: string, description: string): Promise<Complaint> => {
    const student = users.find(u => u.id === studentId);
    if (!student) throw new Error("Student not found");
    const newComplaint: Complaint = {
        id: generateId('c'),
        studentId,
        studentName: student.name,
        rollNumber: student.rollNumber!,
        description,
        status: RequestStatus.PENDING,
    };
    complaints.push(newComplaint);
    persistData();
    return newComplaint;
};

export const resolveComplaint = async (complaintId: string, resolve: boolean): Promise<Complaint> => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) throw new Error("Complaint not found");
    complaint.status = resolve ? RequestStatus.APPROVED : RequestStatus.REJECTED;
    persistData();
    return complaint;
};

// Emergency
export const sendEmergencyAlert = async (studentId: string, data: { emergencyType: EmergencyType, description: string }): Promise<EmergencyAlert> => {
    const student = users.find(u => u.id === studentId);
    if (!student) throw new Error("Student not found");
    const studentRoom = student.room ? `${student.room.block}-${student.room.roomNumber}` : 'Not Allocated';
    
    const newAlert: EmergencyAlert = {
        id: generateId('em'),
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber!,
        roomDetails: studentRoom,
        emergencyType: data.emergencyType,
        description: data.description,
        timestamp: new Date().toISOString(),
        status: AlertStatus.SENT,
    };
    emergencyAlerts.push(newAlert);
    persistData();
    return newAlert;
};

export const acknowledgeEmergencyAlert = async (alertId: string): Promise<EmergencyAlert> => {
    const alert = emergencyAlerts.find(a => a.id === alertId);
    if (!alert) throw new Error("Emergency Alert not found");
    alert.status = AlertStatus.ACKNOWLEDGED;
    persistData();
    return alert;
};

// Parcels
export const addParcel = async (data: { studentId: string, courier: string, trackingId: string }): Promise<Parcel> => {
    const student = users.find(u => u.id === data.studentId);
    if (!student) throw new Error("Student not found");
    const newParcel: Parcel = {
        id: generateId('p'),
        studentId: data.studentId,
        studentName: student.name,
        rollNumber: student.rollNumber!,
        courier: data.courier,
        trackingId: data.trackingId,
        receivedDate: new Date().toISOString(),
        collected: false,
    };
    parcels.push(newParcel);
    persistData();
    return newParcel;
};

export const collectParcel = async (parcelId: string): Promise<Parcel> => {
    const parcel = parcels.find(p => p.id === parcelId);
    if (!parcel) throw new Error("Parcel not found");
    parcel.collected = true;
    persistData();
    return parcel;
};

// Lost & Found
export const postLostAndFoundItem = async (studentId: string, data: { itemType: 'lost' | 'found', description: string, location: string }): Promise<LostAndFoundItem> => {
    const student = users.find(u => u.id === studentId);
    if (!student) throw new Error("Student not found");
    const newItem: LostAndFoundItem = {
        id: generateId('lf'),
        studentId: student.id,
        studentName: student.name,
        ...data,
        datePosted: new Date().toISOString(),
        status: LostAndFoundStatus.OPEN,
    };
    lostAndFoundItems.push(newItem);
    persistData();
    return newItem;
};

export const claimLostAndFoundItem = async (itemId: string): Promise<LostAndFoundItem> => {
    const item = lostAndFoundItems.find(i => i.id === itemId);
    if (!item) throw new Error("Item not found");
    item.status = LostAndFoundStatus.CLAIMED;
    persistData();
    return item;
};

export const deleteLostAndFoundItem = async (itemId: string): Promise<void> => {
    lostAndFoundItems = lostAndFoundItems.filter(i => i.id !== itemId);
    persistData();
};


// Rooms and Fees
export const allocateRoom = async (studentId: string, roomId: string): Promise<User> => {
    const student = users.find(u => u.id === studentId);
    const room = rooms.find(r => r.id === roomId);
    if (!student || !room) throw new Error("Student or Room not found");
    if (room.occupants.length >= room.capacity) throw new Error("Room is full");
    if (student.room) {
        const oldRoom = rooms.find(r => r.id === (student.room as Room)!.id);
        if (oldRoom) {
            oldRoom.occupants = oldRoom.occupants.filter(id => id !== studentId);
        }
    }
    student.room = room;
    room.occupants.push(studentId);
    persistData();
    return student;
};

export const manuallyUpdateFeeStatus = async (studentId: string): Promise<User> => {
    const student = users.find(u => u.id === studentId);
    if (!student) throw new Error("Student not found");
    student.feePaid = true;

    // Simulate sending a notification
    console.log(`[NOTIFICATION SIMULATION]
To: ${student.email}
Subject: Hostel Fee Payment Received

Dear ${student.name},

We have successfully received your hostel fee payment. Your fee status has been updated to 'Paid'.

Thank you,
Hostel Administration
IIITDM Kurnool`);
    
    persistData();
    return student;
};

// Mess Menu
export const updateMessMenu = async (newMenu: MessMenuItem[]): Promise<MessMenuItem[]> => {
    messMenu = newMenu;
    persistData();
    return messMenu;
};