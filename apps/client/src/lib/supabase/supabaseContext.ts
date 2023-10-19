import { useEffect } from "react";
import { AuthSession } from "@supabase/supabase-js";
import { createStore, useStore } from "zustand";
import { supabaseClient } from "@/lib/supabase/supabaseClient";

type DiscordUser = {
  avatar_url: string;
  custom_claims: {
    global_name: string;
  };
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  picture: string;
  provider_id: string;
  sub: string;
};
type TwitchUser = {
  avatar_url: string;
  custom_claims: {
    broadcaster_type: string;
    description: string;
    offline_image_url: string;
    type: string;
  };
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  nickname: string;
  picture: string;
  provider_id: string;
  slug: string;
  sub: string;
};

type User = DiscordUser | TwitchUser;

type AuthStore = {
  session: AuthSession | null;
  user: User | null;
};
export const AuthStore = createStore<AuthStore>()((_set) => ({
  session: null,
  user: null,
  signOut: () => supabaseClient.auth.signOut(),
}));

export const useSession = () =>
  useStore(AuthStore, (ctx: AuthStore) => ctx.session);
export const useUser = () => useStore(AuthStore, (ctx: AuthStore) => ctx.user);

export default function useSupabaseAuth() {
  return useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      AuthStore.setState({ session });
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      AuthStore.setState({ session });
      switch (session?.user.app_metadata.provider) {
        case "discord":
          AuthStore.setState({
            user: session.user.user_metadata as DiscordUser,
          });
          break;
        case "twitch":
          AuthStore.setState({
            user: session.user.user_metadata as TwitchUser,
          });
          break;
        default:
          AuthStore.setState({ user: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}
