"use client";

import { createCookRoom } from "@/app/actions";
import { recipes } from "@/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";
import { generateId, User } from "lucia";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export const RecipeModule: React.FC<{
  recipe: InferSelectModel<typeof recipes>;
  user: User | null;
}> = ({ recipe, user }) => {
  const router = useRouter();

  const createSession = async () => {
    const roomId = generateId(10);
    await createCookRoom(
      JSON.parse(JSON.stringify({ roomId, recipeId: recipe.id }))
    );
    router.push(`/${recipe.id}/session/${roomId}`);
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{recipe.name}</span>
        <Button
          onClick={() => {
            if (!user) {
              router.push("/api/auth/google");
            } else {
              createSession();
            }
          }}
        >
          Start a Session
        </Button>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-4 w-1/2">
          <div className="relative w-full h-[400px]">
            <Image
              src={recipe.picture}
              alt={`Image of ${recipe.name}`}
              fill
              className="absolute object-cover rounded-xl"
            />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <span className="font-bold">Prep Time</span>
              <span>{recipe.prepTime} min</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-bold">Cook Time</span>
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-bold">Servings</span>
              <span>{recipe.servings}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xl">Ingredients</span>
            <div className="flex items-center gap-2 flex-wrap">
              {recipe.ingredients.map((ingredient, index) => {
                return (
                  <Badge key={index} variant={"outline"} className="w-fit">
                    {ingredient}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <span className="text-xl">Steps</span>
            <div className="flex flex-col gap-4">
              {recipe.steps.map((ingredient, index) => {
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-4 h-4 flex items-center justify-center bg-black text-white p-4 rounded-full">
                      {index + 1}
                    </div>
                    <span>{ingredient}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
