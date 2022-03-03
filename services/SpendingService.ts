import { SupabaseClient } from "@supabase/supabase-js";
import Spending from "../models/Spending";

class SpendingService {
  private supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
  }

  async getSpendingsForUser(userId: string) {
    const response = await this.supabaseClient
      .from("Spendings")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false });

    const spendings = response.body.map(
      (rawSpendings) =>
        new Spending(
          rawSpendings.name,
          rawSpendings.value,
          rawSpendings.timestamp,
          rawSpendings.id
        )
    );

    return spendings;
  }

  async createSpendingForUser(userId: string, spending: Spending) {
    await this.supabaseClient.from("Spendings").upsert({
      name: spending.name,
      value: spending.value,
      timestamp: spending.timestamp,
      userId,
    });
  }

  async removeSpending(spendingId: number, userId: string) {
    const spendingToDeleteRes = await this.supabaseClient
      .from("Spendings")
      .select("*")
      .match({ userId, id: spendingId });

    if (!spendingToDeleteRes.body[0]) {
      throw new Error("User does not own this spending");
    }

    await this.supabaseClient.from("Spendings").delete().match({"id": spendingId})
  }
}

export default SpendingService;
