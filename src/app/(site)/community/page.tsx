import type { Metadata } from "next";
import { CommunityView } from "@/components/pages/Community";

export const metadata: Metadata = { title: "Community and points", description: "Points, streaks, referrals and the leaderboard for Get Berrier depositors." };

export default function CommunityPage() {
  return <CommunityView />;
}
