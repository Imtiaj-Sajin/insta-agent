export interface InstagramPost {
    id: string;
    caption: string;
  }
  
  export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
    const url = `https://graph.facebook.com/v21.0/17841470292534936?fields=media%7Bcaption%7D&access_token=EAAnZByvmjelsBO4B4rKxBlUTwTBuAZBv9bjIGRZCw1hiYZADy7TvrA20gpEKxqoV1BnJIP9ZCmnZACgyfvqodmR9D8nhWIwWpZAC1zHiYRGBwwZCrvEdpiUmP42VPfgkqBFCzHLfv8mTkq1uxFE73BYjajd2QmySFShIP8aYxJFN4laq8mZCGFN5pvfMMr2ew04qZBTyhhekHLvTFMJ42OVc09hy4ZD`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Map to array of { id, caption }
      return data.media.data.map((item: { id: string; caption?: string }) => ({
        id: item.id,
        caption: item.caption || "No caption available",
      }));
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      return []; // Return an empty array in case of failure
    }
  };
  