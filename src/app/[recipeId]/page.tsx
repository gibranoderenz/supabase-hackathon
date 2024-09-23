import { RecipeModule } from "@/components/modules";
import { db } from "@/drizzle";
import { recipes } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function RecipePage({
  params,
}: {
  params: { recipeId: string };
}) {
  const { recipeId } = params;

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  });

  if (!recipe) {
    redirect("/");
  }

  return <RecipeModule recipe={recipe} />;
}
