"use server";

import { db } from "@/drizzle";
import { cookRooms, recipes } from "@/drizzle/schema";
import { createClient } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { lucia } from "../lucia";
import { FormSchema } from "../schema";

export const uploadFile = async (formData: FormData) => {
  try {
    const supabase = createClient();

    const picture = formData.get("picture") as File;
    const fileName = randomUUID();

    const res = await supabase.storage
      .from("recipe-images")
      .upload(fileName, picture, {
        contentType: picture.type,
      });

    if (res.error) {
      return;
    }

    const { data } = supabase.storage
      .from("recipe-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {}
};

type CreateRecipeParams = Omit<FormSchema, "picture"> & {
  userId: string;
  picture: string;
};

export const createRecipe = async (values: CreateRecipeParams) => {
  const ingredients = values.ingredients.map((ingredient) => {
    return ingredient.label;
  });

  const steps = values.steps.map((step) => {
    return step.label;
  });
  const data = { ...values, ingredients, steps };

  await db.insert(recipes).values(data);
};

export const createCookRoom = async (data: {
  roomId: string;
  recipeId: string;
}) => {
  await db.insert(cookRooms).values(data);
};

export const getRecipe = async (recipeId: string) => {
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, recipeId),
  });

  return recipe;
};

export const logout = async (sessionId: string) => {
  await lucia.invalidateSession(sessionId);
  revalidatePath("/");
};
