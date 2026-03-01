import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAnalyze(username: string | null) {
  return useQuery({
    queryKey: [api.analyze.path, username],
    queryFn: async () => {
      if (!username) return null;
      
      const url = new URL(api.analyze.path, window.location.origin);
      url.searchParams.append("username", username);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("GitHub profile not found. Please check the username.");
        if (res.status === 400) throw new Error("Invalid username format provided.");
        throw new Error("Failed to analyze profile. Please try again later.");
      }
      
      const data = await res.json();
      return api.analyze.responses[200].parse(data);
    },
    enabled: !!username,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
}
