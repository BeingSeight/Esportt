// src/app/register/page.jsx
import { MultiStepRegisterForm } from '../../components/AuthForm'; // Relative path
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <MultiStepRegisterForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline">Log In</Link>
      </p>
    </div>
  );
}