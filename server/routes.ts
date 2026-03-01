import type { Express } from "express";
import { type Server } from "http";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.analyze.path, async (req, res) => {
    try {
      const { username } = req.query;
      
      if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "GitHub username is required" });
      }

      // Fetch user data
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { 'User-Agent': 'PlacementPath-App' }
      });
      
      if (!userRes.ok) {
        if (userRes.status === 404) {
          return res.status(404).json({ message: "GitHub username not found" });
        }
        throw new Error("Failed to fetch user from GitHub API");
      }

      // Fetch repos
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { 'User-Agent': 'PlacementPath-App' }
      });
      
      if (!reposRes.ok) {
        throw new Error("Failed to fetch repos from GitHub API");
      }
      
      const repos = await reposRes.json();

      const repoCount = repos.length;
      let totalStars = 0;
      const languagesSet = new Set<string>();
      let latestUpdate = new Date(0);

      for (const repo of repos) {
        totalStars += repo.stargazers_count || 0;
        if (repo.language) {
          languagesSet.add(repo.language);
        }
        const updatedAt = new Date(repo.updated_at);
        if (updatedAt > latestUpdate) {
          latestUpdate = updatedAt;
        }
      }

      // Project Depth Score (0-35 theoretically before capping, but we won't cap here since max is 35)
      let projectScore = 0;
      if (repoCount < 5) projectScore = 5;
      else if (repoCount <= 15) projectScore = 15;
      else projectScore = 25;

      if (totalStars > 10) projectScore += 5;
      if (languagesSet.size >= 3) projectScore += 5;

      // Consistency Score (0-15)
      let consistencyScore = 5;
      const now = new Date();
      const daysSinceUpdate = (now.getTime() - latestUpdate.getTime()) / (1000 * 3600 * 24);
      
      if (repoCount > 0) {
        if (daysSinceUpdate <= 30) consistencyScore = 15;
        else if (daysSinceUpdate <= 90) consistencyScore = 10;
        else consistencyScore = 5;
      } else {
        consistencyScore = 0;
      }

      let overallScore = Math.floor((projectScore + consistencyScore) * 2);
      if (overallScore > 100) overallScore = 100;

      const lastUpdated = repoCount > 0 ? latestUpdate.toISOString() : "";

      res.status(200).json({
        overallScore,
        projectScore,
        consistencyScore,
        repoCount,
        totalStars,
        languages: Array.from(languagesSet),
        lastUpdated
      });
    } catch (err: any) {
      console.error("Error analyzing github profile:", err);
      res.status(500).json({ message: "Internal server error analyzing profile" });
    }
  });

  return httpServer;
}
