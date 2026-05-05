import { SubmitEvent, SubmitEventHandler, Suspense, lazy, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/auth/supabase-browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FieldGroup,
  Field,
  FieldSeparator,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
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

const OAuthButtons = lazy(async () => ({
  default: OAuthButtonsContent,
}));

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
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

    navigate({ to: "/dashboard" });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <LoginForm
        email={email}
        password={password}
        pending={pending}
        errors={errors}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

function LoginForm({
  email,
  password,
  pending,
  errors,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & {
  email: string;
  password: string;
  pending: boolean;
  errors: FieldErrors;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}) {
  return (
    <Card
      className="flex w-full max-w-md flex-col gap-6 border-none bg-transparent p-6 sm:border sm:bg-card sm:p-8"
      {...props}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Sign in to continue to the 3749 dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FieldGroup>
            <Field>
              <Suspense fallback={<OAuthButtonsFallback />}>
                <OAuthButtons />
              </Suspense>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or sign in with email
            </FieldSeparator>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  value={email}
                  aria-invalid={!!errors.email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  required
                />
                <FieldError>{errors.email}</FieldError>
              </FieldContent>
            </Field>
            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <span className="text-xs text-muted-foreground">Minimum 6 characters</span>
              </div>
              <FieldContent>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={!!errors.password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  required
                />
                <FieldError>{errors.password}</FieldError>
              </FieldContent>
            </Field>
            <Field data-invalid={!!errors.form}>
              <Button type="submit" disabled={pending} aria-busy={pending}>
                {pending ? "Signing in..." : "Sign in"}
              </Button>
              <FieldError className="text-center">{errors.form}</FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

function OAuthButtonsContent() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button variant="outline" type="button" className="w-full gap-2">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        <span>Google</span>
      </Button>
      <Button variant="outline" type="button" className="w-full gap-2">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
          <path
            d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
            fill="currentColor"
          />
        </svg>
        <span>Discord</span>
      </Button>
    </div>
  );
}

function OAuthButtonsFallback() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="h-9 w-full rounded-md border border-input bg-muted/30 animate-pulse" />
      <div className="h-9 w-full rounded-md border border-input bg-muted/30 animate-pulse" />
    </div>
  );
}
