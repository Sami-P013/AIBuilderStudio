import { useState } from "react";
import { BookOpen, Zap, Code, Globe, MessageCircle, Brain, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

const guides = [
  {
    title: "Landing Pages & Portfolios",
    icon: Globe,
    description: "Build stunning marketing sites and professional portfolios",
    difficulty: "Beginner",
    steps: [
      {
        step: 1,
        title: "Use a Landing Page Template",
        description: "Start with the Landing Page template from the Templates section. It includes modern design patterns, responsive layouts, and call-to-action buttons.",
        action: "Go to Templates → Filter by 'landing'",
      },
      {
        step: 2,
        title: "Customize with AI Generator",
        description: "Use the AI Generator to create custom sections. Try prompts like: 'Create a responsive hero section with gradient background and testimonial cards'.",
        action: "Go to AI Generator",
      },
      {
        step: 3,
        title: "Add Hosting & Domain",
        description: "Use resources like Vercel, Netlify, or GitHub Pages from the Resources section to deploy your site for free.",
        action: "Go to Resources → Hosting",
      },
    ],
    tools: ["Landing Page Template", "AI Generator", "Vercel/Netlify"],
    outcome: "A professional landing page with automatic deployment",
  },
  {
    title: "Web Applications",
    icon: Code,
    description: "Create interactive full-stack web apps with real-time features",
    difficulty: "Intermediate",
    steps: [
      {
        step: 1,
        title: "Start with SaaS Template",
        description: "Use the SaaS template as your foundation. It includes dashboard layouts, user authentication patterns, and modern UI components.",
        action: "Go to Templates → Filter by 'saas'",
      },
      {
        step: 2,
        title: "Generate Features with AI",
        description: "Use AI Generator for specific features: 'Create a React component for a data table with filtering, sorting, and pagination'.",
        action: "Go to AI Generator",
      },
      {
        step: 3,
        title: "Add Backend Logic",
        description: "Generate server-side code for APIs, authentication, and database operations. Try: 'Create a Node.js API endpoint for user management'.",
        action: "Use AI Generator with webapp type",
      },
      {
        step: 4,
        title: "Deploy & Connect Database",
        description: "Use resources like Firebase, Supabase, or MongoDB for your database. Deploy to Vercel or Railway.",
        action: "Go to Resources → Databases & Hosting",
      },
    ],
    tools: ["SaaS Template", "AI Generator", "Firebase/Supabase", "Vercel"],
    outcome: "A fully functional web application with backend and database",
  },
  {
    title: "AI Chatbots",
    icon: MessageCircle,
    description: "Build conversational AI experiences powered by modern LLMs",
    difficulty: "Intermediate",
    steps: [
      {
        step: 1,
        title: "Use Chatbot Template",
        description: "Start with the Chatbot template which includes chat interface components, message history, and streaming support.",
        action: "Go to Templates → Filter by 'chatbot'",
      },
      {
        step: 2,
        title: "Generate Chatbot UI",
        description: "Use AI Generator: 'Create a React chat interface with message bubbles, input field, and typing indicators'.",
        action: "Go to AI Generator",
      },
      {
        step: 3,
        title: "Connect to OpenAI API",
        description: "Generate backend code that integrates with OpenAI. The platform has built-in OpenAI support - just configure your API key.",
        action: "Add OPENAI_API_KEY in environment",
      },
      {
        step: 4,
        title: "Add Custom Knowledge",
        description: "Enhance your chatbot with RAG (Retrieval-Augmented Generation) using resources from the Resources section.",
        action: "Go to Resources → AI Tools",
      },
    ],
    tools: ["Chatbot Template", "AI Generator", "OpenAI API", "Vector Database"],
    outcome: "An intelligent chatbot with custom knowledge and natural conversations",
  },
  {
    title: "AI Agents & Automation",
    icon: Brain,
    description: "Create autonomous agents that perform complex tasks",
    difficulty: "Advanced",
    steps: [
      {
        step: 1,
        title: "Generate Agent Architecture",
        description: "Use AI Generator: 'Create a TypeScript-based autonomous agent with task planning, tool use, and state management'.",
        action: "Go to AI Generator with ai-agent type",
      },
      {
        step: 2,
        title: "Define Tools & Actions",
        description: "Generate tool definitions for your agent. Example: 'Create tools for web scraping, API calls, and data processing'.",
        action: "Use AI Generator",
      },
      {
        step: 3,
        title: "Build the Control Loop",
        description: "Generate the core agent loop: 'Create an agent loop that takes tasks, plans actions, executes tools, and evaluates results'.",
        action: "Use AI Generator",
      },
      {
        step: 4,
        title: "Connect External Services",
        description: "Use GitHub integration to connect to repositories, APIs from Resources section for various services.",
        action: "Go to GitHub & Resources",
      },
      {
        step: 5,
        title: "Test & Deploy",
        description: "Create test cases in the AI Generator and deploy to cloud platforms that support long-running processes.",
        action: "Go to Resources → Deployment",
      },
    ],
    tools: ["AI Generator", "GitHub", "Node.js APIs", "Cloud Platforms"],
    outcome: "A sophisticated AI agent that automates complex workflows",
  },
  {
    title: "E-commerce Store",
    icon: Zap,
    description: "Build online stores with shopping carts and payment processing",
    difficulty: "Advanced",
    steps: [
      {
        step: 1,
        title: "Start with E-commerce Template",
        description: "Use the E-commerce template with product grid, shopping cart, and checkout flow.",
        action: "Go to Templates → Filter by 'ecommerce'",
      },
      {
        step: 2,
        title: "Generate Product Features",
        description: "Use AI Generator: 'Create a product page with image gallery, ratings, and add-to-cart functionality'.",
        action: "Go to AI Generator",
      },
      {
        step: 3,
        title: "Add Payment Processing",
        description: "Generate Stripe integration code: 'Create a Stripe payment integration with checkout form and order confirmation'.",
        action: "Use AI Generator",
      },
      {
        step: 4,
        title: "Set Up Product Database",
        description: "Generate database schema and API endpoints for product management, inventory, and orders.",
        action: "Use AI Generator",
      },
      {
        step: 5,
        title: "Deploy & Monitor",
        description: "Use resources for analytics, hosting, and payment processing to get your store live.",
        action: "Go to Resources",
      },
    ],
    tools: ["E-commerce Template", "AI Generator", "Stripe", "Database", "Hosting"],
    outcome: "A complete e-commerce platform ready to accept payments",
  },
];

const workflows = [
  {
    name: "The Quick Build",
    description: "For prototyping ideas fast",
    steps: [
      "1. Pick a template matching your project type",
      "2. Use AI Generator for custom sections",
      "3. Deploy immediately to test with users",
      "4. Iterate based on feedback",
    ],
    bestFor: "Startups, MVPs, rapid prototyping",
  },
  {
    name: "The Custom Build",
    description: "For building exactly what you envision",
    steps: [
      "1. Start fresh with AI Generator",
      "2. Generate frontend components piece by piece",
      "3. Generate backend APIs for your features",
      "4. Connect external services from Resources",
      "5. Test thoroughly and deploy",
    ],
    bestFor: "Custom projects, unique requirements",
  },
  {
    name: "The Hybrid Approach",
    description: "Best of both templates and custom code",
    steps: [
      "1. Start with a template for the foundation",
      "2. Generate custom features with AI",
      "3. Modify and extend the template",
      "4. Deploy and gather user feedback",
      "5. Use GitHub for version control",
    ],
    bestFor: "Most projects, balancing speed and customization",
  },
];

export default function Guides() {
  const [selectedGuide, setSelectedGuide] = useState(0);
  const currentGuide = guides[selectedGuide];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none gradient-hero">
        <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Learning Guides
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Learn how to build different projects using AI tools</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Project Guides</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {guides.map((guide, idx) => {
                  const GuideIcon = guide.icon;
                  return (
                    <Card
                      key={idx}
                      className={`cursor-pointer transition-all hover-elevate ${selectedGuide === idx ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedGuide(idx)}
                      data-testid={`card-guide-${guide.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <GuideIcon className="h-6 w-6 text-primary" />
                          <Badge variant="secondary" className="text-xs">
                            {guide.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="border-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <CardTitle className="gradient-heading text-2xl">{currentGuide.title}</CardTitle>
                      <CardDescription className="mt-2">{currentGuide.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {currentGuide.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Step-by-Step Guide</h3>
                    <div className="space-y-4">
                      {currentGuide.steps.map((step) => (
                        <div key={step.step} className="flex gap-4">
                          <div className="flex-none">
                            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                            <Link href={step.action === "Go to Templates → Filter by 'landing'" ? "/templates" : step.action === "Go to Templates" ? "/templates" : step.action === "Go to AI Generator" ? "/" : step.action === "Go to Resources → Hosting" ? "/resources" : step.action === "Go to Resources → Databases & Hosting" ? "/resources" : step.action === "Go to Resources → AI Tools" ? "/resources" : step.action === "Go to GitHub & Resources" ? "/github" : step.action === "Go to Resources → Deployment" ? "/resources" : step.action === "Go to Resources" ? "/resources" : "/"}
                            >
                              <Button size="sm" variant="outline" data-testid={`button-guide-action-${step.step}`}>
                                {step.action}
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3">Tools Needed</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentGuide.tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3">What You'll Build</h3>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">{currentGuide.outcome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflows" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workflows.map((workflow, idx) => (
                  <Card key={idx} className="flex flex-col hover-elevate" data-testid={`card-workflow-${workflow.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <CardTitle className="gradient-heading">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <h4 className="text-sm font-semibold mb-3">Process:</h4>
                      <ol className="space-y-2">
                        {workflow.steps.map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="flex-none font-semibold text-primary">{step.charAt(0)}.</span>
                            <span>{step.slice(2)}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Best for:</p>
                        <p className="text-sm">{workflow.bestFor}</p>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card className="mt-6 border-accent/30 bg-accent/5">
                <CardHeader>
                  <CardTitle>Pro Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-accent flex-none mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Start Small</p>
                      <p className="text-sm text-muted-foreground">Begin with a template or AI-generated component, then expand from there.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-accent flex-none mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Combine Tools</p>
                      <p className="text-sm text-muted-foreground">Mix and match templates with AI generation for faster development.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-accent flex-none mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Use Resources</p>
                      <p className="text-sm text-muted-foreground">Check the Resources section for free tools to extend your projects.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-accent flex-none mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Deploy Early</p>
                      <p className="text-sm text-muted-foreground">Get your project live quickly using free hosting from the Resources section.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
