import { UserData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { ApproveButton, DeleteButton } from "@/app/(main)/admin/ApproveButton";


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
                    @{user.username}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </Link>
              <ApproveButton userId={user.id}/>
              <DeleteButton userId={user.id}/>
            </div>
        </div>
  );
}