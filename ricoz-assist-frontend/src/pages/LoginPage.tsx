import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import AuthLayout from '../components/layout/AuthLayout';
import { loginSchema } from '../utils/validation';
import { ArrowRight, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useUIStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      addToast({ type: 'success', message: 'Login successful' });
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast({ type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-intro">
        <p className="auth-kicker">Welcome back</p>
        <h2 className="auth-heading">Sign in to your workspace</h2>
        <p className="auth-description">
          Pick up where your team left off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          id="username"
          label="Username"
          icon={<User className="h-5 w-5" />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          placeholder="Enter your username"
          disabled={isLoading}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          icon={<Lock className="h-5 w-5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          disabled={isLoading}
        />

        <button 
          type="submit" 
          className="auth-submit w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : <>Sign in <ArrowRight size={18} aria-hidden="true" /></>}
        </button>
      </form>

      <p className="auth-switch">
        Don’t have an account?{' '}
        <Link to="/register" className="auth-link">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
