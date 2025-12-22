import React, { useState } from 'react';
import { registerUser } from '../../api/userApi';
import { registerVendor } from '../../api/vendorApi';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [role, setRole] = useState(''); // No default role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    description: '',
    address: {
      ward: '',
      street: '',
      municipality: '',
      district: '',
      province: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setError('Please select a role.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (role === 'user') {
        await registerUser({ ...formData, role });
      } else if (role === 'vendor') {
        const payload = {
          storeName: formData.storeName,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };
        await registerVendor(payload);
      }

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Role Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Role:</label>
          <select value={role} onChange={handleRoleChange} style={styles.input}>
            <option value="" disabled>Select Role</option>
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        {/* User Fields */}
        {role === 'user' && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <h4 style={styles.subHeading}>Address</h4>
            {['ward', 'street', 'municipality', 'district', 'province', 'country'].map(field => (
              <div key={field} style={styles.formGroup}>
                <label style={styles.label}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type="text"
                  name={`address.${field}`}
                  value={formData.address[field]}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
            ))}
          </>
        )}

        {/* Vendor Fields */}
        {role === 'vendor' && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Store Name:</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{ ...styles.input, height: '60px' }}
              />
            </div>
          </>
        )}

        {/* Common Fields */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

     <div style={styles.loginContainer}>
  <p style={{ fontSize: '14px', color: '#555' }}>
    Already have an account?{' '}
    <span
      onClick={() => navigate('/login')}
      style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
    >
      Login
    </span>
  </p>
</div>

    </div>
  );
};

export default RegisterPage;

// ---------------- Inline CSS ----------------
const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  title: { textAlign: 'center', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column' },
  formGroup: { marginBottom: '15px' },
  label: { marginBottom: '5px', display: 'block', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #aaa' },
  subHeading: { marginTop: '20px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' },
  button: { padding: '10px', backgroundColor: '#007BFF', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', marginBottom: '15px' },
  loginContainer: { marginTop: '20px', textAlign: 'center' },
  loginButton: { marginTop: '5px', padding: '8px 12px', backgroundColor: '#28a745', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }
};
