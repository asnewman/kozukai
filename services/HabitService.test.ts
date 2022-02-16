import HabitService from "./HabitService";
import {SupabaseClient} from "@supabase/supabase-js";

describe('HabitService tests', () => {
    test('habit string test', () => {
        const habitService = new HabitService({} as SupabaseClient);
        const resHabit = habitService.habitStringToHabit("Read a book 5")
        expect(resHabit.name).toBe("Read a book")
        expect(resHabit.value).toBe(5)
    })
})