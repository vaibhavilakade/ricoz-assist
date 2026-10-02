import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AuthLayout from '../components/layout/AuthLayout';
import { loginSchema } from '../utils/validation';

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
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Welcome back</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">Sign in to your account</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">Enter your details to continue to your workspace.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="username"
          label="Username"
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          disabled={isLoading}
        />

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        Don’t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
