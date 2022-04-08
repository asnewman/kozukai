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
        .eq("userId", userId).eq("id", habitId)

    if (response.body.length === 0) {
      throw new Error("Habit not found")
    }

    const habit = new Habit(response.body[0].name, response.body[0].value, response.body[0].id);
    return habit;
  }

  async getHabitsForUser(userId: string) {
    const response = await this.supabaseClient
      .from("Habits")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: true })

    const habits = response.body.map(
      (rawHabit) => new Habit(rawHabit.name, rawHabit.value, rawHabit.id)
    );
    return habits;
  }

  async removeHabit(habitId: number, userId: string) {
    const habitToDeleteRes = await this.supabaseClient
        .from("Habits")
        .select("*")
        .match({ userId, id: habitId });

    if (!habitToDeleteRes.body[0]) {
      throw new Error("User does not own this habit");
    }

    await this.supabaseClient.from("Habits").delete().match({"id": habitId})
  }

  async upsertHabitForUser(userId: string, habit: Habit) {
    const res = await this.supabaseClient.from("Habits").upsert({
      name: habit.name,
      value: habit.value,
      userId,
      id: habit.id
    });
    
    if (res.error) {
      console.error(res)
    }
  }

  habitStringMapToHabits(habitStringMap: Record<string, string>) {
    return Object.entries(habitStringMap).map(([idString, habitString]) => {
      return this.habitStringToHabit(habitString, parseInt(idString))
    })
  }

  habitStringToHabit(habitString: string, id?: number) {
    const habitArr = habitString.split(' ')
    const value = parseInt(habitString.split(" ").pop());

    const isMalformed = isNaN(value) || habitArr.length === 1

    if (isMalformed) {
      throw new Error(`Malformed habit string: ${habitString}`)
    }

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
