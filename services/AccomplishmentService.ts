import { SupabaseClient } from "@supabase/supabase-js";
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
      .eq("userId", userId);

    const accomplishments = response.body.map(
      (rawAccomplishment) =>
        new Accomplishment(
          rawAccomplishment.name,
          rawAccomplishment.value,
          rawAccomplishment.timestamp
        )
    );

    return accomplishments;
  }

  async createAccomplishmentForUser(userId: string, habit: Habit) {
    await this.supabaseClient.from("Accomplishments").upsert({
      name: habit.name,
      value: habit.value,
      timestamp: Date.now()
    })
  }
}

export default AccomplishmentService;
