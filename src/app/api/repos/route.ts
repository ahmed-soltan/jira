import { GITHUB_TOKEN } from "@/config";
import { Octokit } from "@octokit/core";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
  try {
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    const {data} = await octokit.request('GET /user/repos', {
      visibility: 'all', // You can set visibility as 'all', 'public', or 'private'
      affiliation: 'owner', // Optional: filters to only repositories where you're the owner
      per_page: 100, // Optional: number of repos per page
    });


    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
  }
};
