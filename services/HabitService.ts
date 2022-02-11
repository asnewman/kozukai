import { SupabaseClient } from "@supabase/supabase-js";
import { Habit } from "../models/Habit";

class HabitService {
  private supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async getHabitsForUser(userId: string) {
    const response = await this.supabaseClient
      .from("Habits")
      .select("*")
      .eq("userId", userId);

    const habits = response.body.map(
      (rawHabit) => new Habit(rawHabit.name, rawHabit.value)
    );
    return habits;
  }

  async createHabitForUser(userId: string, habit: Habit) {
    await this.supabaseClient.from("Habits").upsert({
      name: habit.name,
      value: habit.value,
      userId
    });
  }
}

export default HabitService;
