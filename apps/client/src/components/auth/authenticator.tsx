import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { shell } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { supabaseClient } from "./supabaseClient";
import responseHTML from "./response.html?raw";

function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}

const Authenticator = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [port, setPort] = useState<number | null>(null);

  useEffect(() => {
    console.log("Refresh", port);
    if (port) return;

    const unlisten = listen("oauth://url", (data) => {
      setPort(null);
      if (!data.payload) return;

      const url = new URL(data.payload as string);
      const code = new URLSearchParams(url.search).get("code");

      console.log("here", data.payload, code);
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
        response: responseHTML,
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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: getLocalHostUrl(port!) },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  const onProviderLogin = (provider: "discord") => async () => {
    setLoading(true);
    console.log("Port:", getLocalHostUrl(port!));
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      options: {
        skipBrowserRedirect: true,
        scopes: "identify",
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

  return (
    <div>
      <Button onClick={onProviderLogin("discord")}>Discord</Button>
    </div>
  );
};
export default Authenticator;
