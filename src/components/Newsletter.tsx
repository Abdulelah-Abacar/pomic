import { useState } from "react";
import { Input } from "./input";

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <div className="flex flex-col gap-8 justify-center max-w-[700px] mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter text-center">
        Receive new episodes in your inbox
      </h2>
      <div className="flex relative flex-col justify-center">
        <Input
          className="w-full border-none outline-none p-4 py-8 bg-stone-900 placeholder:font-thin placeholder:text-lg text-xl font-semibold"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="absolute top-1 right-1 py-4 px-8 font-bold text-center rounded-2xl bg-gradient-to-r from-[#5C67DE] to-[#7463AF]">
          Subscribe
        </button>
      </div>
    </div>
  );
}

export default Newsletter;
