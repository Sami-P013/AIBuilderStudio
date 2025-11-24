import { BookOpen, ExternalLink, Code, Palette, Cloud, Wrench, Zap, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Resource {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

const resources: Resource[] = [
  // IDEs & Editors
  {
    name: "VS Code",
    description: "Free, powerful code editor with extensions",
    url: "https://code.visualstudio.com/",
    category: "ides",
    tags: ["Editor", "Free"],
  },
  {
    name: "Replit",
    description: "Online IDE for collaborative coding",
    url: "https://replit.com/",
    category: "ides",
    tags: ["Online", "Collaborative"],
  },
  {
    name: "CodeSandbox",
    description: "Online code editor for web development",
    url: "https://codesandbox.io/",
    category: "ides",
    tags: ["Online", "React"],
  },
  
  // Frameworks & Libraries
  {
    name: "React",
    description: "JavaScript library for building UIs",
    url: "https://react.dev/",
    category: "frameworks",
    tags: ["Frontend", "JavaScript"],
  },
  {
    name: "Next.js",
    description: "React framework for production",
    url: "https://nextjs.org/",
    category: "frameworks",
    tags: ["React", "SSR"],
  },
  {
    name: "Express.js",
    description: "Fast Node.js web framework",
    url: "https://expressjs.com/",
    category: "frameworks",
    tags: ["Backend", "Node.js"],
  },
  {
    name: "Vue.js",
    description: "Progressive JavaScript framework",
    url: "https://vuejs.org/",
    category: "frameworks",
    tags: ["Frontend", "JavaScript"],
  },
  
  // Deployment & Hosting
  {
    name: "Vercel",
    description: "Deploy web apps instantly",
    url: "https://vercel.com/",
    category: "hosting",
    tags: ["Hosting", "Free Tier"],
  },
  {
    name: "Netlify",
    description: "Modern web hosting platform",
    url: "https://www.netlify.com/",
    category: "hosting",
    tags: ["Hosting", "JAMstack"],
  },
  {
    name: "Railway",
    description: "Deploy backend services easily",
    url: "https://railway.app/",
    category: "hosting",
    tags: ["Backend", "Database"],
  },
  {
    name: "Render",
    description: "Cloud hosting for modern apps",
    url: "https://render.com/",
    category: "hosting",
    tags: ["Hosting", "Free Tier"],
  },
  
  // Design Tools
  {
    name: "Figma",
    description: "Collaborative design platform",
    url: "https://www.figma.com/",
    category: "design",
    tags: ["Design", "UI/UX"],
  },
  {
    name: "Canva",
    description: "Easy graphic design tool",
    url: "https://www.canva.com/",
    category: "design",
    tags: ["Graphics", "Templates"],
  },
  {
    name: "Excalidraw",
    description: "Virtual whiteboard for sketching",
    url: "https://excalidraw.com/",
    category: "design",
    tags: ["Diagrams", "Free"],
  },
  
  // APIs & Services
  {
    name: "RapidAPI",
    description: "Discover and connect to APIs",
    url: "https://rapidapi.com/",
    category: "apis",
    tags: ["API", "Marketplace"],
  },
  {
    name: "Public APIs",
    description: "Free APIs for developers",
    url: "https://github.com/public-apis/public-apis",
    category: "apis",
    tags: ["API", "Free"],
  },
  {
    name: "OpenAI",
    description: "AI models and APIs",
    url: "https://openai.com/",
    category: "apis",
    tags: ["AI", "GPT"],
  },
  
  // Learning Resources
  {
    name: "freeCodeCamp",
    description: "Learn to code for free",
    url: "https://www.freecodecamp.org/",
    category: "learning",
    tags: ["Education", "Free"],
  },
  {
    name: "MDN Web Docs",
    description: "Web development documentation",
    url: "https://developer.mozilla.org/",
    category: "learning",
    tags: ["Docs", "Reference"],
  },
  {
    name: "W3Schools",
    description: "Web development tutorials",
    url: "https://www.w3schools.com/",
    category: "learning",
    tags: ["Tutorial", "Beginner"],
  },
];

const categories = [
  { id: "all", name: "All Resources", icon: BookOpen },
  { id: "ides", name: "IDEs & Editors", icon: Code },
  { id: "frameworks", name: "Frameworks", icon: Wrench },
  { id: "hosting", name: "Deployment", icon: Cloud },
  { id: "design", name: "Design Tools", icon: Palette },
  { id: "apis", name: "APIs & Services", icon: Zap },
  { id: "learning", name: "Learning", icon: GraduationCap },
];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none border-b p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 mb-2 text-white">
              <BookOpen className="h-8 w-8 md:h-10 md:w-10" />
              Free Resources
            </h1>
            <p className="text-base md:text-lg text-white/90">
              Curated collection of free tools to build and deploy your projects
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-xs"
              data-testid="input-search-resources"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover-elevate border-card-border"
                  }`}
                  data-testid={`button-category-${category.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource, index) => (
              <Card
                key={index}
                className="hover-elevate cursor-pointer"
                onClick={() => window.open(resource.url, "_blank")}
                data-testid={`card-resource-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg" data-testid={`text-resource-name-${index}`}>
                      {resource.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
