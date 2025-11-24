import { Github, GitBranch, Star, GitFork, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
}

export default function GitHubPage() {
  const { data: repos, isLoading, error } = useQuery<Repository[]>({
    queryKey: ["/api/github/repos"],
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none gradient-hero">
        <div className="p-4 md:p-5">
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
            <Github className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            GitHub Integration
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="font-semibold">Connected to GitHub</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your GitHub account is connected. You can push projects directly to your repositories.
              </p>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load repositories. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : repos?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Github className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first repository on GitHub to see it here
                </p>
                <Button
                  onClick={() => window.open("https://github.com/new", "_blank")}
                  data-testid="button-create-repo"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Create Repository
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos?.map((repo) => (
                  <Card
                    key={repo.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => window.open(repo.html_url, "_blank")}
                    data-testid={`card-repo-${repo.name}`}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-lg" data-testid={`text-repo-name-${repo.id}`}>
                            {repo.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {repo.private && (
                            <Badge variant="secondary" className="text-xs">
                              Private
                            </Badge>
                          )}
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 bg-primary rounded-full" />
                            {repo.language}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {repo.forks_count}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
