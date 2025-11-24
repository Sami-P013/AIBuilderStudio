import { useState } from "react";
import { Settings as SettingsIcon, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ModelConfig, MCPServer, LibraryConfig } from "@shared/schema";

const availableModels = [
  {
    id: "openai-gpt4",
    name: "GPT-4 (OpenAI)",
    provider: "openai",
    description: "Most capable, best for complex reasoning and coding",
  },
  {
    id: "claude-opus",
    name: "Claude Opus (Anthropic)",
    provider: "anthropic",
    description: "Excellent reasoning and creative tasks",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro (Google)",
    provider: "google",
    description: "Great for coding and complex reasoning",
  },
  {
    id: "groq-mixtral",
    name: "Mixtral (Groq)",
    provider: "openrouter",
    description: "Fast and efficient, good for quick generations",
  },
];

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMcpName, setNewMcpName] = useState("");
  const [newLibraryName, setNewLibraryName] = useState("");

  const { data: models = [] } = useQuery<ModelConfig[]>({
    queryKey: ["/api/models"],
  });

  const { data: mcps = [] } = useQuery<MCPServer[]>({
    queryKey: ["/api/mcps"],
  });

  const { data: libraries = [] } = useQuery<LibraryConfig[]>({
    queryKey: ["/api/libraries"],
  });

  const setActiveModelMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/models/${id}/activate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      toast({
        title: "Model activated",
        description: "Your default model has been updated.",
      });
    },
  });

  const deleteMcpMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/mcps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mcps"] });
      toast({
        title: "MCP server removed",
        description: "The MCP server has been deleted.",
      });
    },
  });

  const deleteLibraryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/libraries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/libraries"] });
      toast({
        title: "Library removed",
        description: "The library integration has been deleted.",
      });
    },
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none gradient-hero">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
              <SettingsIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Configure AI models, MCPs, and integrations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="models" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="models">AI Models</TabsTrigger>
              <TabsTrigger value="mcps">MCP Servers</TabsTrigger>
              <TabsTrigger value="libraries">Libraries</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Models</CardTitle>
                  <CardDescription>
                    Choose which AI model to use for code generation. Support for OpenAI, Anthropic Claude, Google Gemini, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {availableModels.map((model) => {
                      const isActive = models.some((m) => m.modelId === model.id && m.isActive);
                      return (
                        <div
                          key={model.id}
                          className="flex items-start justify-between p-3 rounded-lg border border-border hover-elevate"
                          data-testid={`card-model-${model.id}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{model.name}</h4>
                            <p className="text-sm text-muted-foreground">{model.description}</p>
                            <Badge variant="outline" className="mt-2">
                              {model.provider}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            onClick={() => setActiveModelMutation.mutate(model.id)}
                            data-testid={`button-activate-${model.id}`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <Circle className="h-4 w-4 mr-1" />
                                Select
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-3">Using Replit AI Integrations</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Models from Anthropic, Google, and OpenRouter are available through Replit AI Integrations. These don't require API keys and charges are billed to your Replit credits.
                    </p>
                    <Button variant="outline" size="sm">
                      Configure API Keys (Optional)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mcps" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>MCP Servers</CardTitle>
                  <CardDescription>
                    Connect to Model Context Protocol (MCP) servers to extend your AI capabilities with tools and resources.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mcps.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No MCP servers connected yet</p>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add MCP Server
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mcps.map((mcp) => (
                        <div
                          key={mcp.id}
                          className="flex items-start justify-between p-3 rounded-lg border border-border hover-elevate"
                          data-testid={`card-mcp-${mcp.id}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{mcp.name}</h4>
                            <p className="text-sm text-muted-foreground">{mcp.type} • {mcp.capabilities?.length || 0} tools</p>
                            {mcp.isActive && <Badge className="mt-2">Active</Badge>}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMcpMutation.mutate(mcp.id)}
                            data-testid={`button-delete-mcp-${mcp.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    MCP server management interface will be available soon. You'll be able to connect to stdio, SSE, and custom MCP servers to unlock additional tools and capabilities.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="libraries" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integrated Libraries</CardTitle>
                  <CardDescription>
                    Manage your npm packages, APIs, and service integrations that power your projects.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {libraries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No libraries integrated yet</p>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Library
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {libraries.map((lib) => (
                        <div
                          key={lib.id}
                          className="flex items-start justify-between p-3 rounded-lg border border-border hover-elevate"
                          data-testid={`card-library-${lib.id}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold">{lib.name}</h4>
                            <p className="text-sm text-muted-foreground">{lib.type} • {lib.version}</p>
                            {lib.description && <p className="text-xs text-muted-foreground mt-1">{lib.description}</p>}
                            {lib.isActive && <Badge className="mt-2">Active</Badge>}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteLibraryMutation.mutate(lib.id)}
                            data-testid={`button-delete-library-${lib.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Library management interface coming soon. Install npm packages, connect to APIs (Stripe, Firebase, etc.), and manage service credentials all in one place.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
