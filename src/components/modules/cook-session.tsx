"use client";

import { getRecipe } from "@/app/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { recipes, users } from "@/drizzle/schema";
import { createClient } from "@/lib/supabase-client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { RealtimeChannel } from "@supabase/supabase-js";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const CookSessionModule: React.FC<{
  params: { recipeId: string; roomId: string };
  user: Omit<InferSelectModel<typeof users>, "email">;
}> = ({ params, user }) => {
  const [mode, setMode] = useState<"invite" | "start" | "end">("invite");
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [participants, setParticipants] = useState<
    { id: string; picture: string }[]
  >([]);

  const [api, setApi] = useState<CarouselApi>();
  const [friendApi, setFriendApi] = useState<CarouselApi>();

  const [recipe, setRecipe] = useState<InferSelectModel<typeof recipes> | null>(
    null
  );

  // handle card changes in the ui
  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      if (!!channel) {
        channel.send({
          type: "broadcast",
          event: "friend_state_change",
          message: {
            current: api.selectedScrollSnap(),
            userId: user.id,
          },
        });
      }
    });
  }, [api]);

  const { recipeId, roomId } = params;

  const copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard.");
  };

  const supabase = createClient();

  // create room
  useEffect(() => {
    // this is so that the id generation is only done
    // on the client, preventing hydration errors
    const room = supabase.channel(`session-${roomId}`, {
      config: {
        broadcast: { self: true },
      },
    });
    setChannel(room);
  }, []);

  // handle user status on invite mode
  useEffect(() => {
    if (!!channel) {
      channel
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          setParticipants((prev) => [
            ...prev,
            { id: key, picture: newPresences[0].picture },
          ]);
        })
        .on("presence", { event: "leave" }, ({ key }) => {
          setParticipants((prev) => prev.filter((p) => p.id != key));
        })
        .subscribe(async (status) => {
          if (status !== "SUBSCRIBED") {
            return;
          }

          await channel.track({ picture: user?.profilePicture ?? "" });
        });
    }
  }, [channel]);

  // to untrack presence when the user
  // closes the page
  useEffect(() => {
    if (!!channel) {
      return () => {
        const untrackPresence = async () => {
          await channel.untrack();
        };

        untrackPresence();
      };
    }
  }, [channel]);

  // listen to messages
  useEffect(() => {
    if (!!channel) {
      channel.on("broadcast", { event: "start_session" }, () => {
        setMode("start");
      });

      channel.on("broadcast", { event: "end_session" }, () => {
        setMode("end");
      });

      channel.on("broadcast", { event: "friend_state_change" }, (payload) => {
        if (!!friendApi && payload.message.userId !== user.id) {
          friendApi.scrollTo(payload.message.current);
        }
      });
    }
  }, [channel, friendApi]);

  // getting the recipe data
  useEffect(() => {
    if (!!recipeId) {
      const _getRecipe = async () => {
        const recipe = await getRecipe(recipeId);
        if (!!recipe) {
          setRecipe(recipe);
        }
      };
      _getRecipe();
    }
  }, [recipeId]);

  const startSession = () => {
    if (!!channel) {
      channel.send({
        type: "broadcast",
        event: "start_session",
      });
    }
  };

  const endSession = () => {
    if (!!channel) {
      channel.send({
        type: "broadcast",
        event: "end_session",
      });
    }
  };

  if (mode === "invite") {
    return (
      <div className="p-8 flex flex-col gap-4 items-center justify-center h-[80vh]">
        <h1 className="text-xl">
          You&apos;re almost on your way to cooking together!
        </h1>
        {!!roomId ? (
          <div className="flex flex-col items-center gap-4">
            <span>
              Share the link below with your friend so that they can join your
              session.
            </span>
            <div className="flex gap-4 items-center">
              <span>
                {window.location.origin}/join/{roomId}
              </span>
              <Button
                onClick={() => {
                  copyLinkToClipboard(
                    `${window.location.origin}/join/${roomId}`
                  );
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <span>Loading...</span>
        )}

        <div className="flex flex-col gap-4">
          <span>Your session:</span>
          <div className="flex items-center justify-center gap-4">
            {participants.map((p, index) => {
              return (
                <Avatar key={index} className="w-8 h-8">
                  <AvatarImage src={p.picture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              );
            })}
          </div>
        </div>

        <Button onClick={startSession}>Start cooking together!</Button>
      </div>
    );
  }

  if (mode === "start") {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-12">
        <div className="flex w-full items-center justify-between">
          <span>Cook Together has started. Have fun!</span>
          <Button onClick={endSession}>End Session</Button>
        </div>
        <div className="flex items-center justify-center gap-48">
          <div className="flex items-center justify-center">
            <Carousel setApi={setApi} className="w-full max-w-lg">
              <CarouselContent>
                {recipe?.steps?.map((step, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-lg bg-purple-300 p-8 w-full h-[500px] flex flex-col items-center justify-center gap-4">
                      <span className="text-lg font-bold">
                        Step {index + 1}
                      </span>
                      <span className="text-xl">{step}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="flex items-center justify-center">
            <Carousel setApi={setFriendApi} className="w-full max-w-lg">
              <CarouselContent>
                {recipe?.steps?.map((step, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-lg bg-purple-800 text-white p-8 w-full h-[500px] flex flex-col items-center justify-center gap-4">
                      <span className="text-lg font-bold">
                        Step {index + 1}
                      </span>
                      <span className="text-xl">{step}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious disabled />
              <CarouselNext disabled />
            </Carousel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-8">
      <span>Your session has ended.</span>
      <Link href={"/"}>
        <Button>See other recipes</Button>
      </Link>
    </div>
  );
};
