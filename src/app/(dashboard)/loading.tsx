import { Loader } from "lucide-react";
import React from "react";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="size-6 text-muted-foreground animate-spin" />
    </div>
  );
};

export default DashboardLoading;
