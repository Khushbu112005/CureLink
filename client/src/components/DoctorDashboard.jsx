import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, UserPlus } from 'lucide-react';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}/status`, { status });
            fetchAppointments();
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="doctor-dashboard">
            <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                    <Calendar className="icon-primary" size={24} />
                    Upcoming Appointments
                </h2>
            </div>

            <div className="appointments-grid">
                {appointments.length === 0 ? (
                    <p className="no-data">No appointments scheduled.</p>
                ) : (
                    appointments.map(appt => (
                        <div key={appt.id} className="card doctor-appt-card">
                            <div className="patient-info">
                                <h3>{appt.patient_name}</h3>
                                <div className="appt-meta">
                                    <span>{new Date(appt.date).toLocaleDateString()}</span>
                                    <span>{appt.time.substring(0, 5)}</span>
                                </div>
                                {appt.notes && <p className="appt-notes">"{appt.notes}"</p>}
                            </div>

                            <div className="appt-actions">
                                <span className={`status-badge status-${appt.status} mr-2`}>
                                    {appt.status}
                                </span>

                                {appt.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                                            className="btn btn-sm btn-confirm"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                                            className="btn btn-sm btn-cancel"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {appt.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusUpdate(appt.id, 'completed')}
                                        className="btn btn-sm btn-complete"
                                    >
                                        Mark Done
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Future Feature: Add Record Component */}
            <div className="card empty-state-card">
                <div className="text-center">
                    <UserPlus size={40} className="empty-icon" />
                    <h3 className="font-medium text-slate-600">Patient Management</h3>
                    <p className="text-sm text-slate-400">Select a patient to add medical records (Implementation simplifed for MVP)</p>
                </div>
            </div>
        </div>
    );
}
