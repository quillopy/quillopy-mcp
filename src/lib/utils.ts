export function transformGithubUrl(url: string | URL): string | null {
  try {
    // Handle both URL object and string
    const urlString = url instanceof URL ? url.toString() : url;

    // Extract the path using regex or URL parsing
    const match = urlString.match(/github\.com\/([^\/]+\/[^\/]+)(?:\/|$)/i);

    if (match && match[1]) {
      // Remove any .git suffix if present
      return match[1].replace(/\.git$/, "");
    }

    throw new Error("Invalid GitHub URL format");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error transforming GitHub URL:", error.message);
    } else {
      console.error("Error transforming GitHub URL:", String(error));
    }
    return null;
  }
}
