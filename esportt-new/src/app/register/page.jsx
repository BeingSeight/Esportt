// src/app/register/page.jsx
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Import the beautiful components we just added!
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('Rookie'); // Default value for the select component
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // This core logic remains exactly the same. We are only changing the UI.
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseId: firebaseUser.uid,
          email: firebaseUser.email,
          experienceLevel: experience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile.');
      }

      router.push('/home'); // Redirect to the new home page

    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your EsportTT account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="player@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="experience-level">Experience Level</Label>
              {/* Note: The ShadCN Select component is more complex than a standard select */}
              <Select onValueChange={setExperience} defaultValue={experience}>
                <SelectTrigger id="experience-level">
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rookie">Rookie</SelectItem>
                  <SelectItem value="Contender">Contender</SelectItem>
                  <SelectItem value="Champion">Champion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}