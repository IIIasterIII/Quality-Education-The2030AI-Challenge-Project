import { getCommunityRoadmaps } from "@/app/api/roadmap";
import CommunityList from "@/components/community/communityList";

export default async function Page() {
    const roadmaps = await getCommunityRoadmaps(1, 20)
    return <CommunityList roadmaps={roadmaps} />
}