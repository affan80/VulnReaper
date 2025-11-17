import React from "react";
import D_nav from "./D_nav.js";
import Dashboard from "./dashboard.js";

export default function DashBoardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <D_nav />
      <Dashboard />
    </div>
  );
}
