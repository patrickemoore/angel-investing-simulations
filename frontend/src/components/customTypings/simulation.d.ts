type TimeAndReturn = {
  timeToMaturity: number, // The time to return (in months)
  returnMultiplier: number // The return multiplier
}

type InvestmentOpportunity = {
  startTime: number;
  investmentAmount: number;
}

type Investment = {
  maturationTime: number;
  returnAmount: number;
}

type MoneyParameters = {
  portfolioValue: number,
  investmentValue: number
}

type TimeParameters = {
  investmentsPerYear: number,
}

type DistributionParameters = {
  die: Map<number, number>;
}

type DecisionsParameters = {
  reinvestEarning: boolean,
  lastInvestmentTime: undefined | number
}

type SimulationParameters = {
  simulationCount: number;
  distributionParams: DistributionParameters;
  timeParams: TimeParameters;
  moneyParams: MoneyParameters;
  decisionParams: DecisionsParameters;
}

type PortfolioState = {
  realised: number,
  unrealised: number
};

type Outcome = PortfolioState[];

type Simulation = Outcome[];