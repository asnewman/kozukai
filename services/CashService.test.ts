import CashService from "./CashService";
import AccomplishmentService from "./AccomplishmentService";
import SpendingService from "./SpendingService";

describe("CashService calculateCashTotalForUser", () => {
  it("Only shows 2 decimal places", async () => {
    const cashService = new CashService(
      {
        getAccomplishmentsForUser: () => {
          return [{ value: 6.25000000000000001}];
        },
      } as unknown as AccomplishmentService,
      {
        getSpendingsForUser: () => {
          return [{ value: 2.04}]
        }
      } as unknown as SpendingService
    );
    const cashTotal = await cashService.calculateCashTotalForUser("1");

    expect(cashTotal).toBe(4.21);
  });
});
