import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Helmet>
        <title>404</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950/60 p-6">
        <h1 className="text-xl font-extrabold tracking-tight text-white">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-white/60">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Go home</Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
