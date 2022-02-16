import AccomplishmentService from "./AccomplishmentService";
import SpendingService from "./SpendingService";

class CashService {
    private accomplishmentService: AccomplishmentService;
    private spendingService: SpendingService;

    constructor(accomplishmentService: AccomplishmentService, spendingService: SpendingService) {
        this.accomplishmentService = accomplishmentService;
        this.spendingService = spendingService;
    }

    async calculateCashTotalForUser(userId: string) {
        const accomplishments = await this.accomplishmentService.getAccomplishmentsForUser(userId)
        const spendings = await this.spendingService.getSpendingsForUser(userId)

        const cashGained = accomplishments.reduce((accumulator: number, curr) => {
            return accumulator + curr.value
        }, 0)
        const cashLost = spendings.reduce((accumulator: number, curr) => {
            return accumulator + curr.value
        }, 0)

        return cashGained - cashLost
    }
}

export default CashService;