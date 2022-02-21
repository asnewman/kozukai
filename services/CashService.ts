import AccomplishmentService from "./AccomplishmentService";
import SpendingService from "./SpendingService";
import Accomplishment from "../models/Accomplishment";
import Spending from "../models/Spending";

class CashService {
    private accomplishmentService: AccomplishmentService;
    private spendingService: SpendingService;

    constructor(accomplishmentService: AccomplishmentService, spendingService: SpendingService) {
        this.accomplishmentService = accomplishmentService;
        this.spendingService = spendingService;
    }

    async calculateCashTotalForUser(userId: string) {
        const accomplishments: Accomplishment[] = await this.accomplishmentService.getAccomplishmentsForUser(userId)
        const spendings: Spending[] = await this.spendingService.getSpendingsForUser(userId)

        const cashGained = accomplishments.reduce((accumulator: number, curr) => {
            return accumulator + curr.value
        }, 0)
        const cashLost = spendings.reduce((accumulator: number, curr) => {
            return accumulator + curr.value
        }, 0)

        return parseFloat(Number(cashGained - cashLost).toFixed(2))
    }
}

export default CashService;