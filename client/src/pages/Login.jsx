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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
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
                Sign in to SocialUp
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
                  to="/register"
                  className="font-medium focus:outline-none focus:underline transition-colors"
                  style={{
                    color: colors.primary[600],
                  }}
                  onMouseEnter={(e) => e.target.style.color = colors.primary[700]}
                  onMouseLeave={(e) => e.target.style.color = colors.primary[600]}
                  aria-label="Create a new account"
                >
                  create a new account
                </Link>
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {error && <ErrorMessage message={error} />}
              
              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block mb-1"
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.text.secondary,
                    }}
                  >
                    Email address
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
                    placeholder="you@example.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p 
                      id="email-error" 
                      className="mt-1" 
                      role="alert"
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.error[600],
                      }}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label 
                    htmlFor="password" 
                    className="block mb-1"
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.text.secondary,
                    }}
                  >
                    Password
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
                    autoComplete="current-password"
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
                    placeholder="Enter your password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && (
                    <p 
                      id="password-error" 
                      className="mt-1" 
                      role="alert"
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.error[600],
                      }}
                    >
                      {errors.password.message}
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
                  Sign in
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </LayoutContainer>
    </div>
  );
};

export default Login;
