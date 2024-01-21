export type MonthlyRentRecord = {
  vacancy: boolean;
  rentAmount: number;
  rentDueDate: Date;
};

export type MonthlyRentRecords = Array<MonthlyRentRecord>;

class MonthlyRentRecordBuilder {
  private monthlyRentRecords: MonthlyRentRecords;
  private record: Partial<MonthlyRentRecord>;

  constructor(monthlyRentRecords: MonthlyRentRecords = []) {
    this.monthlyRentRecords = monthlyRentRecords;
    this.record = {};
  }

  static get(records: MonthlyRentRecords): MonthlyRentRecordBuilder {
    return new MonthlyRentRecordBuilder(records);
  }

  vacancy(vacancy: boolean): MonthlyRentRecordBuilder {
    this.record.vacancy = vacancy;
    return this;
  }

  rentAmount(rentAmount: number): MonthlyRentRecordBuilder {
    this.record.rentAmount = rentAmount;
    return this;
  }

  rentDueDate(rentDueDate: Date): MonthlyRentRecordBuilder {
    this.record.rentDueDate = rentDueDate;
    return this;
  }

  build(): MonthlyRentRecord {
    const record = this.record as MonthlyRentRecord;
    this.monthlyRentRecords.push(record);
    return record;
  }
}

class RentOwedInWindow {
  private monthlyRentRecords: MonthlyRentRecords;
  private baseMonthlyRent: number;
  private leaseStartDate: Date;
  private windowStartDate: Date;
  private windowEndDate: Date;
  private dayOfMonthRentDue: number;
  private rentRateChangeFrequency: number;
  private rentChangeRate: number;

  constructor(
    baseMonthlyRent: number,
    leaseStartDate: Date,
    windowStartDate: Date,
    windowEndDate: Date,
    dayOfMonthRentDue: number,
    rentRateChangeFrequency: number,
    rentChangeRate: number
  ) {
    this.monthlyRentRecords = [];
    this.baseMonthlyRent = baseMonthlyRent;
    this.leaseStartDate = leaseStartDate;
    this.windowStartDate = windowStartDate;
    this.windowEndDate = windowEndDate;
    this.dayOfMonthRentDue = dayOfMonthRentDue;
    this.rentRateChangeFrequency = rentRateChangeFrequency;
    this.rentChangeRate = rentChangeRate;
  }

  get records(): MonthlyRentRecords {
    return this.monthlyRentRecords;
  }

  public calculate(): void {
    let currentRent = this.baseMonthlyRent;
    let currentDate = new Date(this.windowStartDate);

    while (currentDate <= this.windowEndDate) {
      if (
        currentDate <= this.leaseStartDate &&
        this.leaseStartDate.getDate() < this.dayOfMonthRentDue
      ) {
        this.calculateRentRecordBeforeStartDateDue(currentDate);

        currentDate = new Date(
          this.leaseStartDate.getFullYear(),
          this.leaseStartDate.getMonth(),
          this.dayOfMonthRentDue
        );
      } else {
        this.calculateRentRecordAfterStartDateDue(currentRent, currentDate);
        currentRent = this.calculateNextMonthRent(currentRent, currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
  }

  private calculateRentRecordBeforeStartDateDue(date: Date): MonthlyRentRecord {
    const remainingDays =
      this.dayOfMonthRentDue - this.leaseStartDate.getDate();
    const rentAmount = (this.baseMonthlyRent * remainingDays) / 30;

    return MonthlyRentRecordBuilder.get(this.monthlyRentRecords)
      .vacancy(false)
      .rentAmount(+rentAmount.toFixed(2))
      .rentDueDate(new Date(date))
      .build();
  }

  private calculateRentRecordAfterStartDateDue(
    rent: number,
    date: Date
  ): MonthlyRentRecord {
    return MonthlyRentRecordBuilder.get(this.monthlyRentRecords)
      .vacancy(false)
      .rentAmount(+rent.toFixed(2))
      .rentDueDate(
        new Date(date.getFullYear(), date.getMonth(), this.dayOfMonthRentDue)
      )
      .build();
  }

  private calculateNextMonthRent(rent: number, date: Date): number {
    const monthsPassed =
      date.getMonth() -
      this.windowStartDate.getMonth() +
      12 * (date.getFullYear() - this.windowStartDate.getFullYear());
    if (
      this.rentRateChangeFrequency > 0 &&
      monthsPassed % this.rentRateChangeFrequency === 0
    ) {
      return calculateNewMonthlyRent(rent, this.rentChangeRate);
    }

    return rent;
  }
}

/**
 * Determines the vacancy, rent amount and due date for each month in a given time window
 *
 * @param baseMonthlyRent : The base or starting monthly rent for unit (Number)
 * @param leaseStartDate : The date that the tenant's lease starts (Date)
 * @param windowStartDate : The first date of the given time window (Date)
 * @param windowEndDate : The last date of the given time window (Date)
 * @param dayOfMonthRentDue : The day of each month on which rent is due (Number)
 * @param rentRateChangeFrequency : The frequency in months the rent is changed (Number)
 * @param rentChangeRate : The rate to increase or decrease rent, input as decimal (not %), positive for increase, negative for decrease (Number),
 * @returns Array<MonthlyRentRecord>;
 */
export function calculateMonthlyRent(
  baseMonthlyRent: number,
  leaseStartDate: Date,
  windowStartDate: Date,
  windowEndDate: Date,
  dayOfMonthRentDue: number,
  rentRateChangeFrequency: number,
  rentChangeRate: number
) {
  const rentOwedInWindow = new RentOwedInWindow(
    baseMonthlyRent,
    leaseStartDate,
    windowStartDate,
    windowEndDate,
    dayOfMonthRentDue,
    rentRateChangeFrequency,
    rentChangeRate
  );

  rentOwedInWindow.calculate();

  return rentOwedInWindow.records;
}

/**
 * Calculates the new monthly rent
 *
 * @param baseMonthlyRent : the base amount of rent
 * @param rentChangeRate : the rate that rent my increase or decrease (positive for increase, negative for decrease)
 * @returns number
 *
 */
function calculateNewMonthlyRent(
  baseMonthlyRent: number,
  rentChangeRate: number
) {
  return baseMonthlyRent * (1 + rentChangeRate);
}

/**
 * Determines if the year is a leap year
 *
 * @param year
 * @returns boolean
 *
 */
function isLeapYear(year: number) {
  return year % 4 == 0 && year % 100 != 0;
}
