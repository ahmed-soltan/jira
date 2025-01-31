"use client"

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="size-6"/>
      <p className="text-sm">Something Went Wrong </p>
      <Button variant={"secondary"} size={"sm"} asChild>
        <Link href={"/"}>Back To Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
