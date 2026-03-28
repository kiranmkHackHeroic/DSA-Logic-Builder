import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type ProblemProgress = Tables<"problem_progress">;
export type ProblemProgressInsert = TablesInsert<"problem_progress">;
export type ProblemProgressUpdate = TablesUpdate<"problem_progress">;

export const useProblemProgress = (problemId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["problem-progress", problemId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("problem_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("problem_id", problemId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!problemId,
  });

  const upsertProgress = useMutation({
    mutationFn: async (updates: ProblemProgressUpdate) => {
      if (!user) throw new Error("Not authenticated");

      const { data: existing } = await supabase
        .from("problem_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("problem_id", problemId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("problem_progress")
          .update(updates)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const insertData: ProblemProgressInsert = {
          user_id: user.id,
          problem_id: problemId,
          started_at: new Date().toISOString(),
          ...updates,
        };
        
        const { data, error } = await supabase
          .from("problem_progress")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problem-progress", problemId] });
      queryClient.invalidateQueries({ queryKey: ["all-problem-progress"] });
    },
    onError: (error) => {
      console.error("Error saving progress:", error);
      toast({
        title: "Error saving progress",
        description: "Your progress could not be saved. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    progress,
    isLoading,
    updateProgress: upsertProgress.mutate,
    isSaving: upsertProgress.isPending,
  };
};

export const useAllProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-problem-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("problem_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
