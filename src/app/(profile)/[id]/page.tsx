import { Toolbar } from "@/src/components/common/Toolbar";
import { ProfileContent } from "@/src/components/profile/ProfileContent";


export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <div className="flex h-screen">
      <Toolbar />
      <ProfileContent userId={id}  />
    </div>
  );
};

