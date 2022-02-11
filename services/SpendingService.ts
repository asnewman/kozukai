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
            .eq("userId", userId);

        const spendings = response.body.map(
            (rawSpendings) =>
                new Spending(
                    rawSpendings.name,
                    rawSpendings.value,
                )
        );

        return spendings;
    }

    async createSpendingForUser(userId: string, spending: Spending) {
        await this.supabaseClient.from("Spendings").upsert({
            name: spending.name,
            value: spending.value,
        })
    }
}

export default SpendingService;
