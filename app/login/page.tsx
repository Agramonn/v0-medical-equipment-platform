import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">B</span>
          </div>
          <h1 className="text-xl font-semibold">BioSupp</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your biomedical equipment
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}