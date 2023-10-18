import { invoke, shell } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { supabaseClient } from "./supabaseClient";
import OAuthResponsePage from "./OAuthResponsePage.html?raw";
import { useSession } from "./supabaseContext";
import { useNavigate } from "react-router";

function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}

// this pretty much
// https://github.com/JeaneC/tauri-oauth-supabase/blob/main/src/Auth.tsx
export const useOAuthServer = () => {
  const session = useSession();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [port, setPort] = useState<number | null>(null);

  useEffect(() => {
    if (session) navigate("/");
    if (port) return;

    const unlisten = listen("oauth://url", (data) => {
      setPort(null);
      if (!data.payload) return;

      const url = new URL(data.payload as string);
      const code = new URLSearchParams(url.search).get("code");

      if (code) {
        supabaseClient.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) {
            alert(error.message);
            console.error(error);
            return;
          }
          location.reload();
        });
      }
    });

    let _port: number | null = null;
    invoke("plugin:oauth|start", {
      config: {
        response: OAuthResponsePage,
      },
    }).then(async (port) => {
      setPort(port as number);
      _port = port as number;
    });

    () => {
      unlisten?.then((u) => u());
      invoke("plugin:oauth|cancel", { port: _port });
    };
  }, [port]);

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    email: string
  ) => {
    event.preventDefault();
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: getLocalHostUrl(port!) },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
  };

  const onProviderLogin = (provider: "discord" | "twitch") => async () => {
    setLoading(true);
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      options: {
        skipBrowserRedirect: true,
        redirectTo: getLocalHostUrl(port!),
      },
      provider: provider,
    });

    if (data.url) {
      shell.open(data.url);
    } else {
      alert(error?.message);
    }
  };

  return {
    onProviderLogin,
    loading,
    handleLogin,
  };
};
