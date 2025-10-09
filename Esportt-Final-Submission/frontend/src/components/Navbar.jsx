'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import LinkPreview from "./LinkPreview";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [playerProfile, setPlayerProfile] = useState(null);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/profile?firebaseId=${user.uid}`);
          const data = await res.json();
          if (data.success) {
            setPlayerProfile(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch profile in navbar:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Specify 'left' or 'right' alignment for each item
  const navItems = [
    { name: "Home", href: "/home", previewTitle: "Home Dashboard", previewDescription: "View your personal stats and recommendations.", align: 'left' },
    { name: "Tutorials", href: "/tutorials", previewTitle: "Tutorial Library", previewDescription: "Browse all tutorials to improve your skills.", align: 'left' },
    { name: "Tournaments", href: "/tournaments", previewTitle: "Upcoming Tournaments", previewDescription: "Find and join competitive tournaments.", align: 'right' },
    { name: "Quests", href: "/profile", previewTitle: "Your Profile & Quests", previewDescription: "Check your progress and complete new quests.", align: 'right' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <nav className="relative flex items-center justify-between p-2 px-8 bg-neutral-950 border-b border-white/[0.2]">
      <div>
        <Link href={user ? "/home" : "/"} className="font-bold text-xl text-indigo-400 hover:text-indigo-300 transition-colors">
          EsportTT
        </Link>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        {user ? (
          <>
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <LinkPreview 
                  key={item.href} 
                  title={item.previewTitle} 
                  description={item.previewDescription}
                  align={item.align} // Pass the align prop
                >
                  <Link
                    href={item.href}
                    onClick={() => setActiveTab(item.href)}
                    className={`${
                      activeTab === item.href ? "" : "hover:text-white/60"
                    } relative rounded-full px-3 py-1.5 font-medium text-white outline-sky-400 transition focus-visible:outline-2`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {activeTab === item.href && (
                      <motion.span
                        layoutId="bubble"
                        className="absolute inset-0 z-10 bg-white/[0.2] mix-blend-difference"
                        style={{ borderRadius: 9999 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {item.name}
                  </Link>
                </LinkPreview>
              ))}
            </div>

            {/* ... (Popover code remains the same) ... */}
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8 ring-2 ring-offset-2 ring-offset-neutral-950 ring-sky-400">
                  <AvatarImage src={user.photoURL} alt="Player Avatar" />
                  <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'P'}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-neutral-900 border-neutral-700 text-white">
                <div className="grid gap-4">
                  {/* ... (Popover content is unchanged) ... */}
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Player Profile</h4>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  {playerProfile && (
                     <div className="text-sm">
                        <span className="font-semibold">Experience:</span> {playerProfile.experienceLevel}
                     </div>
                  )}
                  <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            <Link href="/login" className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded-md font-medium text-white">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}