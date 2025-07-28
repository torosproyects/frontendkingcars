export type AspectRatio = "4/3" | "16/9" | "1/1" | "3/4"; // Todos los ratios aceptados

export interface PhotoTemplate {
  id: number;
  label: string;
  description: string;
  aspectRatio: AspectRatio;
  referenceImage: string;
  required: boolean;
  guidanceImage?: string; // Optional: URL for a silhouette or guide image
}

export interface CapturedPhoto {
  templateId: number;
  imageUrl: string; // base64 data URL
}
 