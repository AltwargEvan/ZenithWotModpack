import { Link, useRouteError } from "react-router-dom";
import Button from "../components/Button";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const message =
    error instanceof Error ? error.message : JSON.stringify(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>If you found this page, please send us a ticket here:</p>
      <Button>
        <Link to="/">Back To App</Link>
      </Button>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}
