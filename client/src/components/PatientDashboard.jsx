import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, FileText, Plus } from 'lucide-react';
import './PatientDashboard.css';

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('appointments');

    // Booking Form State
    const [bookingData, setBookingData] = useState({ doctor_id: '', date: '', time: '', notes: '' });
    const [bookingStatus, setBookingStatus] = useState('');

    useEffect(() => {
        fetchData();
        fetchDoctors();
    }, []);

    const fetchData = async () => {
        try {
            const [apptRes, recRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/medical-records')
            ]);
            setAppointments(apptRes.data);
            setRecords(recRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/users/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments/book', bookingData);
            setBookingStatus('booked');
            setBookingData({ doctor_id: '', date: '', time: '', notes: '' });
            fetchData();
            setTimeout(() => setBookingStatus(''), 3000);
        } catch (err) {
            console.error(err);
            setBookingStatus('error');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="patient-dashboard">
            {/* Main Content */}
            <div className="dashboard-main">
                {/* Tabs */}
                <div className="dashboard-tabs">
                    <nav className="tab-nav">
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                        >
                            <Calendar size={16} />
                            Appointments
                        </button>
                        <button
                            onClick={() => setActiveTab('records')}
                            className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
                        >
                            <FileText size={16} />
                            Medical Records
                        </button>
                    </nav>
                </div>

                {activeTab === 'appointments' && (
                    <div className="tab-content">
                        <h3 className="section-title">Your Appointments</h3>
                        {appointments.length === 0 ? (
                            <p className="no-data">No appointments found.</p>
                        ) : (
                            appointments.map(appt => (
                                <div key={appt.id} className="card appointment-card">
                                    <div>
                                        <p className="doctor-name">Dr. {appt.doctor_name}</p>
                                        <p className="doctor-spec">{appt.specialization}</p>
                                        <div className="appt-time">
                                            <span>{new Date(appt.date).toLocaleDateString()}</span>
                                            <span>{appt.time.substring(0, 5)}</span>
                                        </div>
                                    </div>
                                    <span className={`status-badge status-${appt.status}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'records' && (
                    <div className="tab-content">
                        <h3 className="section-title">Medical History</h3>
                        {records.length === 0 ? (
                            <p className="no-data">No medical records found.</p>
                        ) : (
                            records.map(rec => (
                                <div key={rec.id} className="card">
                                    <div className="record-header">
                                        <span className="doctor-name">Dr. {rec.doctor_name || 'Legacy'}</span>
                                        <span className="date">{new Date(rec.visit_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="record-body">
                                        <div className="record-section">
                                            <span className="record-label">Diagnosis</span>
                                            <p>{rec.diagnosis}</p>
                                        </div>
                                        <div className="record-section">
                                            <span className="record-label">Prescription</span>
                                            <p>{rec.prescription}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar / Quick Actions */}
            <div className="dashboard-sidebar">
                <div className="card sticky-sidebar">
                    <h3 className="section-title">
                        <Plus size={20} className="icon-primary" />
                        Book Appointment
                    </h3>
                    <form onSubmit={handleBookAppointment}>
                        {bookingStatus === 'booked' && <div className="alert-success">Booked successfully!</div>}
                        {bookingStatus === 'error' && <div className="alert-error">Booking failed.</div>}

                        <div className="form-group">
                            <label className="form-label">Select Doctor</label>
                            <select
                                className="input-field"
                                value={bookingData.doctor_id}
                                onChange={(e) => setBookingData({ ...bookingData, doctor_id: e.target.value })}
                                required
                            >
                                <option value="">Choose a doctor</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialization})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={bookingData.date}
                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Time</label>
                            <input
                                type="time"
                                className="input-field"
                                value={bookingData.time}
                                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reason / Notes</label>
                            <textarea
                                className="input-field"
                                rows="2"
                                value={bookingData.notes}
                                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full">Book Now</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
