import { Loader } from "lucide-react";

const LoaderSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Loader className="animate-spin text-[#5C67DE]" size={30} />
    </div>
  );
};

export default LoaderSpinner;
