import { SubmitEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { signInWithOAuth, supabase } from "@/lib/auth/supabase-browser";
import { Button, Card, Input } from "@heroui/react";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(2, "Enter your name."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [oauthPending, setOauthPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name || errors.form) {
      setErrors((current) => ({
        ...current,
        name: undefined,
        form: undefined,
      }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email || errors.form) {
      setErrors((current) => ({
        ...current,
        email: undefined,
        form: undefined,
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password || errors.confirmPassword || errors.form) {
      setErrors((current) => ({
        ...current,
        password: undefined,
        confirmPassword: undefined,
        form: undefined,
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword || errors.form) {
      setErrors((current) => ({
        ...current,
        confirmPassword: undefined,
        form: undefined,
      }));
    }
  };

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "name") {
          nextErrors.name = issue.message;
        }
        if (issue.path[0] === "email") {
          nextErrors.email = issue.message;
        }
        if (issue.path[0] === "password") {
          nextErrors.password = issue.message;
        }
        if (issue.path[0] === "confirmPassword") {
          nextErrors.confirmPassword = issue.message;
        }
      }
      setErrors(nextErrors);
      setPending(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setPending(false);

    if (authError) {
      setErrors({ form: authError.message });
      return;
    }

    navigate({ to: "/" });
  }

  async function handleOAuth(provider: "google" | "discord") {
    setOauthPending(true);
    setErrors({});

    const { error } = await signInWithOAuth(provider, `${window.location.origin}/dashboard`);

    setOauthPending(false);

    if (error) {
      setErrors({ form: error.message });
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-separator/80 bg-surface/90 p-8 shadow-none">
        <Card.Header className="gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">The 3749 App</p>
          <Card.Title className="text-2xl">Create an account</Card.Title>
          <Card.Description>Join the 3749 dashboard to get started.</Card.Description>
        </Card.Header>

        <Card.Content>
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Button className="w-full" onPress={() => void handleOAuth("google")} type="button" variant="secondary">
                Sign up with Google
              </Button>
              <div className="h-px w-full bg-separator/80" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  aria-invalid={!!errors.name}
                  autoComplete="name"
                  fullWidth
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Sam Driver"
                  type="text"
                  value={name}
                  variant="secondary"
                />
                {errors.name ? <p className="text-xs text-danger">{errors.name}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  fullWidth
                  onChange={(event) => handleEmailChange(event.target.value)}
                  placeholder="m@example.com"
                  type="email"
                  value={email}
                  variant="secondary"
                />
                {errors.email ? <p className="text-xs text-danger">{errors.email}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  aria-invalid={!!errors.password}
                  autoComplete="new-password"
                  fullWidth
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  variant="secondary"
                />
                {errors.password ? <p className="text-xs text-danger">{errors.password}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  aria-invalid={!!errors.confirmPassword}
                  autoComplete="new-password"
                  fullWidth
                  onChange={(event) => handleConfirmPasswordChange(event.target.value)}
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  variant="secondary"
                />
                {errors.confirmPassword ? <p className="text-xs text-danger">{errors.confirmPassword}</p> : null}
              </div>

              <Button className="w-full" isDisabled={pending || oauthPending} type="submit" variant="secondary">
                {pending ? "Creating account..." : "Sign up"}
              </Button>

              {errors.form ? <p className="text-center text-xs text-danger">{errors.form}</p> : null}

              <p className="text-center text-xs text-muted">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-accent hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card.Content>
      </Card>
    </main>
  );
}
