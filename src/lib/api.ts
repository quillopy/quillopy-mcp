import { transformGithubUrl } from "./utils.js";

const QUILLOPY_API_BASE = "https://api.quillopy.com/v1";
const QUILLOPY_API_KEY = process.env.QUILLOPY_API_KEY;

interface ApiResponse {
  response: string;
}

interface RequestBody {
  query: string;
  documentation_name: string;
  installation_name?: string;
  language?: string;
}

interface ChatWithCodeRequestBody {
  query: string;
  githubRepoUrl: string;
}

export async function makeQuillopyRequest({
  query,
  documentation_name,
  installation_name,
  language,
}: RequestBody): Promise<ApiResponse | null> {
  // Check if the QUILLOPY_API_KEY environment variable is set
  if (!QUILLOPY_API_KEY || QUILLOPY_API_KEY.trim() === "") {
    throw new Error(
      "QUILLOPY_API_KEY environment variable not set. Please set this variable to use the Quillopy API. If you don't have an API key, you can get one at https://quillopy.com"
    );
  }

  try {
    const url = `${QUILLOPY_API_BASE}/document-search`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    const requestBody: RequestBody = {
      query,
      documentation_name,
    };

    if (installation_name) {
      requestBody.installation_name = installation_name;
    }

    if (language) {
      requestBody.language = language;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${QUILLOPY_API_KEY}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Authentication failed: Your API key is invalid. Please check your QUILLOPY_API_KEY or get a new key at https://quillopy.com"
        );
      } else {
        throw new Error(
          `Server error (${response.status}): ${
            (await response.text()) || "No additional information available."
          }`
        );
      }
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timed out after 10 seconds. Please check your internet connection and try again."
      );
    } else {
      // Re-throw the error so it can be caught by the caller
      throw error;
    }
  }
}

export async function makeChatWithCodeRequest({
  query,
  githubRepoUrl,
}: ChatWithCodeRequestBody): Promise<ApiResponse | null> {
  // Check if the QUILLOPY_API_KEY environment variable is set
  if (!QUILLOPY_API_KEY || QUILLOPY_API_KEY.trim() === "") {
    throw new Error(
      "QUILLOPY_API_KEY environment variable not set. Please set this variable to use the Quillopy API. If you don't have an API key, you can get one at https://quillopy.com"
    );
  }

  try {
    const url = `${QUILLOPY_API_BASE}/chat-with-code`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${QUILLOPY_API_KEY}`,
    };

    const githubRepo = transformGithubUrl(githubRepoUrl);

    if (!githubRepo) {
      throw new Error("Invalid GitHub URL format");
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        github_repo: githubRepo,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Authentication failed: Your API key is invalid. Please check your QUILLOPY_API_KEY or get a new key at https://quillopy.com"
        );
      } else if (response.status === 403) {
        throw new Error(
          "Access denied: You do not have permission to use the chat-with-code feature."
        );
      } else {
        throw new Error(
          `Server error (${response.status}): ${
            (await response.text()) || "No additional information available."
          }`
        );
      }
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timed out after 10 seconds. Please check your internet connection and try again."
      );
    } else {
      // Re-throw the error so it can be caught by the caller
      throw error;
    }
  }
}
