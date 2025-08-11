//-| File path: app/(components)/Header.actions.ts
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { YouTubeSubscriberData, YouTubeAPIResponse } from "./Header.types";

export async function getYouTubeSubscriberCountAction(): Promise<ActionResponse<YouTubeSubscriberData>> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      return getActionResponse({ error: "YouTube API key not configured" });
    }

    const channelHandle = "AzAnything";
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${channelHandle}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return getActionResponse({ error: "Failed to fetch YouTube data" });
    }
    
    const data: YouTubeAPIResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return getActionResponse({ error: "Channel not found" });
    }
    
    const subscriberCount = parseInt(data.items[0].statistics.subscriberCount, 10);
    
    return getActionResponse({ data: { subscriberCount } });
  } catch (error) {
    return getActionResponse({ error });
  }
}