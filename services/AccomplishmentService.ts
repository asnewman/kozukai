import {SupabaseClient} from "@supabase/supabase-js";
import {Habit} from "../models/Habit";
import Accomplishment from "../models/Accomplishment";

class AccomplishmentService {
  private supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async getAccomplishmentsForUser(userId: string) {
    const response = await this.supabaseClient
      .from("Accomplishments")
      .select("*")
      .eq("userId", userId)
      .order("id", { ascending: false });

    if (response.error) {
      throw new Error(response.error.message)
    }

    return response.body.map(
        (rawAccomplishment) =>
            new Accomplishment(
                rawAccomplishment.name,
                rawAccomplishment.value,
                rawAccomplishment.timestamp
            )
    );
  }

  async createAccomplishmentForUser(userId: string, habit: Habit) {
    await this.supabaseClient.from("Accomplishments").upsert({
      name: habit.name,
      value: habit.value,
      timestamp: Date.now(),
      userId,
    });
  }
}

export default AccomplishmentService;
