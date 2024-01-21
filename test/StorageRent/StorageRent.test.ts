import { calculateMonthlyRent } from "../../src/StorageRent/StorageRent";

describe("calculateMonthlyRent function", () => {
  it("should return MonthlyRentRecords", () => {
    const baseMonthlyRent = 100.0;
    const leaseStartDate = new Date("2023-01-01T00:00:00");
    const windowStartDate = new Date("2023-01-01T00:00:00");
    const windowEndDate = new Date("2023-03-31T00:00:00");
    const dayOfMonthRentDue = 1;
    const rentRateChangeFrequency = 1;
    const rentChangeRate = 0.1;

    const result = calculateMonthlyRent(
      baseMonthlyRent,
      leaseStartDate,
      windowStartDate,
      windowEndDate,
      dayOfMonthRentDue,
      rentRateChangeFrequency,
      rentChangeRate
    );

    const expectedResult = [
      {
        vacancy: false,
        rentAmount: 100.0,
        rentDueDate: new Date("2023-01-01T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 110.0,
        rentDueDate: new Date("2023-02-01T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 121.0,
        rentDueDate: new Date("2023-03-01T00:00:00"),
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should return MonthlyRentRecords validate first payment due date and first month pro-rate when lease start is before monthly due date", () => {
    const baseMonthlyRent = 100.0;
    const leaseStartDate = new Date("2023-01-01T00:00:00");
    const windowStartDate = new Date("2023-01-01T00:00:00");
    const windowEndDate = new Date("2023-03-31T00:00:00");
    const dayOfMonthRentDue = 15;
    const rentRateChangeFrequency = 1;
    const rentChangeRate = 0.1;

    const result = calculateMonthlyRent(
      baseMonthlyRent,
      leaseStartDate,
      windowStartDate,
      windowEndDate,
      dayOfMonthRentDue,
      rentRateChangeFrequency,
      rentChangeRate
    );

    const expectedResult = [
      {
        vacancy: false,
        rentAmount: 46.67,
        rentDueDate: new Date("2023-01-01T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 100,
        rentDueDate: new Date("2023-01-15T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 110.0,
        rentDueDate: new Date("2023-02-15T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 121.0,
        rentDueDate: new Date("2023-03-15T00:00:00"),
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should return MonthlyRentRecords when rent decreases by 10% each month", () => {
    const baseMonthlyRent = 100.0;
    const leaseStartDate = new Date("2023-01-01T00:00:00");
    const startDate = new Date("2023-01-01T00:00:00");
    const endDate = new Date("2023-03-01T00:00:00");
    const dayOfMonthRentDue = 1;
    const rentRateChangeFrequency = 1;
    const rentChangeRate = -0.1;

    const result = calculateMonthlyRent(
      baseMonthlyRent,
      leaseStartDate,
      startDate,
      endDate,
      dayOfMonthRentDue,
      rentRateChangeFrequency,
      rentChangeRate
    );

    const expectedResult = [
      {
        vacancy: false,
        rentAmount: 100.0,
        rentDueDate: new Date("2023-01-01T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 90.0,
        rentDueDate: new Date("2023-02-01T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 81.0,
        rentDueDate: new Date("2023-03-01T00:00:00"),
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should return MonthlyRentRecords when rent increases by 10% every 2 months", () => {
    const baseMonthlyRent = 100.0;
    const leaseStartDate = new Date("2023-11-01T00:00:00");
    const windowStartDate = new Date("2023-11-01T00:00:00");
    const windowEndDate = new Date("2024-04-30T00:00:00");
    const dayOfMonthRentDue = 5;
    const rentRateChangeFrequency = 2;
    const rentChangeRate = 0.1;

    const result = calculateMonthlyRent(
      baseMonthlyRent,
      leaseStartDate,
      windowStartDate,
      windowEndDate,
      dayOfMonthRentDue,
      rentRateChangeFrequency,
      rentChangeRate
    );

    const expectedResult = [
      {
        vacancy: false,
        rentAmount: 13.33,
        rentDueDate: new Date("2023-11-01T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 100.0,
        rentDueDate: new Date("2023-11-05T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 110.0,
        rentDueDate: new Date("2023-12-05T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 110.0,
        rentDueDate: new Date("2024-01-05T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 121.0,
        rentDueDate: new Date("2024-02-05T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 121.0,
        rentDueDate: new Date("2024-03-05T00:00:00"),
      },
      {
        vacancy: false,
        rentAmount: 133.1,
        rentDueDate: new Date("2024-04-05T00:00:00"),
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});
