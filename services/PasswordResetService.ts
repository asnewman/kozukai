import { SupabaseClient } from "@supabase/supabase-js";
import PasswordReset from "../models/PasswordReset";

class PasswordResetService {
    private supabaseClient: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabaseClient = supabaseClient;
    }

    /**
     * Returns null if there is no valid PasswordReset with the provided code
     */
    async findPasswordReset(email: string, code: string) {
        const response = await this.supabaseClient
            .from("PasswordReset")
            .select("*")
            .eq("email", email)
            .gt("expirationTimestamp", Date.now())
            .eq("code", code);

        const passwordResets = response.body.map(
            (rawPasswordResets) =>
                new PasswordReset(
                    rawPasswordResets.email,
                    rawPasswordResets.code,
                    rawPasswordResets.expirationTimestamp
                )
        );

        if (passwordResets.length === 0) {
            return null
        }
        return passwordResets[0]
    }

    async upsertPasswordResetForUser(email: string) {
        const code = Math.random().toString(36).substr(2, 5);

        const { error } = await this.supabaseClient.from("PasswordReset").upsert({
            email,
            code,
            expirationTimestamp: Date.now() + 15 * 60000,
        })

        if (error) {
            throw new Error(error.message)
        }
    }
}

export default PasswordResetService;
