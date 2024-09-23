"use client";

import { createRecipe, uploadFile } from "@/app/actions";
import { formSchema, FormSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

export const CreateRecipeModule: React.FC<{ userId: string }> = ({
  userId,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("picture");

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    name: "steps",
    control: form.control,
  });

  const onSubmit = async (values: FormSchema) => {
    const formData = new FormData();
    formData.append("picture", values.picture[0]);

    const pictureUrl = await uploadFile(formData);

    if (!!pictureUrl) {
      const _values = { ...values, picture: pictureUrl, userId };
      await createRecipe(JSON.parse(JSON.stringify(_values)));
    }
  };

  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl">Create Recipe</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Fried rice" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Picture</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...fileRef}
                    onChange={(event) => {
                      field.onChange(event.target?.files?.[0] ?? undefined);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your description..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prep Time</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cookTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cook Time</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>
              <Button
                type="button"
                onClick={() => {
                  appendIngredient({ label: "" });
                }}
              >
                Add
              </Button>
            </div>
            {ingredientFields.map((field, index) => {
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`ingredients.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4">
                        <FormControl>
                          <Input
                            placeholder={`Ingredient ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          onClick={() => {
                            removeIngredient(index);
                          }}
                          className="bg-red-700 hover:bg-red-700/80"
                        >
                          Delete
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Steps</Label>
              <Button
                type="button"
                onClick={() => {
                  appendStep({ label: "" });
                }}
              >
                Add
              </Button>
            </div>
            {stepFields.map((field, index) => {
              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`steps.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4">
                        <FormControl>
                          <Input placeholder={`Step ${index + 1}`} {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          onClick={() => {
                            removeStep(index);
                          }}
                          className="bg-red-700 hover:bg-red-700/80"
                        >
                          Delete
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
