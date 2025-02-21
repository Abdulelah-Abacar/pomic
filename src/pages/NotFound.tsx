import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-500">404</h1>
        <p className="text-xl mt-4">Page not found</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
