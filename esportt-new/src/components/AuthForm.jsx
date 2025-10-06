// src/components/AuthForm.jsx
'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Toaster, toast } from "sonner";
import { cn } from "../lib/utils"; // Relative path
import { auth } from "../lib/firebase"; // Relative path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Simplified steps for our registration
const registerSteps = [
  { id: "account", title: "Account" },
  { id: "details", title: "Details" },
];

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export function MultiStepRegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    experienceLevel: "Bronze Tier", // Default experience
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < registerSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // This is the combined Firebase + MongoDB logic
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      // 2. Call our API route to save the user in MongoDB
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseId: firebaseUser.uid,
          email: formData.email,
          name: formData.name, // Pass the name
          experienceLevel: formData.experienceLevel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile to database.");
      }

      toast.success("Account created successfully!");
      router.push('/home');

    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.name.trim() !== "" && formData.email.trim() !== "";
    }
    return true; // No validation for password step, just submission
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <Toaster richColors />
      {/* Progress Indicator */}
      <div className="flex justify-between mb-2">
        {registerSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={cn( "w-4 h-4 rounded-full transition-colors duration-300",
              index < currentStep ? "bg-primary" : index === currentStep ? "bg-primary ring-4 ring-primary/20" : "bg-muted" )} />
            <span className={cn( "text-xs mt-1.5 hidden sm:block", index === currentStep ? "text-primary font-medium" : "text-muted-foreground" )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2 mb-8">
        <motion.div className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (registerSteps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }} />
      </div>

      {/* Form Card */}
      <Card className="border shadow-md rounded-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial="hidden" animate="visible" exit="exit" variants={contentVariants}>
            {/* Step 1: Name and Email */}
            {currentStep === 0 && (
              <>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <CardDescription>Let's start with your basic information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} />
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Password and Experience */}
            {currentStep === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Secure Your Account</CardTitle>
                  <CardDescription>Create a password and tell us your experience level.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={(e) => updateFormData("password", e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="experience-level">Your Experience Level</Label>
                      <Select onValueChange={(value) => updateFormData("experienceLevel", value)} defaultValue={formData.experienceLevel}>
                        <SelectTrigger id="experience-level"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bronze Tier">Bronze Tier</SelectItem>
                          <SelectItem value="Silver Tier">Silver Tier</SelectItem>
                          <SelectItem value="Gold Tier">Gold Tier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                </CardContent>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <CardFooter className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button type="button" onClick={currentStep === registerSteps.length - 1 ? handleSubmit : nextStep} disabled={!isStepValid() || isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> :
             currentStep === registerSteps.length - 1 ? <>Submit <Check className="h-4 w-4 ml-2" /></> :
             <>Next <ChevronRight className="h-4 w-4 ml-2" /></>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}