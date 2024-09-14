import { validateRequest } from "@/auth";

export default async function Page({ params: { albumId } }: PageProps) {
    const { user } = await validateRequest();
  
    if (!user) {
      return (
        <p className="text-destructive">
          You&apos;re not authorized to view this page.
        </p>
      );
    }

    return (
        <div>
            Hello there Mate!
        </div>
    )
}