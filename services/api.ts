import { supabase } from '../lib/supabase';
import {
    User, UserRole, GatePass, LeaveRequest, Complaint, Room, Parcel, MessMenuItem,
    RequestStatus, GatePassStatus, AdminDashboardAnalytics, EmergencyAlert, EmergencyType, AlertStatus, Guardian, LostAndFoundItem, LostAndFoundStatus
} from '../types';

let currentUser: User | null = null;

export const checkSession = async (): Promise<User | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

            if (profile) {
                currentUser = {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    passwordHash: '',
                    role: profile.role,
                    rollNumber: profile.roll_number,
                    room: undefined,
                    feePaid: false,
                    contactNumber: profile.contact_number,
                    guardian: {
                        name: profile.guardian_name,
                        contactNumber: profile.guardian_contact
                    }
                };
                return currentUser;
            }
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
    return null;
};

export const login = async (email: string, password: string): Promise<User> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login failed');

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error('Profile not found');

        currentUser = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            passwordHash: '',
            role: profile.role,
            rollNumber: profile.roll_number,
            room: undefined,
            feePaid: false,
            contactNumber: profile.contact_number,
            guardian: {
                name: profile.guardian_name,
                contactNumber: profile.guardian_contact
            }
        };

        return currentUser;
    } catch (error) {
        throw new Error((error as any).message || 'Login failed');
    }
};

export const register = async (userData: Partial<User> & { password?: string }): Promise<User> => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email || '',
            password: userData.password || ''
        });

        if (error) throw error;
        if (!data.user) throw new Error('Registration failed');

        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: data.user.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                roll_number: userData.rollNumber,
                contact_number: userData.contactNumber,
                guardian_name: userData.guardian?.name,
                guardian_contact: userData.guardian?.contactNumber
            }]);

        if (profileError) throw profileError;

        currentUser = {
            id: data.user.id,
            name: userData.name || '',
            email: userData.email || '',
            passwordHash: '',
            role: userData.role || 'student',
            rollNumber: userData.rollNumber,
            room: undefined,
            feePaid: false,
            contactNumber: userData.contactNumber,
            guardian: userData.guardian
        };

        return currentUser;
    } catch (error) {
        throw new Error((error as any).message || 'Registration failed');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await supabase.auth.signOut();
        currentUser = null;
    } catch (error) {
        throw new Error((error as any).message || 'Logout failed');
    }
};

export const getGatePasses = async (): Promise<GatePass[]> => {
    try {
        const { data, error } = await supabase
            .from('gate_passes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(p => ({
            id: p.id,
            studentId: p.student_id,
            studentName: p.student_name,
            rollNumber: p.roll_number,
            reason: p.reason,
            status: p.status,
            issueDate: p.issue_date,
            validUntil: p.valid_until
        })) || [];
    } catch (error) {
        console.error('Error fetching gate passes:', error);
        return [];
    }
};

export const createGatePass = async (gatePass: Partial<GatePass>): Promise<GatePass> => {
    try {
        const { data, error } = await supabase
            .from('gate_passes')
            .insert([{
                student_id: gatePass.studentId,
                student_name: gatePass.studentName,
                roll_number: gatePass.rollNumber,
                reason: gatePass.reason,
                issue_date: gatePass.issueDate,
                valid_until: gatePass.validUntil,
                status: 'pending'
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create gate pass');

        return {
            id: data.id,
            studentId: data.student_id,
            studentName: data.student_name,
            rollNumber: data.roll_number,
            reason: data.reason,
            status: data.status,
            issueDate: data.issue_date,
            validUntil: data.valid_until
        };
    } catch (error) {
        throw new Error((error as any).message || 'Failed to create gate pass');
    }
};

export const updateGatePassStatus = async (id: string, status: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('gate_passes')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to update gate pass');
    }
};

export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
    try {
        const { data, error } = await supabase
            .from('leave_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(r => ({
            id: r.id,
            studentId: r.student_id,
            studentName: r.student_name,
            rollNumber: r.roll_number,
            reason: r.reason,
            status: r.status,
            requestDate: r.created_at
        })) || [];
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        return [];
    }
};

export const createLeaveRequest = async (request: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    try {
        const { data, error } = await supabase
            .from('leave_requests')
            .insert([{
                student_id: request.studentId,
                student_name: request.studentName,
                roll_number: request.rollNumber,
                reason: request.reason,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                status: 'pending'
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create leave request');

        return {
            id: data.id,
            studentId: data.student_id,
            studentName: data.student_name,
            rollNumber: data.roll_number,
            reason: data.reason,
            status: data.status,
            requestDate: data.created_at
        };
    } catch (error) {
        throw new Error((error as any).message || 'Failed to create leave request');
    }
};

export const updateLeaveRequestStatus = async (id: string, status: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('leave_requests')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to update leave request');
    }
};

export const getComplaints = async (): Promise<Complaint[]> => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(c => ({
            id: c.id,
            studentId: c.student_id,
            studentName: c.student_name,
            rollNumber: c.roll_number,
            type: c.complaint_type,
            description: c.description,
            status: c.status,
            priority: c.priority,
            date: c.created_at
        })) || [];
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return [];
    }
};

