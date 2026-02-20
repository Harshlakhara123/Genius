import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
  const { isLoaded, user } = useUser();

  // Wait until Clerk has loaded
  if (!isLoaded || !user) return null;

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
      <AvatarFallback>
        {user.firstName?.charAt(0)}
        {user.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};