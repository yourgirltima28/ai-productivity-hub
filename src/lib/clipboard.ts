import { toast } from "sonner";

export async function copyToClipboard(text: string, label = "Copied to clipboard") {
  if (!text.trim()) {
    toast.error("Nothing to copy yet");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Couldn't access the clipboard. Please copy manually.");
  }
}
