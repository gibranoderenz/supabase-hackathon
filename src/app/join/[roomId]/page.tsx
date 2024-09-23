import { db } from "@/drizzle";
import { cookRooms } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function JoinCookRoom({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = params;
  const room = await db.query.cookRooms.findFirst({
    where: eq(cookRooms.roomId, roomId),
  });

  if (!room) {
    redirect("/");
  }

  redirect(`/${room.recipeId}/session/${roomId}`);
}
