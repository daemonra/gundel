import avatarPlaceholder from "@/assets/cover.jpeg";
import { UserData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";

interface UserProps {
  user: UserData;
}

export default function UserFeed({ user }: UserProps) {
  return (
        <div key={user.id} className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
              >
                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
              <Button>Approve</Button>
            </div>
        </div>
  );
}