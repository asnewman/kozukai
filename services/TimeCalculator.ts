const MILLISECONDS_IN_DAY = 86400000
const MILLISECONDS_IN_HOUR = 3600000
const MILLISECONDS_IN_MINUTE = 60000

class TimeCalculator {
    static getTimeSince(timestamp: number) {
        const curr = Date.now();
        const difference = curr - timestamp;

        if (difference < MILLISECONDS_IN_MINUTE) {
            return "< 1 minute ago"
        }
        else if (difference < MILLISECONDS_IN_HOUR) {
            const minutes = Math.floor(difference / MILLISECONDS_IN_MINUTE)

            if (minutes === 1) {
                return "1 minute ago"
            }

            return `${minutes} minutes ago`
        }
        else if (difference < MILLISECONDS_IN_DAY) {
            const hours = Math.floor(difference / MILLISECONDS_IN_HOUR)

            if (hours === 1) {
                return "1 hour ago"
            }

            return `${hours} hours ago`
        }
        else {
            const days = Math.floor(difference / MILLISECONDS_IN_DAY)

            if (days === 1) {
                return "1 day ago"
            }

            return `${days} days ago`
        }
    }
}

export default TimeCalculator;