import { CookSessionModule } from "@/components/modules";
import { validateRequest } from "@/lib/auth";

export default async function CookSessionPage({
  params,
}: {
  params: { recipeId: string; roomId: string };
}) {
  const { user } = await validateRequest();

  return (
    <CookSessionModule
      params={params}
      user={JSON.parse(JSON.stringify(user))}
    />
  );
}
