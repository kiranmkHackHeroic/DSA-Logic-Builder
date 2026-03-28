import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type UserStreak = Tables<"user_streaks">;
export type UserStreakUpdate = TablesUpdate<"user_streaks">;

export const useUserStreak = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: streak, isLoading } = useQuery({
    queryKey: ["user-streak", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateStreak = useMutation({
    mutationFn: async (updates: UserStreakUpdate) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_streaks")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  const recordActivity = useMutation({
    mutationFn: async () => {
      if (!user || !streak) throw new Error("Not authenticated or no streak record");

      const today = new Date().toISOString().split("T")[0];
      const lastActivity = streak.last_activity_date;
      
      let newStreak = streak.current_streak;
      
      if (lastActivity) {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day - increment streak
          newStreak = streak.current_streak + 1;
        } else if (diffDays > 1) {
          // Streak broken - reset to 1
          newStreak = 1;
        }
        // Same day - keep current streak
      } else {
        // First activity ever
        newStreak = 1;
      }

      const { data, error } = await supabase
        .from("user_streaks")
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak),
          last_activity_date: today,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  const incrementProblemsSolved = useMutation({
    mutationFn: async () => {
      if (!user || !streak) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_streaks")
        .update({
          total_problems_solved: streak.total_problems_solved + 1,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  const incrementProblemsAttempted = useMutation({
    mutationFn: async () => {
      if (!user || !streak) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_streaks")
        .update({
          total_problems_attempted: streak.total_problems_attempted + 1,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  return {
    streak,
    isLoading,
    updateStreak: updateStreak.mutate,
    recordActivity: recordActivity.mutate,
    incrementProblemsSolved: incrementProblemsSolved.mutate,
    incrementProblemsAttempted: incrementProblemsAttempted.mutate,
  };
};
