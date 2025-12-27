import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, deleteUserProfile, logoutUser } from '../../api/userApi';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      ward: '',
      street: '',
      municipality: '',
      district: '',
      province: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setProfile({
        ...profile,
        address: { ...profile.address, [key]: value }
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateUserProfile(profile);
      setProfile(updated);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Update failed.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await deleteUserProfile();
        setMessage('Profile deleted successfully!');
        logoutUser();
        window.location.href = '/login';
      } catch (error) {
        console.error(error);
        setMessage('Failed to delete profile.');
      }
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">User Profile</h2>

      {message && <p className="mb-4 text-green-600 text-center font-medium">{message}</p>}

      {/* Personal Info */}
      <div className="space-y-4">
        {['name', 'email', 'phone'].map((field) => (
          <label key={field} className="block">
            <span className="text-gray-700 font-medium capitalize">{field}:</span>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={profile[field]}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>
        ))}
      </div>

      {/* Address Info */}
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800 border-b pb-2">Address</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['ward','street','municipality','district','province','country'].map((field) => (
          <label key={field} className="block">
            <span className="text-gray-700 font-medium capitalize">{field}:</span>
            <input
              type="text"
              name={`address.${field}`}
              value={profile.address[field] || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Update Profile
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
