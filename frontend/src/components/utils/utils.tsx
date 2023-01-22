export function clamp(a, x, b) {
  return Math.min(Math.max(x, a), b);
}

export function generateTimeAndReturn(die): TimeAndReturn {

  // generate two random numbers (the percentile ranks of the x and t distributions respectively)

  const r1: number = Math.random();
  const r2: number = Math.random();

  let x: number = 0;

  // Calculate x via rounding down to the nearest percentile marker from r1

  for (let [key, value] of die.entries()) {
      if (r1 >= key) {
          x = Math.max(x, value);
      }
  }

  // Calculate t via inverse CDF of N~(3 + log_2(x+1), 2^2) at r2 (approximated by the 1.35 * logit(r2))

  let mu: number = 3 + Math.log2(x+1);
  let sigma: number = 2;

  let t: number = 12 * Math.max(0.5, mu + sigma * clamp(-2, Math.log(r2/(1-r2)) * 1.35, 2));

  return {
    timeToMaturity: t,
    returnMultiplier: x
  };
}

function generateOutcome(simulationParams: SimulationParameters): Outcome {
  const { moneyParams, timeParams, decisionParams, distributionParams } = simulationParams;

  const outcome: Outcome = [];
  let balance: number = moneyParams.portfolioValue;
  let unrealisedValue: number = moneyParams.portfolioValue;

  const investmentOpportunities: InvestmentOpportunity[] = []
  const activeInvestments: Set<Investment> = new Set();

  const investmentCount: number = decisionParams.reinvestEarning ? decisionParams.lastInvestmentTime as number * timeParams.investmentsPerYear : moneyParams.portfolioValue / moneyParams.investmentValue;

  for (let investmentNo = 0; investmentNo < investmentCount; investmentNo++) {
    const nextInvestment: InvestmentOpportunity = {
      investmentAmount: moneyParams.investmentValue,
      startTime: investmentNo / timeParams.investmentsPerYear * 12
    };
    investmentOpportunities.push(nextInvestment);
  }

  for (let month = 0; activeInvestments.size || investmentOpportunities.length; month++) {

    // Add the current balance to the outcome
    outcome.push({ realised: balance, unrealised: unrealisedValue });

    // Receive all matured investments
    for (const investment of activeInvestments) {
      if (investment.maturationTime <= month) {
        balance += investment.returnAmount;
        activeInvestments.delete(investment);
      }
    }

    // Take all investment opportunities possible up to the current time
    while (investmentOpportunities.length && investmentOpportunities[0].startTime <= month) {
      if (investmentOpportunities[0].investmentAmount <= balance) {
        balance -= investmentOpportunities[0].investmentAmount;
        unrealisedValue -= investmentOpportunities[0].investmentAmount;
        const generatedTimeAndReturn: TimeAndReturn = generateTimeAndReturn(distributionParams.die);
        const maturationTime = month + generatedTimeAndReturn.timeToMaturity;
        const returnAmount = investmentOpportunities[0].investmentAmount * generatedTimeAndReturn.returnMultiplier;
        unrealisedValue += returnAmount;
        activeInvestments.add({
          maturationTime: maturationTime,
          returnAmount: returnAmount
        });
      }
      investmentOpportunities.shift();
    }
  }
  outcome.push({ realised: balance, unrealised: unrealisedValue });

  return outcome;
}

export function generateOutcomes(simulationParams: SimulationParameters): Simulation {

  const simulation: Simulation = [];

  for (let i = 0; i < simulationParams.simulationCount; i++) {
    simulation.push(generateOutcome(simulationParams));
  }

  console.log(simulation.map(outcome => outcome.at(-1)).reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {}));

  return simulation;
}