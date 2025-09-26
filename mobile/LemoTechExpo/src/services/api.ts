// Minimal mobile API service stub
export const api = {
  get: async <T = unknown>(path: string): Promise<T> => {
    // Replace with real networking library/config later
    throw new Error(`GET not implemented: ${path}`);
  },
  post: async <T = unknown>(path: string, body?: unknown): Promise<T> => {
    throw new Error(`POST not implemented: ${path}`);
  },
};


