import { useState } from "react";
import { Layout, Eye, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Template } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Templates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const useTemplateMutation = useMutation({
    mutationFn: async (template: Template) => {
      await apiRequest("POST", "/api/projects", {
        name: `${template.name} (from template)`,
        description: template.description,
        type: template.category,
        code: template.code,
        language: template.language,
        techStack: template.techStack,
        prompt: `Created from template: ${template.name}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Template added to projects!",
        description: "You can now customize it from My Projects.",
      });
      setSelectedTemplate(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to use template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const categories = [
    "all",
    "landing",
    "saas",
    "blog",
    "ecommerce",
    "chatbot",
    "ai-agent",
  ];

  const filteredTemplates = templates?.filter(
    (t) => selectedCategory === "all" || t.category === selectedCategory
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none gradient-hero border-b">
        <div className="p-6 md:p-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 mb-2 text-white">
            <Layout className="h-8 w-8 md:h-10 md:w-10" />
            Templates
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Start with professionally designed templates
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`button-category-${category}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-32 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredTemplates?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Layout className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates?.map((template) => (
                <Card key={template.id} className="hover-elevate" data-testid={`card-template-${template.id}`}>
                  <CardHeader className="space-y-3">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <Layout className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg" data-testid={`text-template-name-${template.id}`}>
                        {template.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.techStack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1"
                      data-testid={`button-preview-${template.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => useTemplateMutation.mutate(template)}
                      disabled={useTemplateMutation.isPending}
                      data-testid={`button-use-${template.id}`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Use
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <span>{selectedTemplate?.name}</span>
              <Badge variant="secondary">{selectedTemplate?.category}</Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-sm">Live Preview</div>
                    <iframe
                      srcDoc={selectedTemplate.code}
                      className="w-full h-96 border-0"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="code" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                    <code>{selectedTemplate.code}</code>
                  </pre>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2">
                <Button onClick={() => useTemplateMutation.mutate(selectedTemplate)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
