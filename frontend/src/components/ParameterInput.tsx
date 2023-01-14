import { Card, Checkbox, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";

export function ParameterInput(props: {

}) {
  const [simulationOngoing, setSimulationOngoing] = useState<boolean>(false);
  const [timeStoppedn, setTimeStopped] = useState<boolean>(false);
  const [investmentsRemaining, setInvestmentsRemaining] = useState<number>(25);


  // simulation
  const [simulationCount, setSimulationCount] = useState<number>(1000);

  // portfolio
  const [portfolioValue, setPorFolioValue] = useState<number>(250000);
  const [investmentValue, setInvestmentValue] = useState<number>(10000);
  
  // time
  const [investmentsPerYear, setInvestmentsPerYear] = useState<number>(5);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(5);
  const [simulationsSpeed, setSimulationSpeed] = useState<number>(100);

  // investment decisions
  const [reinvestEarnings, setReinvestEarnings] = useState<boolean>(false);
  const [lastInvestmentTime, setLastInvestmentTime] = useState<number>(5);

  // die
  const [complexDieEnabled, setComplexDieEnabled] = useState<boolean>(false);
  const [sideCount, setSideCount] = useState<number>(10);
  const [simpleDieWinSide, setSimpleDieWinSide] = useState<number>(30);
  const [complexDieSides, setComplexDieSides] = useState<number[]>([0,0,0,1,1,1,1,2,4,20]);

  // coin toss
  const [coinTossEnabled, setCoinTossEnabled] = useState<boolean>(false);
  const [doubleWinProbability, setDoubleWinProbability] = useState<number>(0.5);
  const [winMultipliter, setWinMultiplier] = useState<number>(2);
  const [maxDoubleWins, setMaxDoubleWins] = useState<number>(8);
  const [extensionTime, setExtensionTime] = useState<number>(1);

  // Unrealized Value
  const [unrealisedValueEnabled, setUnrealisedValueEnabled] = useState<boolean>(true);
  
  // Display Markers
  const [displayMarkersEnabled, setDisplayMarkersEnabled] = useState<boolean>(true);
  const [displayMarkers, setDisplayMarkers] = useState<number[]>([.1,.25,.5,.75,.9]);

  return (
    <>
      <Card>
        <TextField 
          label="Simulation Count"
          value={simulationCount}
          onChange={(e) => setSimulationCount(parseInt(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
        />

        <TextField 
          label="PortfolioValue"
          value={portfolioValue}
          onChange={(e) => setPorFolioValue(parseInt(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
        />

        <TextField 
          label="Investment Value"
          value={investmentValue}
          onChange={(e) => setInvestmentValue(parseInt(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
        />

        <TextField 
          label="Investments Per Year"
          value={investmentsPerYear}
          onChange={(e) => setInvestmentsPerYear(parseInt(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
        />

        <TextField 
          label="Investment Period"
          value={investmentPeriod}
          onChange={(e) => setInvestmentPeriod(parseInt(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
        />

        // TODO: make this UI better
        <TextField 
          label="Simulation Speed"
          value={simulationsSpeed}
          onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
        />

        <Checkbox 
          checked={reinvestEarnings} 
          onChange={(e) => setReinvestEarnings(e.target.checked)} />

        {reinvestEarnings && 
          <TextField 
            label="Last Investment Time"
            value={lastInvestmentTime}
            onChange={(e) => setLastInvestmentTime(parseInt(e.target.value))}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
          />}

        <Checkbox 
          checked={coinTossEnabled} 
          onChange={(e) => setCoinTossEnabled(e.target.checked)} />

        {coinTossEnabled && 
          <>
            <TextField 
              label="Double Win Probability"
              value={doubleWinProbability}
              onChange={(e) => setDoubleWinProbability(parseInt(e.target.value))}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            />
            <TextField 
              label="Win Multiplier"
              value={winMultipliter}
              onChange={(e) => setWinMultiplier(parseInt(e.target.value))}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            />
            <TextField 
              label="Maximum Double Wins"
              value={maxDoubleWins}
              onChange={(e) => setMaxDoubleWins(parseInt(e.target.value))}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            />
            <TextField 
              label="Double Win Extension Time"
              value={extensionTime}
              onChange={(e) => setExtensionTime(parseInt(e.target.value))}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            />
          </>
        }

        <Checkbox 
          checked={unrealisedValueEnabled}
          onChange={(e) => setUnrealisedValueEnabled(e.target.checked)} />

        <Checkbox 
          checked={displayMarkersEnabled}
          onChange={(e) => setDisplayMarkersEnabled(e.target.checked)} />
                
      </Card>
    </>
  );
};