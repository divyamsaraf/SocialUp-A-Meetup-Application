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
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { borderRadius } from '../theme';
import { inputs } from '../theme';

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

      // Navigate to profile using username (required field)
      navigate(`/profile/${user.username}`);
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
      <div 
        className="min-h-screen"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <LayoutContainer>
          <div 
            style={{
              paddingTop: spacing[6],
              paddingBottom: spacing[8],
            }}
          >
            <h1 
              style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing[6],
              }}
            >
              Edit Profile
            </h1>

            <Card style={{ padding: spacing[6] }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && <ErrorMessage message={error} />}

                <div className="space-y-4">
                  <div>
                    <label 
                      className="block mb-2"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Profile Picture
                    </label>
                    <div className="flex items-center" style={{ gap: spacing[4] }}>
                      <img
                        src={avatarPreview || '/default-avatar.png'}
                        alt="Avatar preview"
                        className="rounded-full object-cover"
                        style={{
                          width: '5rem',
                          height: '5rem',
                          border: `2px solid ${colors.border.default}`,
                        }}
                      />
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="cursor-pointer"
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                          }}
                        />
                        <p 
                          className="mt-1"
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.text.tertiary,
                          }}
                        >
                          JPG, PNG or GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Name <span style={{ color: colors.error[500] }}>*</span>
                    </label>
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      })}
                      type="text"
                      className="w-full focus:outline-none focus:ring-2"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.lg,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Bio
                    </label>
                    <textarea
                      {...register('bio', {
                        maxLength: { value: 500, message: 'Bio must be less than 500 characters' },
                      })}
                      rows="4"
                      className="w-full focus:outline-none focus:ring-2 resize-none"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.lg,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p 
                        className="mt-1"
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.error[600],
                        }}
                      >
                        {errors.bio.message}
                      </p>
                    )}
                    <p 
                      className="mt-1"
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.tertiary,
                      }}
                    >
                      {data?.bio?.length || 0}/500 characters
                    </p>
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Location
                    </label>
                    <input
                      {...register('location')}
                      type="text"
                      className="w-full focus:outline-none focus:ring-2"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.lg,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="City, State (e.g., Seattle, WA)"
                    />
                  </div>

                  <div>
                    <label 
                      className="block mb-1"
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.text.secondary,
                      }}
                    >
                      Interests
                    </label>
                    <p 
                      className="mb-2"
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.text.tertiary,
                      }}
                    >
                      Select your interests (hold Ctrl/Cmd to select multiple)
                    </p>
                    <select
                      {...register('interests')}
                      multiple
                      size="6"
                      className="w-full focus:outline-none focus:ring-2"
                      style={{
                        ...inputs.base,
                        ...inputs.size.md,
                        ...inputs.state.default,
                        borderRadius: borderRadius.lg,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${colors.border.focus}`;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${colors.border.default}`;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {EVENT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <p 
                      className="mt-1"
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.text.tertiary,
                      }}
                    >
                      Selected interests will help us recommend relevant events
                    </p>
                  </div>
                </div>

                <div 
                  className="flex flex-col sm:flex-row"
                  style={{
                    marginTop: spacing[6],
                    gap: spacing[3],
                  }}
                >
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
                    onClick={() => navigate(`/profile/${user.username}`)}
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
