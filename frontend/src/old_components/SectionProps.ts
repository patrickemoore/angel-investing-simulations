const SectionProps = [
  /*{
      // Defaults
      id: 0,
      sectionTitle: "Defaults",
      sectionInfo: "Insert info here",

      // Simulation
      simulationCount: 1000,

      // Portfolio
      portfolioValue: 250000,
      investmentCount: 25,

      // Time
      investmentsPerYear: 5,
      investmentPeriod: 5,
      simulationSpeed: 10,

      // Investment Decision
      reInvestEarnings: false,
      lastInvestmentTime: 5,

      // Die
      complexDieEnabled: true,
      sideCount: 10,
      simpleDieWinSide: 30,
      complexDieSides: [0,0,0,1,1,1,1,2,4,20],

      // Coin Toss
      coinTossEnabled: true,
      doubleWinProbability: 0.5,
      winMultiplier: 2,
      maxDoubleWins: 8,
      extensionTime: 1,
      
      // Unrealised Value
      unrealisedValueEnabled: true,

      // Display Markers
      displayMarkersEnabled: true,
      displayMarkers: [.1,.25,.5,.75,.9],

  },*/
  {
      id: 1,
      sectionTitle: "Single 10-sided die",
      sectionInfo: "Insert info here",

      simulationCount: 1,
      investmentCount: 1,
      complexDieEnabled: false,

  },
  {
      id: 2,
      sectionTitle: "Portfolio",
      sectionInfo: "Insert info here",

  },
  {
      id: 3,
      sectionTitle: "Complex Die",
      sectionInfo: "Insert info here",

      
  },
  {
      id: 4,
      sectionTitle: "Full simulation",
      sectionInfo: "Insert info here",


  },
  {
      id: 5,
      sectionTitle: "10-sided die with coin",
      sectionInfo: "Insert info here",

  },
  {
      id: 6,
      sectionTitle: "Staggered Investments",
      sectionInfo: "Insert info here",

  },
  {
      id: 7,
      sectionTitle: "Investment Decisions",
      sectionInfo: "Insert info here",

  }
]

export default SectionProps;