import HabitService from "./HabitService";
import { SupabaseClient } from "@supabase/supabase-js";
import { Habit } from "../models/Habit";

describe("HabitService string tests", () => {
  test("Happy path", () => {
    const habitService = new HabitService({} as SupabaseClient);
    const habits = habitService.habitStringMapToHabits({
      1: "Read a book 5",
      2: "Run 6",
    });

    expect(habits[0]).toEqual(
      expect.objectContaining({ _name: "Read a book", _value: 5 })
    );
    expect(habits[1]).toEqual(
      expect.objectContaining({ _name: "Run", _value: 6 })
    );
  });

  test("No value", () => {
    const habitService = new HabitService({} as SupabaseClient);
    try {
      const habits = habitService.habitStringMapToHabits({
        1: "Read a book 5",
        2: "Run a lot",
      });
      expect(false).toBeTruthy();
    } catch (e) {
      expect(e.message).toEqual("Malformed habit string");
    }
  });

  test("Just a value", () => {
    const habitService = new HabitService({} as SupabaseClient);
    try {
      const habits = habitService.habitStringMapToHabits({
        1: "Read a book 5",
        2: "6",
      });
      expect(false).toBeTruthy();
    } catch (e) {
      expect(e.message).toEqual("Malformed habit string");
    }
  });
});

describe("HabitService getHabitForUser", () => {
  function createMockSupabaseClient(data: any[]) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              body: data,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;
  }

  it("Get a habit happy path", async () => {
    const habitService = new HabitService(
      createMockSupabaseClient([
        {
          name: "run",
          value: 2,
          id: 1,
        },
      ])
    );

    const habit = await habitService.getHabitForUser("123", 1);
    expect(habit).toEqual(
      expect.objectContaining({ _name: "run", _value: 2, _id: 1 })
    );
  });

  it("Get a habit no return", async () => {
    const habitService = new HabitService(createMockSupabaseClient([]));

    try {
      await habitService.getHabitForUser("123", 1);
      expect(false).toBeTruthy();
    } catch (e) {
      expect(e.message).toEqual("Habit not found");
    }
  });
});

describe("HabitService getHabitForUsers", () => {
  function createMockSupabaseClient(data: any[]) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            body: data,
          }),
        }),
      }),
    } as unknown as SupabaseClient;
  }

  it("Get a habits happy path", async () => {
    const habitService = new HabitService(
      createMockSupabaseClient([
        {
          name: "run",
          value: 2,
          id: 1,
        },
        {
          name: "walk",
          value: 4,
          id: 2,
        },
      ])
    );

    const habits = await habitService.getHabitsForUser("123");
    expect(habits[0]).toEqual(
      expect.objectContaining({ _name: "run", _value: 2, _id: 1 })
    );
    expect(habits[1]).toEqual(
      expect.objectContaining({ _name: "walk", _value: 4, _id: 2 })
    );
  });
});

describe("HabitService upsertHabitForUser", () => {
  it("Upserts correctly", () => {
    let upsertVal;
    const habitService = new HabitService({ from: () => ({ upsert: (vals) => { upsertVal = vals }})} as unknown as SupabaseClient)
    habitService.upsertHabitForUser("123", new Habit("run", 2, 1))

    expect(upsertVal).toEqual({ name: "run", value: 2, userId: "123", id: 1})
  });
})