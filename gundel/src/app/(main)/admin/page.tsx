import { validateRequest } from "@/auth";
import { Metadata } from "next";

import PendingUsers from "./PendingUsers";

export async function generateMetadata(): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser || loggedInUser.username != "deaarash") return {};

  return {
    title: `Admin Dashboard`,
  };
}

  export default async function Page() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser || loggedInUser.username != "deaarash") {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }
  
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            Adminstrator&apos;s Dashboard
          </h2>
        </div>
        <PendingUsers/>
      </div>
    </main>
  );
}
