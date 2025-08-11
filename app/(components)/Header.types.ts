//-| File path: app/(components)/Header.types.ts

export interface YouTubeSubscriberData {
  subscriberCount: number;
}

export interface YouTubeAPIResponse {
  items: Array<{
    statistics: {
      subscriberCount: string;
    };
  }>;
}