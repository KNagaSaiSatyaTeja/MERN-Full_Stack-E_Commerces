"use client";

import Landing from "@/components/Landing/Landing";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Landing isLoggedIn={!!user} userName={user?.name || ""} />
    </main>
  );
}
