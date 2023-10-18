import Authenticator from "@/lib/supabase/Authenticator";
import { useSession } from "@/lib/supabase/supabaseContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function SignInPage() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, []);

  return (
    <div className="grid justify-center items-center h-full w-full">
      <Authenticator />
    </div>
  );
}

export default SignInPage;
