import {createClient, SupabaseClient} from "@supabase/supabase-js";
import AccomplishmentService from "./AccomplishmentService";
import HabitService from "./HabitService";
import SpendingService from "./SpendingService";
import CashService from "./CashService";
import PasswordResetService from "./PasswordResetService";
import UserService from "./UserService";

class ClassFactoryService {
    private static _supabaseClient: SupabaseClient | null = null
    private static _accomplishmentService: AccomplishmentService | null = null
    private static _habitService: HabitService | null = null
    private static _spendingService: SpendingService | null = null
    private static _cashService: CashService | null = null
    private static _passwordResetService: PasswordResetService | null = null
    private static _userService: UserService | null = null

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

    static get cashService(): CashService {
        if (!this._cashService) {
            this._cashService = new CashService(this.accomplishmentService, this.spendingService)
        }

        return this._cashService
    }

    static get passwordResetService(): PasswordResetService {
        if (!this._passwordResetService) {
            this._passwordResetService = new PasswordResetService(this.supabaseClient)
        }

        return this._passwordResetService
    }

    static get userService(): UserService {
        if (!this._userService) {
            this._userService = new UserService(this.supabaseClient)
        }

        return this._userService;
    }
}

export default ClassFactoryService;