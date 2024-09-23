import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle";
import { recipes } from "@/drizzle/schema";
import { validateRequest } from "@/lib/auth";
import { ilike } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await validateRequest();

  const recipesData = await db.query.recipes.findMany(
    !!searchParams && !!searchParams.q
      ? { where: ilike(recipes.name, `%${searchParams.q}%`) }
      : undefined
  );

  return (
    <div className="p-16 flex flex-col items-center justify-center gap-8">
      <span className="text-lg">What do you want to cook today together?</span>
      <div className="flex items-center justify-center gap-4 w-full">
        <Search />
        {!!user ? (
          <Link href={"/create"}>
            <Button>Create Recipe</Button>
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {recipesData.length === 0 ? (
          <span>No recipes found.</span>
        ) : (
          recipesData.map((recipe) => {
            return (
              <Link key={recipe.id} href={`/${recipe.id}`}>
                <div
                  key={recipe.id}
                  className="rounded-xl border border-gray-300"
                >
                  <div className="relative w-[300px] h-[200px]">
                    <Image
                      src={recipe.picture}
                      alt={`Image of ${recipe.name}`}
                      fill
                      className="absolute object-cover rounded-xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center gap-4">
                    <span className="text-lg">{recipe.name}</span>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center justify-center">
                        <span>Prep Time</span>
                        <span>{recipe.prepTime} min</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span>Cook Time</span>
                        <span>{recipe.cookTime} min</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span>Servings</span>
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
