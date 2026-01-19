import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { userService } from '../services/user.service';
import { EVENT_CATEGORIES } from '../utils/constants';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';
import PrivateRoute from '../components/common/PrivateRoute';
import LayoutContainer from '../components/common/LayoutContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  
  const data = watch();

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('bio', user.bio || '');
      setValue('location', user.location || '');
      setValue('interests', user.interests || []);
      setAvatarPreview(user.profile_pic);
      setLoading(false);
    }
  }, [user, setValue]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);

    try {
      const profileData = {
        name: data.name,
        bio: data.bio,
        location: data.location,
        interests: data.interests || [],
      };

      const response = await userService.updateProfile(profileData);
      updateUser(response.data.user);

      if (avatarFile) {
        const avatarResponse = await userService.uploadAvatar(avatarFile);
        updateUser(avatarResponse.data.user);
      }

      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#f7f7f7]">
        <LayoutContainer>
          <div className="pt-6 pb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>

            <Card className="p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && <ErrorMessage message={error} />}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={avatarPreview || '/default-avatar.png'}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      })}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      {...register('bio', {
                        maxLength: { value: 500, message: 'Bio must be less than 500 characters' },
                      })}
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {data?.bio?.length || 0}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      {...register('location')}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="City, State (e.g., Seattle, WA)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interests
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                      Select your interests (hold Ctrl/Cmd to select multiple)
                    </p>
                    <select
                      {...register('interests')}
                      multiple
                      size="6"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {EVENT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Selected interests will help us recommend relevant events
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    isLoading={submitting}
                    fullWidth
                    className="sm:flex-1 sm:w-auto"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/profile/${user._id}`)}
                    fullWidth
                    className="sm:flex-1 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </LayoutContainer>
      </div>
    </PrivateRoute>
  );
};

export default EditProfile;
