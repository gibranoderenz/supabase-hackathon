import { logout } from "@/app/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { validateRequest } from "@/lib/auth";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export const Navbar = async () => {
  const { user, session } = await validateRequest();

  const _logout = logout.bind(null, session?.id ?? "");

  return (
    <nav className="px-8 py-4 flex items-center justify-between">
      <Link href="/">
        <span className="text-xl">cook together</span>
      </Link>
      {!!user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span>{user.name.split(" ")[0]}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <form action={_logout}>
              <button type="submit" className="text-red-700">
                Logout
              </button>
            </form>
          </PopoverContent>
        </Popover>
      ) : (
        <Link href={"/api/auth/google"}>
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  );
};
