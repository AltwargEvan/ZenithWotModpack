import { GameDirectoryInput } from "@/components/GameDirectoryInput";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/layouts/PageHeader";
import { Label } from "@radix-ui/react-label";
import { useSearchParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/lib/supabase/supabaseContext";
import Authenticator from "@/lib/supabase/Authenticator";

const SettingsPage = () => {
  const session = useSession();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "general";
  return (
    <>
      <PageHeader title="Settings" subtext="Manage your account settings." />
      <Tabs defaultValue={defaultTab} className="pt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <h3 className="text-xl font-medium">General</h3>
          <Separator className="mb-2" />
          <div className="grid space-y-4">
            <div>
              <Label className="pl-1 text-sm">Game Directory</Label>
              <GameDirectoryInput />
            </div>
            <div className="flex space-x-2 justify-start align-middle">
              <Switch />
              <Label className="pl-1 pt-0.5 text-sm">
                Automatically Download Mod Updates On Launch
              </Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="account">
          <h3 className="text-xl font-medium">Account</h3>
          <Separator className="mb-2" />
          {session && (
            <>
              <div className="grid space-y-4">
                <div className="flex space-x-2 justify-start align-middle">
                  <Switch />
                  <Label className="pl-1 text-sm">
                    Allow other users to view my profile
                  </Label>
                </div>
              </div>
            </>
          )}
          {!session && <Authenticator className="w-full" />}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SettingsPage;
