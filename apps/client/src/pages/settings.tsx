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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/layouts/PageHeader";
import { Label } from "@radix-ui/react-label";
import { useSearchParams } from "react-router-dom";

const SettingsPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "general";
  return (
    <>
      <PageHeader title="Settings" subtext="Manage your account settings." />
      <Tabs defaultValue={defaultTab} className="w-full pt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">My Account</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <h3 className="text-xl font-medium">General</h3>
          <Separator className="mb-2" />

          <Label className="pt-4 text-base">New password</Label>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SettingsPage;
