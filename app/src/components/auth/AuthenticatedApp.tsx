"use client";

import { useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export default function AuthenticatedApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    if (isAuthenticated && user) {
      getOrCreateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? "",
      });
    }
  }, [isAuthenticated, user, getOrCreateUser]);

  return <>{children}</>;
}
