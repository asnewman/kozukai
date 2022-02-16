import { SupabaseClient } from "@supabase/supabase-js";
import { Habit } from "../models/Habit";

class HabitService {
  private supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async getHabitForUser(userId: string, habitId: number) {
    const response = await this.supabaseClient
        .from("Habits")
        .select("*")
        .eq("userId", userId).eq("id", habitId);

    const habit = new Habit(response.body[0].name, response.body[0].value, response.body[0].id);
    return habit;
  }

  async getHabitsForUser(userId: string) {
    const response = await this.supabaseClient
      .from("Habits")
      .select("*")
      .eq("userId", userId);

    const habits = response.body.map(
      (rawHabit) => new Habit(rawHabit.name, rawHabit.value, rawHabit.id)
    );
    return habits;
  }

  async upsertHabitForUser(userId: string, habit: Habit) {
    await this.supabaseClient.from("Habits").upsert({
      name: habit.name,
      value: habit.value,
      userId,
      id: habit.id
    });
  }

  habitStringMapToHabits(habitStringMap: Record<string, string>) {
    return Object.entries(habitStringMap).map(([idString, habitString]) => {
      return this.habitStringToHabit(habitString, parseInt(idString))
    })
  }

  habitStringToHabit(habitString: string, id?: number) {
    const habitArr = habitString.split(' ')
    const value = parseInt(habitString.split(" ").pop());
    let name = "";

    for (
      let i = 0;
      i < habitArr.length - 1;
      i++
    ) {
      if (i === 0) {
        name += habitArr[i]
      }
      else {
        name += " " + habitArr[i]
      }
    }

    return new Habit(name, value, id);
  }
}

export default HabitService;
