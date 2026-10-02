import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AuthLayout from '../components/layout/AuthLayout';
import { registerSchema } from '../utils/validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
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
      const { authService } = await import('../services/authService');
      await authService.register(formData);
      addToast({ type: 'success', message: 'Registration successful. Please login.' });
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      addToast({ type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Get started</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">Create your account</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">Set up your RicozAssist workspace access.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Choose a username"
          disabled={isLoading}
        />

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="your@email.com"
          disabled={isLoading}
        />

        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="At least 8 characters"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            label="First name"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            disabled={isLoading}
          />

          <Input
            id="lastName"
            name="lastName"
            label="Last name"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
