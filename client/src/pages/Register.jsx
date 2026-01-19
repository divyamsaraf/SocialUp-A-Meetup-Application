import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../components/common/ErrorMessage';
import LayoutContainer from '../components/common/LayoutContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { borderRadius } from '../theme';
import { inputs } from '../theme';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: colors.background.secondary,
        paddingTop: spacing[12],
        paddingBottom: spacing[12],
        paddingLeft: spacing[4],
        paddingRight: spacing[4],
      }}
    >
      <LayoutContainer>
        <div className="max-w-md w-full mx-auto">
          <Card className="p-6 sm:p-8">
            <div style={{ marginBottom: spacing[6] }}>
              <h2 
                className="text-center mb-2"
                style={{
                  fontSize: typography.fontSize['3xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                }}
              >
                Create your account
              </h2>
              <p 
                className="text-center"
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                }}
              >
                Or{' '}
                <Link
                  to="/login"
                  className="font-medium focus:outline-none focus:underline transition-colors"
                  style={{
                    color: colors.primary[600],
                  }}
                  onMouseEnter={(e) => e.target.style.color = colors.primary[700]}
                  onMouseLeave={(e) => e.target.style.color = colors.primary[600]}
                  aria-label="Sign in to your existing account"
                >
                  sign in to your existing account
                </Link>
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {error && <ErrorMessage message={error} />}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Your full name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="you@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="At least 6 characters"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && (
                    <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Confirm your password"
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  {errors.confirmPassword && (
                    <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ paddingTop: spacing[2] }}>
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                  fullWidth
                  className="w-full"
                >
                  Create account
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </LayoutContainer>
    </div>
  );
};

export default Register;