export const createComplaint = async (complaint: Partial<Complaint>): Promise<Complaint> => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .insert([{
                student_id: complaint.studentId,
                student_name: complaint.studentName,
                roll_number: complaint.rollNumber,
                complaint_type: complaint.type,
                description: complaint.description,
                status: 'open',
                priority: complaint.priority || 'normal'
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create complaint');

        return {
            id: data.id,
            studentId: data.student_id,
            studentName: data.student_name,
            rollNumber: data.roll_number,
            type: data.complaint_type,
            description: data.description,
            status: data.status,
            priority: data.priority,
            date: data.created_at
        };
    } catch (error) {
        throw new Error((error as any).message || 'Failed to create complaint');
    }
};

export const updateComplaintStatus = async (id: string, status: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('complaints')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to update complaint');
    }
};

export const getParcels = async (): Promise<Parcel[]> => {
    try {
        const { data, error } = await supabase
            .from('parcels')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(p => ({
            id: p.id,
            studentId: p.student_id,
            studentName: p.student_name,
            rollNumber: p.roll_number,
            courier: p.courier,
            trackingId: p.tracking_id,
            receivedDate: p.received_date,
            collected: p.status === 'collected'
        })) || [];
    } catch (error) {
        console.error('Error fetching parcels:', error);
        return [];
    }
};

