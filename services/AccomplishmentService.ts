import { SupabaseClient } from "@supabase/supabase-js";
import { Habit } from "../models/Habit";
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
      throw new Error(response.error.message);
    }

    return response.body.map(
      (rawAccomplishment) =>
        new Accomplishment(
          rawAccomplishment.name,
          rawAccomplishment.value,
          rawAccomplishment.timestamp,
          rawAccomplishment.id
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

  async removeAccomplishment(accomplishmentId: number, userId: string) {
    const accomplishmentToDeleteRes = await this.supabaseClient
      .from("Accomplishments")
      .select()
      .match({ id: accomplishmentId, userId });

    if (!accomplishmentToDeleteRes.body[0]) {
      throw new Error("User does not own this accomplishment");
    }

    await this.supabaseClient
      .from("Accomplishments")
      .delete()
      .match({ id: accomplishmentId });
  }
}

export default AccomplishmentService;
