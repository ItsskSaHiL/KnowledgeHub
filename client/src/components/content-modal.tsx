import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertArticleSchema, insertProjectSchema } from "@shared/schema";
import type { Domain } from "@shared/schema";

const contentFormSchema = z.object({
  type: z.enum(["article", "project"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  domainId: z.string().min(1, "Domain is required"),
  description: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "in-progress", "published", "completed"]),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

interface ContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContentModal({ open, onOpenChange }: ContentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [contentType, setContentType] = useState<"article" | "project">("article");

  const { data: domains } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      type: "article",
      title: "",
      content: "",
      domainId: "",
      description: "",
      githubUrl: "",
      demoUrl: "",
      tags: "",
      status: "draft",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const tags = data.tags ? data.tags.split(",").map(tag => tag.trim()) : [];
      
      if (data.type === "article") {
        const articleData = {
          title: data.title,
          content: data.content,
          excerpt: data.content.substring(0, 200),
          domainId: data.domainId,
          status: data.status,
          tags,
          attachments: [],
        };
        return apiRequest("POST", "/api/articles", articleData);
      } else {
        const projectData = {
          title: data.title,
          description: data.description || "",
          content: data.content,
          domainId: data.domainId,
          githubUrl: data.githubUrl,
          demoUrl: data.demoUrl,
          status: data.status,
          tags,
          technologies: [],
          featured: false,
        };
        return apiRequest("POST", "/api/projects", projectData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Success",
        description: `${contentType === "article" ? "Article" : "Project"} created successfully`,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create ${contentType}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContentFormData) => {
    createMutation.mutate(data);
  };

  const handleTypeChange = (type: "article" | "project") => {
    setContentType(type);
    form.setValue("type", type);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Content Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={handleTypeChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-content-type">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter content title"
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description (Projects only) */}
            {contentType === "project" && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief project description"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Domain */}
            <FormField
              control={form.control}
              name="domainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-domain">
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {domains?.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project URLs */}
            {contentType === "project" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/..."
                          {...field}
                          data-testid="input-github-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://demo.example.com"
                          {...field}
                          data-testid="input-demo-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your content here... Supports Markdown formatting."
                      rows={10}
                      {...field}
                      data-testid="textarea-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add tags separated by commas"
                      {...field}
                      data-testid="input-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      {contentType === "project" && (
                        <SelectItem value="completed">Completed</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createMutation.isPending}
                data-testid="button-save-content"
              >
                {createMutation.isPending ? "Saving..." : "Save Content"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
