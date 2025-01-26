import { getCurrent } from "@/features/auth/queries";
import { MemberList } from "@/features/members/components/members-list";
import { redirect } from "next/navigation";
import React from "react";

const MembersPage = async () => {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <MemberList />
    </div>
  );
};

export default MembersPage;