export const createParcel = async (parcel: Partial<Parcel>): Promise<Parcel> => {
    try {
        const { data, error } = await supabase
            .from('parcels')
            .insert([{
                student_id: parcel.studentId,
                student_name: parcel.studentName,
                roll_number: parcel.rollNumber,
                courier: parcel.courier,
                tracking_id: parcel.trackingId,
                received_date: new Date().toISOString(),
                status: 'received'
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create parcel');

        return {
            id: data.id,
            studentId: data.student_id,
            studentName: data.student_name,
            rollNumber: data.roll_number,
            courier: data.courier,
            trackingId: data.tracking_id,
            receivedDate: data.received_date,
            collected: data.status === 'collected'
        };
    } catch (error) {
        throw new Error((error as any).message || 'Failed to create parcel');
    }
};

export const updateParcelStatus = async (id: string, collected: boolean): Promise<void> => {
    try {
        const { error } = await supabase
            .from('parcels')
            .update({
                status: collected ? 'collected' : 'held',
                collected_date: collected ? new Date().toISOString() : null
            })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to update parcel');
    }
};

export const getEmergencyAlerts = async (): Promise<EmergencyAlert[]> => {
    try {
        const { data, error } = await supabase
            .from('emergency_alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(a => ({
            id: a.id,
            studentId: a.student_id,
            studentName: a.student_name,
            rollNumber: a.roll_number,
            type: a.alert_type,
            description: a.description,
            status: a.status,
            priority: a.priority,
            timestamp: a.created_at
        })) || [];
    } catch (error) {
        console.error('Error fetching emergency alerts:', error);
        return [];
    }
};

export const createEmergencyAlert = async (alert: Partial<EmergencyAlert>): Promise<EmergencyAlert> => {
    try {
        const { data, error } = await supabase
            .from('emergency_alerts')
            .insert([{
                student_id: alert.studentId,
                student_name: alert.studentName,
                roll_number: alert.rollNumber,
                alert_type: alert.type,
                description: alert.description,
                status: 'active',
                priority: alert.priority || 'normal'
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create emergency alert');

        return {
            id: data.id,
            studentId: data.student_id,
            studentName: data.student_name,
            rollNumber: data.roll_number,
            type: data.alert_type,
            description: data.description,
            status: data.status,
            priority: data.priority,
            timestamp: data.created_at
        };
    } catch (error) {
        throw new Error((error as any).message || 'Failed to create emergency alert');
    }
};

export const getLostAndFound = async (): Promise<LostAndFoundItem[]> => {
    try {
        const { data, error } = await supabase
            .from('lost_and_found')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(item => ({
            id: item.id,
            studentId: item.student_id,
            studentName: item.student_name,
            itemType: item.item_type,
            description: item.description,
            location: item.location,
            datePosted: item.created_at,
            status: item.status
        })) || [];
    } catch (error) {
        console.error('Error fetching lost and found:', error);
        return [];
    }
};

export const createLostAndFoundItem = async (item: Partial<LostAndFoundItem>): Promise<LostAndFoundItem> => {
    try {
        const { data, error } = await supabase
            .from('lost_and_found')
            .insert([{
                student_id: item.studentId,
                student_name: item.studentName,
                item_type: item.itemType,
                description: item.description,
                location: item.location,
                status: 'open'
            }])
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Failed to create lost and found item');

        return {
            id: data.id,
            studentId: data.student_id,
            studentName: data.student_name,
            itemType: data.item_type,
            description: data.description,
            location: data.location,
            datePosted: data.created_at,
            status: data.status
        };
    } catch (error) {
        throw new Error((error as any).message || 'Failed to create lost and found item');
    }
};

export const getMessMenu = async (): Promise<MessMenuItem[]> => {
    try {
        const { data, error } = await supabase
            .from('mess_menu')
            .select('*')
            .in('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            .order('day', { ascending: true });

        if (error) throw error;
        return data?.map(m => ({
            day: m.day,
            breakfast: m.breakfast,
            lunch: m.lunch,
            dinner: m.dinner
        })) || [];
    } catch (error) {
        console.error('Error fetching mess menu:', error);
        return [];
    }
};

export const updateMessMenu = async (day: string, menu: Partial<MessMenuItem>): Promise<void> => {
    try {
        const { error } = await supabase
            .from('mess_menu')
            .upsert({
                day,
                breakfast: menu.breakfast || '',
                lunch: menu.lunch || '',
                dinner: menu.dinner || ''
            });

        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to update mess menu');
    }
};

export const getDashboardAnalytics = async (): Promise<AdminDashboardAnalytics> => {
    try {
        const [gatePasses, leaves, complaints, parcels, alerts] = await Promise.all([
            supabase.from('gate_passes').select('id, status'),
            supabase.from('leave_requests').select('id, status'),
            supabase.from('complaints').select('id, status'),
            supabase.from('parcels').select('id, status'),
            supabase.from('emergency_alerts').select('id, status')
        ]);

        return {
            totalGatePasses: gatePasses.data?.length || 0,
            totalLeaveRequests: leaves.data?.length || 0,
            pendingComplaints: complaints.data?.filter((c: any) => c.status === 'open').length || 0,
            totalParcels: parcels.data?.length || 0,
            activeEmergencyAlerts: alerts.data?.filter((a: any) => a.status === 'active').length || 0
        };
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        return {
            totalGatePasses: 0,
            totalLeaveRequests: 0,
            pendingComplaints: 0,
            totalParcels: 0,
            activeEmergencyAlerts: 0
        };
    }
};

export const applyForGatePass = createGatePass;
export const applyForLeave = createLeaveRequest;
export const fileComplaint = createComplaint;
export const collectParcel = updateParcelStatus;
export const sendEmergencyAlert = createEmergencyAlert;
export const postLostAndFoundItem = createLostAndFoundItem;
export const claimLostAndFoundItem = (id: string) => supabase.from('lost_and_found').update({ status: 'claimed' }).eq('id', id);
export const approveGatePass = (id: string) => updateGatePassStatus(id, 'approved');
export const approveLeave = (id: string) => updateLeaveRequestStatus(id, 'approved');
export const resolveComplaint = (id: string) => updateComplaintStatus(id, 'resolved');
export const acknowledgeEmergencyAlert = (id: string) => supabase.from('emergency_alerts').update({ status: 'resolved' }).eq('id', id);
export const deleteLostAndFoundItem = (id: string) => supabase.from('lost_and_found').delete().eq('id', id);

export const allocateRoom = async (studentId: string, roomId: string) => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ room_id: roomId })
            .eq('id', studentId);
        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to allocate room');
    }
};

export const manuallyUpdateFeeStatus = async (studentId: string, status: string) => {
    try {
        const { error } = await supabase
            .from('fees')
            .update({ status })
            .eq('student_id', studentId);
        if (error) throw error;
    } catch (error) {
        throw new Error((error as any).message || 'Failed to update fee status');
    }
};

export const addParcel = createParcel;

export const getStudentData = async (studentId: string) => {
    try {
        const [gatePassesData, leavesData, complaintsData, parcelsData] = await Promise.all([
            supabase.from('gate_passes').select('*').eq('student_id', studentId),
            supabase.from('leave_requests').select('*').eq('student_id', studentId),
            supabase.from('complaints').select('*').eq('student_id', studentId),
            supabase.from('parcels').select('*').eq('student_id', studentId)
        ]);

        return {
            gatePasses: gatePassesData.data || [],
            leaves: leavesData.data || [],
            complaints: complaintsData.data || [],
            parcels: parcelsData.data || []
        };
    } catch (error) {
        console.error('Error fetching student data:', error);
        return { gatePasses: [], leaves: [], complaints: [], parcels: [] };
    }
};

export const getAdminData = async () => {
    try {
        const [gatePasses, leaves, complaints, parcels, alerts, lostFound] = await Promise.all([
            supabase.from('gate_passes').select('*'),
            supabase.from('leave_requests').select('*'),
            supabase.from('complaints').select('*'),
            supabase.from('parcels').select('*'),
            supabase.from('emergency_alerts').select('*'),
            supabase.from('lost_and_found').select('*')
        ]);

        return {
            gatePasses: gatePasses.data || [],
            leaves: leaves.data || [],
            complaints: complaints.data || [],
            parcels: parcels.data || [],
            alerts: alerts.data || [],
            lostFound: lostFound.data || []
        };
    } catch (error) {
        console.error('Error fetching admin data:', error);
        return { gatePasses: [], leaves: [], complaints: [], parcels: [], alerts: [], lostFound: [] };
    }
};
