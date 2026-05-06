import { SubmitEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { signInWithOAuth, supabase } from "@/lib/auth/supabase-browser";
import { Button, Card, Input } from "@heroui/react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FieldErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [oauthPending, setOauthPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

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
    if (errors.password || errors.form) {
      setErrors((current) => ({
        ...current,
        password: undefined,
        form: undefined,
      }));
    }
  };

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "email") {
          nextErrors.email = issue.message;
        }
        if (issue.path[0] === "password") {
          nextErrors.password = issue.message;
        }
      }
      setErrors(nextErrors);
      setPending(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
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
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">
            The 3749 App
          </p>
          <Card.Title className="text-2xl">Sign in to The 3749 App</Card.Title>
          <Card.Description>Access is restricted to verified team members.</Card.Description>
        </Card.Header>

        <Card.Content>
          <form className="space-y-5" noValidate onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Button
                className="w-full"
                onPress={() => void handleOAuth("google")}
                type="button"
                variant="secondary"
              >
                Sign in with Google
              </Button>
              <div className="h-px w-full bg-separator/80" />
            </div>

            <div className="space-y-4">
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
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-foreground" htmlFor="password">
                    Password
                  </label>
                  <span className="text-xs text-muted">Minimum 6 characters</span>
                </div>
                <Input
                  id="password"
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                  fullWidth
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  variant="secondary"
                />
                {errors.password ? <p className="text-xs text-danger">{errors.password}</p> : null}
              </div>

              <Button
                className="w-full"
                isDisabled={pending || oauthPending}
                type="submit"
                variant="secondary"
              >
                {pending ? "Signing in..." : "Sign in"}
              </Button>

              {errors.form ? (
                <p className="text-center text-xs text-danger">{errors.form}</p>
              ) : null}

              <p className="text-center text-xs text-muted">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-medium text-accent hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card.Content>
      </Card>
    </main>
  );
}
