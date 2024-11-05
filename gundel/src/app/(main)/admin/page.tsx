import { validateRequest } from "@/auth";
// import FollowButton from "@/components/FollowButton";
// import FollowerCount from "@/components/FollowerCount";
// import TrendsSidebar from "@/components/TrendsSidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { UserData, userDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PendingUsers from "./PendingUsers";
// import UserAlbums from "./UserAlbums";

// interface PageProps {
//   params: { username: string };
// }

// const getUser = cache(async (username: string, loggedInUserId: string) => {
//   const user = await prisma.user.findFirst({
//     where: {
//       username: {
//         equals: username,
//         mode: "insensitive",
//       },
//     },
//     // select: getUserDataSelect(loggedInUserId),
//     select: userDataSelect,
//   });

//   if (!user) notFound();

//   return user;
// });

// export async function generateMetadata({
//   params: { username },
// }: PageProps): Promise<Metadata> {
//   const { user: loggedInUser } = await validateRequest();

//   if (!loggedInUser) return {};

//   const user = await getUser(username, loggedInUser.id);

//   return {
//     title: `${user.displayName} (@${user.username})`,
//   };
// }

// export default async function Page({ params: { username } }: PageProps) {
  export default async function Page() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser || loggedInUser.username != "deaarash") {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  // const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* <UserProfile user={user} loggedInUserId={loggedInUser.id} /> */}
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            Adminstrator&apos;s Dashboard
          </h2>
        </div>
        <PendingUsers/>
      </div>
      {/* <TrendsSidebar /> */}
    </main>
  );
}

// interface UserProfileProps {
//   user: UserData;
//   loggedInUserId: string;
// }

// async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
// //   const followerInfo: FollowerInfo = {
// //     followers: user._count.followers,
// //     isFollowedByUser: user.followers.some(
// //       ({ followerId }) => followerId === loggedInUserId,
// //     ),
// //   };

//   return (
//     <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
//       <UserAvatar
//         avatarUrl={user.avatarUrl}
//         size={250}
//         className="mx-auto size-full max-h-60 max-w-60 rounded-full"
//       />
//       <div className="flex flex-wrap gap-3 sm:flex-nowrap">
//         <div className="me-auto space-y-3">
//           <div>
//             <h1 className="text-3xl font-bold">{user.displayName}</h1>
//             <div className="text-muted-foreground">@{user.username}</div>
//           </div>
//           <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
//           <div className="flex items-center gap-3">
//             <span>
//               albums:{" "}
//               <span className="font-semibold">
//                 {formatNumber(user._count.albums)}
//               </span>
//             </span>
//             {/* <FollowerCount userId={user.id} initialState={followerInfo} /> */}
//           </div>
//         </div>
//         {user.id === loggedInUserId ? (
//           <Button>Edit profile</Button>
//         ) : (<></>)}
//       </div>
//       {user.bio && (
//         <>
//           <hr />
//           <div className="overflow-hidden whitespace-pre-line break-words">
//             {user.bio}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }