import { Discord } from "@/assets/Discord";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthServer } from "@/lib/supabase/useAuthServer";
import { Twitch } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

const Authenticator = ({ className }: { className?: string }) => {
  const { loading, onProviderLogin, handleLogin } = useAuthServer();
  const [email, setEmail] = useState("");

  return (
    <Card className={cn("w-[400px]", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign in to save your configs in the cloud and share with friends
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" onClick={onProviderLogin("discord")}>
            <Discord className="mr-2 h-4 w-4 fill-white" />
            Discord
          </Button>
          <Button variant="outline" onClick={onProviderLogin("twitch")}>
            <Twitch className="mr-2 h-4 w-4" />
            Twitch
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => {
              e.preventDefault();
              setEmail(e.target.value);
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={(e) => handleLogin(e, email)}
          type="submit"
        >
          {loading ? "Loading..." : "Send magic link"}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default Authenticator;
