import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CalendarDays, CheckSquare, Layers3, Sparkles, Shield, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LandingPage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Organize and access all your team documents in one centralized workspace.',
      color: 'bg-primary',
    },
    {
      icon: CalendarDays,
      title: 'Meeting Scheduling',
      description: 'Schedule and manage meetings with integrated calendar functionality.',
      color: 'bg-accent',
    },
    {
      icon: CheckSquare,
      title: 'Action Items',
      description: 'Track tasks and action items with clear ownership and deadlines.',
      color: 'bg-primary',
    },
    {
      icon: Layers3,
      title: 'Knowledge Base',
      description: 'Build and maintain a comprehensive knowledge base for your team.',
      color: 'bg-accent',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Increased Productivity',
      description: 'Reduce time spent searching for information and focus on what matters.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to protect your team\'s data and privacy.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Leverage AI to extract insights and automate repetitive tasks.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                R
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">RicozAssist</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="secondary" size="md">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="md">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
                New: AI-powered workspace
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Everything your team needs,
                <span className="block text-primary">in one focused workspace.</span>
              </h1>
              <p className="mt-6 text-lg text-foreground-secondary sm:text-xl">
                Bring documents, meetings, action items and team knowledge together in one organized workspace.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/Images/ricoz-hero-image.png"
                alt="RicozAssist workspace illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="px-4 py-20 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: "url('/Images/ricoz-features-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Everything you need to collaborate effectively
            </h2>
            <p className="mt-4 text-lg text-[#4b5563]">
              Powerful features designed to help your team work better together.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:border-primary/30 shadow-[0_4px_14px_rgba(17,24,39,0.07)]">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} shadow-sm`}>
                    <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#111827]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#4b5563]">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple to get started
            </h2>
            <p className="mt-4 text-lg text-foreground-secondary">
              Get your team up and running in minutes.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              { step: '01', title: 'Create your workspace', description: 'Sign up and create your team workspace in seconds.' },
              { step: '02', title: 'Invite your team', description: 'Add team members and set up permissions.' },
              { step: '03', title: 'Start collaborating', description: 'Upload documents, schedule meetings, and assign tasks.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-primary/20">{item.step}</div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-foreground-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why teams choose RicozAssist
              </h2>
              <p className="mt-4 text-lg text-foreground-secondary">
                Built for modern teams who need a better way to work together.
              </p>
              <div className="mt-10 space-y-8">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                        <p className="mt-1 text-foreground-secondary">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <Card className="border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                      R
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">RicozAssist</p>
                      <p className="text-sm text-foreground-muted">Your team's workspace</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">Documents</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">24</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium text-foreground">Meetings</span>
                      </div>
                      <span className="text-sm font-semibold text-accent">8</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">Action Items</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">12</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-primary">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform how your team works?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join thousands of teams already using RicozAssist to collaborate more effectively.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                R
              </span>
              <span className="text-sm font-semibold text-foreground">RicozAssist</span>
            </div>
            <p className="text-sm text-foreground-muted">
              © {new Date().getFullYear()} RicozAssist. A clearer way to work together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
