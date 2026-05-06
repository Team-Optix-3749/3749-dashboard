"use server";

import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { signInWithOAuth, supabase } from "@/lib/auth/utils";

import { motion, AnimatePresence } from "motion/react";
import { Button, Card, Tabs, TextField, Input, Separator, Spinner } from "@heroui/react";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

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

export function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [oauthPending, setOauthPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSignup = tab === "signup";

  function switchTab(key: string) {
    setTab(key as "login" | "signup");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});

    if (isSignup) {
      const result = signupSchema.safeParse({ name, email, password, confirmPassword });
      if (!result.success) {
        const nextErrors: FieldErrors = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof FieldErrors;
          if (!nextErrors[field]) nextErrors[field] = issue.message;
        }
        setErrors(nextErrors);
        setPending(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      setPending(false);

      if (signUpError) {
        setErrors({ form: signUpError.message });
        return;
      }

      navigate({ to: "/dashboard" });
      return;
    }

    // Login flow
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border border-border shadow-lg bg-field">
          <Card.Header className="flex flex-col gap-1 pt-6 pb-0 px-6">
            <Card.Title className="text-xl font-semibold text-center">
              {isSignup ? "Create Account" : "Welcome Back"}
            </Card.Title>
            <Card.Description className="text-center text-sm">
              {isSignup
                ? "Join the pit crew and start scouting."
                : "Sign in to access your dashboard."}
            </Card.Description>
          </Card.Header>

          <Card.Content className="px-6 pb-2 pt-4">
            <Tabs
              selectedKey={tab}
              onSelectionChange={(key) => switchTab(key as string)}
              className="mb-6"
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label="Auth mode" className="w-full">
                  <Tabs.Tab id="login" className="flex-1 justify-center">
                    Login
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="signup" className="flex-1 justify-center">
                    Sign Up
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === "login" ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Form error banner */}
                  {errors.form && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2 border border-danger"
                    >
                      {errors.form}
                    </motion.div>
                  )}

                  {/* Name field (signup only) */}
                  {isSignup && (
                    <TextField
                      isRequired
                      value={name}
                      onChange={(v) => setName(v as string)}
                      isInvalid={!!errors.name}
                    >
                      <Input variant="secondary" placeholder="John Scout" autoComplete="name" />
                    </TextField>
                  )}

                  {/* Email */}
                  <TextField
                    isRequired
                    type="email"
                    value={email}
                    onChange={(v) => setEmail(v as string)}
                    isInvalid={!!errors.email}
                  >
                    <Input
                      variant="secondary"
                      placeholder="you@team3749.com"
                      autoComplete="email"
                    />
                  </TextField>

                  {/* Password */}
                  <TextField
                    isRequired
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(v) => setPassword(v as string)}
                    isInvalid={!!errors.password}
                  >
                    <Input
                      variant="secondary"
                      placeholder={isSignup ? "Min. 6 characters" : "Enter your password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                    />
                  </TextField>

                  {/* Confirm Password (signup only) */}
                  {isSignup && (
                    <TextField
                      isRequired
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(v) => setConfirmPassword(v as string)}
                      isInvalid={!!errors.confirmPassword}
                    >
                      <Input
                        variant="secondary"
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                    </TextField>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    isDisabled={pending}
                    className="w-full mt-2 text-white font-semibold"
                    size="lg"
                  >
                    {pending ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" className="text-white" />
                        {isSignup ? "Creating account..." : "Signing in..."}
                      </span>
                    ) : isSignup ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <Separator className="flex-1" />
              <span className="text-xs text-muted uppercase tracking-wider">or continue with</span>
              <Separator className="flex-1" />
            </div>

            {/* OAuth Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                isDisabled={oauthPending}
                onPress={() => handleOAuth("google")}
                className="flex-1"
                size="lg"
              >
                {oauthPending ? (
                  <Spinner size="sm" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="ml-2">Google</span>
              </Button>
              <Button
                variant="outline"
                isDisabled={oauthPending}
                onPress={() => handleOAuth("discord")}
                className="flex-1"
                size="lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span className="ml-2">Discord</span>
              </Button>
            </div>
          </Card.Content>

          <Card.Footer className="flex justify-center pb-6 pt-2 px-6">
            <p className="text-xs text-muted text-center">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="text-accent hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className="text-accent hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </Card.Footer>
        </Card>
      </motion.div>
    </div>
  );
}
