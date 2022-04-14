import {SupabaseClient} from "@supabase/supabase-js";
import User from "../models/User";

class UserService {
    private supabaseClient: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabaseClient = supabaseClient;
    }

    async getUser(id: string) {
        const response = await this.supabaseClient
            .from("users")
            .select("*")
            .eq("id", id)

        if (response.body.length === 0) {
            throw new Error(`User not found ${id}`);
        }

        const rawUser = response.body[0];
        const user = new User(rawUser.email, rawUser.currencySymbol, {
            multi: rawUser.multi,
            once: rawUser.once,
            sometimes: rawUser.sometimes
        }, id)
        return user;
    }

    async updateUser(user: User) {
        const res = await this.supabaseClient.from("users")
            .update({
                currencySymbol: user.currencySymbol,
                multi: user.defaultValues.multi,
                once: user.defaultValues.once,
                sometimes: user.defaultValues.sometimes
            })
            .eq("id", user.id)

        if (res.error) {
            console.error(res)
        }
    }
}

export default UserService;