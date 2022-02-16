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
                    rawSpendings.timestamp
                )
        );

        return spendings;
    }

    async createSpendingForUser(userId: string, spending: Spending) {
        console.log(spending)
        console.log(await this.supabaseClient.from("Spendings").upsert({
            name: spending.name,
            value: spending.value,
            timestamp: spending.timestamp,
            userId
        }))
    }
}

export default SpendingService;
