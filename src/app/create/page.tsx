import { CreateRecipeModule } from "@/components/modules";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateRecipePage() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/");
  }
  return <CreateRecipeModule userId={user.id} />;
}
