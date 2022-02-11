import {createClient, SupabaseClient} from "@supabase/supabase-js";
import AccomplishmentService from "./AccomplishmentService";
import HabitService from "./HabitService";
import SpendingService from "./SpendingService";

class ClassFactoryService {
    private static _supabaseClient: SupabaseClient | null = null
    private static _accomplishmentService: AccomplishmentService | null = null
    private static _habitService: HabitService | null = null
    private static _spendingService: SpendingService | null = null

    static get supabaseClient(): SupabaseClient{
        if (!this._supabaseClient) {
            this._supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        }

        return this._supabaseClient
    }

    static get accomplishmentService(): AccomplishmentService {
        if (!this._accomplishmentService) {
            this._accomplishmentService = new AccomplishmentService(this.supabaseClient)
        }

        return this._accomplishmentService;
    }

    static get habitService(): HabitService {
        if (!this._habitService) {
            this._habitService = new HabitService(this.supabaseClient)
        }

        return this._habitService;
    }

    static get spendingService(): SpendingService {
        if (!this._spendingService) {
            this._spendingService = new SpendingService(this.supabaseClient)
        }

        return this._spendingService;
    }
}

export default ClassFactoryService;