import { useState } from "react";
import { Sparkles, Download, Github, Save, Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<string>("website");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!prompt.trim()) {
        throw new Error("Please enter a prompt");
      }
      const response = await apiRequest<{ code: string }>("POST", "/api/generate", {
        prompt,
        type: projectType,
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      toast({
        title: "Code generated successfully!",
        description: "Your project is ready to preview and save.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!projectName.trim()) {
        throw new Error("Please enter a project name");
      }
      if (!generatedCode) {
        throw new Error("No code to save");
      }
      await apiRequest("POST", "/api/projects", {
        name: projectName,
        description: prompt,
        type: projectType,
        code: generatedCode,
        language: "html",
        techStack: ["HTML", "CSS", "JavaScript"],
        prompt,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project saved!",
        description: "Your project has been saved successfully.",
      });
      setProjectName("");
      setPrompt("");
      setGeneratedCode("");
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "project"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Code downloaded successfully.",
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none gradient-hero border-b">
        <div className="p-6 md:p-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 mb-2 text-white">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10" />
            Create with AI
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Build amazing websites and applications with natural language
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    data-testid="input-project-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type" data-testid="select-project-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="webapp">Web App</SelectItem>
                      <SelectItem value="chatbot">Chatbot</SelectItem>
                      <SelectItem value="ai-agent">AI Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">What do you want to build?</Label>
                <Textarea
                  id="prompt"
                  placeholder="Example: Create a responsive landing page for a fitness app with a hero section, features grid, and contact form..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                  data-testid="input-prompt"
                />
              </div>

              <Button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending || !prompt.trim()}
                className="w-full md:w-auto"
                data-testid="button-generate"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generateMutation.isPending ? "Generating..." : "Generate Code"}
              </Button>
            </CardContent>
          </Card>

          {(generateMutation.isPending || generatedCode) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Generated Code</CardTitle>
                  {generatedCode && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        data-testid="button-copy-code"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadCode}
                        data-testid="button-download"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        data-testid="button-save-project"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Project
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generateMutation.isPending ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  <Tabs defaultValue="code" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="code" data-testid="tab-code">Code</TabsTrigger>
                      <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="code" className="mt-4">
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                          <code data-testid="text-generated-code">{generatedCode}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="preview" className="mt-4">
                      <div className="border rounded-lg overflow-hidden bg-background">
                        <div className="bg-muted px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Live Preview
                        </div>
                        <iframe
                          srcDoc={generatedCode}
                          className="w-full h-96 border-0"
                          title="Preview"
                          sandbox="allow-scripts"
                          data-testid="iframe-preview"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
