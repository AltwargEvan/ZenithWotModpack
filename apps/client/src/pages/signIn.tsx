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
import { useSession } from "@/lib/supabase/supabaseContext";
import { useOAuthServer } from "@/lib/supabase/useOAuthServer";
import { Twitch } from "lucide-react";
import { useEffect } from "react";

import { useNavigate } from "react-router";

export function SignInPage() {
  const { loading, onProviderLogin, handleLogin } = useOAuthServer();

  return (
    <div className="grid justify-center items-center h-full w-full">
      <Card className="w-[400px]">
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
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignInPage;
