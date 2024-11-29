export interface InstagramPost {
    id: string;
    caption: string;
  }
  
  export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
    const url = `https://graph.facebook.com/v21.0/17841470292534936?fields=media,caption&access_token=EAAnZByvmjelsBOZCS79aRQzzj3IX4iKTkwpCNYjskuCBiGqXfcczhEfK7KUk4LGA2ILwFIgXogF6Yq2R3UiwvOFLD2iNHznkUQk1VXpVaFEf77Glf5qu2wUZCT7yBbb5pn5VwamoFa3Ajhnsq4NJZC0kZCuM6RItbjhZBfZBKJYw25uUH1chEgeTFNSfZAR8lHkZD`;
  
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
  