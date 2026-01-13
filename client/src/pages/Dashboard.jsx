import { useAuth } from '../context/AuthContext';
import PatientDashboard from '../components/PatientDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    Welcome back, {user.name}
                </h1>
                <p className="dashboard-subtitle">
                    {user.role === 'patient' ? 'Manage your health and appointments' : 'Manage your schedule and patients'}
                </p>
            </div>

            {user.role === 'patient' && <PatientDashboard />}
            {user.role === 'doctor' && <DoctorDashboard />}
            {user.role === 'admin' && <div>Admin Dashboard (Coming Soon)</div>}
        </div>
    );
}
