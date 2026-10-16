import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import AuthLayout from '../components/layout/AuthLayout';
import { registerSchema } from '../utils/validation';
import { ArrowRight, Lock, Mail, User, UserCircle } from 'lucide-react';

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
      <div className="auth-intro">
        <p className="auth-kicker">Get started</p>
        <h2 className="auth-heading">Create your account</h2>
        <p className="auth-description">
          Set up your RicozAssist workspace and start collaborating with your team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form auth-register-form">
        <Input
          id="username"
          name="username"
          label="Username"
          icon={<User className="h-5 w-5" />}
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
          icon={<Mail className="h-5 w-5" />}
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
          icon={<Lock className="h-5 w-5" />}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="At least 8 characters"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            label="First name"
            icon={<UserCircle className="h-5 w-5" />}
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            disabled={isLoading}
          />

          <Input
            id="lastName"
            name="lastName"
            label="Last name"
            icon={<UserCircle className="h-5 w-5" />}
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : <>Create account <ArrowRight size={18} aria-hidden="true" /></>}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
