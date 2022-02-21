import PasswordResetService from "./PasswordResetService";
import { SupabaseClient } from "@supabase/supabase-js";

describe("PasswordResetService findPasswordReset tests", () => {
  function createMockSupabaseClient(data: any[]) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            gt: () => ({
              eq: () => ({
                body: data,
              }),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;
  }

  it("finds password reset correctly", async () => {
    const passwordResetService = new PasswordResetService(
      createMockSupabaseClient([
        {
          code: "123",
          email: "a",
          expirationTimestamp: Date.now() + 1000,
        },
      ])
    );

    const foundPasswordReset = await passwordResetService.findPasswordReset(
      "a",
      "123"
    );

    expect(foundPasswordReset).toEqual(
      expect.objectContaining({ _code: "123", _email: "a" })
    );
  });

  it("returns null when password reset is not found", async () => {
    const passwordResetService = new PasswordResetService(
      createMockSupabaseClient([])
    );

    const foundPasswordReset = await passwordResetService.findPasswordReset(
      "a",
      "123"
    );

    expect(foundPasswordReset).toEqual(null);
  });
});

describe("PasswordResetService upsertPasswordResetForUser", () => {
  it("Upserts with a generated code", async () => {
    let upsertValues;
    const passwordResetService = new PasswordResetService({
      from: () => ({ upsert: (values) => (upsertValues = values) }),
    } as unknown as SupabaseClient);
    await passwordResetService.upsertPasswordResetForUser("a");

    expect(upsertValues.code).toHaveLength(5);
    expect(upsertValues.email).toBe("a");
    expect(upsertValues.expirationTimestamp).toBeTruthy();
  });

  it("Error if supabase client fails", async () => {
    const passwordResetService = new PasswordResetService({
      from: () => ({
        upsert: () => ({ error: { message: "Supabase error" } }),
      }),
    } as unknown as SupabaseClient);
    try {
      await passwordResetService.upsertPasswordResetForUser("a");
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual("Supabase error");
    }
  });
});
