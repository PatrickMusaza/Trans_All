import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.email || "U")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end" side="top">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
