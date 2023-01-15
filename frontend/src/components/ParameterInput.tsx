import { RocketLaunch } from "@mui/icons-material";
import { Backdrop, Box, Button, Card, Checkbox, Divider, FormControlLabel, Stack, Tab, Tabs, TextField } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { OutcomeGraph } from "./OutcomeGraph.tsx";
import { generateOutcomes } from "./utils/utils.tsx";

const SX_TEXT_FIELD = { width: 200 };

export function ParameterInput(props: {

}) {
  const [loading, setLoading] = useState(false);
  const [timeStopped, setTimeStopped] = useState(false);
  const [investmentsRemaining, setInvestmentsRemaining] = useState(25);

  // simulation
  const [simulationCount, setSimulationCount] = useState<number | string>(100000);

  // portfolio
  const [portfolioValue, setPortFolioValue] = useState<number | string>(250000);
  const [investmentValue, setInvestmentValue] = useState<number | string>(10000);
  
  // time
  const [investmentsPerYear, setInvestmentsPerYear] = useState<number | string>(5);
  const [investmentPeriod, setInvestmentPeriod] = useState<number | string>(5);

  // investment decisions
  const [reinvestEarnings, setReinvestEarnings] = useState<boolean>(false);
  const [lastInvestmentTime, setLastInvestmentTime] = useState<number | string>(5);

  // die
  const [sideCount, setSideCount] = useState<number | string>(10);
  const [simpleDieWinSide, setSimpleDieWinSide] = useState<number | string>(30);
  const [complexDieSides, setComplexDieSides] = useState<(number | string)[]>([0,0,0,1,1,1,1,2,4,20]);

  // coin toss
  const [coinTossEnabled, setCoinTossEnabled] = useState<boolean>(false);
  const [doubleWinProbability, setDoubleWinProbability] = useState<number | string>(0.5);
  const [winMultipliter, setWinMultiplier] = useState<number | string>(2);
  const [maxDoubleWins, setMaxDoubleWins] = useState<number | string>(8);
  const [extensionTime, setExtensionTime] = useState<number | string>(1);

  const [dieTab, setDieTab] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setDieTab(newValue);
  };

  const complexDieEnabled = useMemo(() => {
    return dieTab === 1;
  }, [dieTab]);
  
  const activeDie = useMemo(() => {
    return complexDieEnabled ? new Map(complexDieSides.map((side, index) => [index / complexDieSides.length, side])) : new Map([[1 - (1 / (sideCount as number)), simpleDieWinSide as number]]);
  }, [complexDieEnabled, complexDieSides, simpleDieWinSide, sideCount]);

  const simulationParams: SimulationParameters = useMemo(() => {
    return {
      simulationCount: simulationCount as number,
      distributionParams: {
        die: activeDie
      },
      timeParams: {
        investmentsPerYear: investmentsPerYear as number,
        investmentPeriod: investmentPeriod as number,
      },
      moneyParams: {
        portfolioValue: portfolioValue as number,
        investmentValue: investmentValue as number,
      },
      decisionParams: {
        reinvestEarning: reinvestEarnings,
        lastInvestmentTime: reinvestEarnings ? lastInvestmentTime as number : undefined
      }
    };
  }, [
    simulationCount,
    activeDie,
    investmentsPerYear,
    investmentPeriod,
    portfolioValue,
    investmentValue,
    reinvestEarnings,
    lastInvestmentTime
  ]);

  const [simulation, setSimulation] = useState<Simulation | undefined>(undefined);

  const onSubmit = useCallback(() => {
    setLoading(true);

    setSimulation(generateOutcomes(simulationParams));

    setLoading(false);

  }, [simulationCount, setLoading]);

  return (
    <>
      <Card sx={{p: 3}}>

        <TextField 
          label="Simulation Count"
          value={simulationCount}
          onChange={(e) => setSimulationCount(e.target.value)}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
          sx={SX_TEXT_FIELD}
          size="small"
        />

        <Stack direction="column" spacing={2}>
          <TextField 
            label="PortfolioValue"
            value={portfolioValue}
            onChange={(e) => setPortFolioValue(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            sx={SX_TEXT_FIELD}
            size="small"
          />

          <TextField 
            label="Investment Value"
            value={investmentValue}
            onChange={(e) => setInvestmentValue(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            sx={SX_TEXT_FIELD}
            size="small"
          />
        </Stack>
        <br />

        <Stack direction="column" spacing={2}>  
          <TextField 
            label="Investments Per Year"
            value={investmentsPerYear}
            onChange={(e) => setInvestmentsPerYear(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            sx={SX_TEXT_FIELD}
            size="small"
          />

          <TextField 
            label="Investment Period"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
            sx={SX_TEXT_FIELD}
            size="small"
          />
        </Stack>

        <Stack direction="column" spacing={2}>  
          <FormControlLabel control={<Checkbox 
            checked={reinvestEarnings} 
            onChange={(e) => setReinvestEarnings(e.target.checked)} />} label="Reinvest Earnings" />

          {reinvestEarnings && 
            <TextField 
              label="Last Investment Time"
              value={lastInvestmentTime}
              onChange={(e) => setLastInvestmentTime(e.target.value)}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
              sx={SX_TEXT_FIELD}
              size="small"
            />}
        </Stack>

        <Box>
          <Box>
            <Tabs value={dieTab} onChange={handleChange} sx={{ borderBottom: 1, borderColor: 'divider' }} >
              <Tab value={0} label="Simple Die" />
              <Tab value={1} label="Complex Die" />
            </Tabs>
          </Box>
          <Box sx={{mt: 5}}>
            {dieTab === 0 &&
              <Stack direction="column" spacing={2}>

              <TextField 
                label="Side Count"
                value={sideCount}
                onChange={(e) => setSideCount(e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                sx={SX_TEXT_FIELD}
                size="small"
              />

              <TextField 
                label="Win Side Multiplier"
                value={simpleDieWinSide}
                onChange={(e) => setSimpleDieWinSide(e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                sx={SX_TEXT_FIELD}
                size="small"
              />

              <FormControlLabel control={<Checkbox 
                checked={coinTossEnabled} 
                onChange={(e) => setCoinTossEnabled(e.target.checked)} />} label="Enable Coin Toss" />

              {coinTossEnabled && 
                <>
                  <TextField 
                    label="Double Win Probability"
                    value={doubleWinProbability}
                    onChange={(e) => setDoubleWinProbability(e.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    sx={SX_TEXT_FIELD}
                    size="small"
                  />
                  <TextField 
                    label="Win Multiplier"
                    value={winMultipliter}
                    onChange={(e) => setWinMultiplier(e.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    sx={SX_TEXT_FIELD}
                    size="small"
                  />
                  <TextField 
                    label="Maximum Double Wins"
                    value={maxDoubleWins}
                    onChange={(e) => setMaxDoubleWins(e.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    sx={SX_TEXT_FIELD}
                    size="small"
                  />
                  <TextField 
                    label="Double Win Extension Time"
                    value={extensionTime}
                    onChange={(e) => setExtensionTime(e.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    sx={SX_TEXT_FIELD}
                    size="small"
                  />
                </>
              }
              </Stack>}
            {dieTab === 1 && 
              <Stack direction="row">
                {complexDieSides.map((value, index) => {
                  return (
                    <TextField 
                      value={complexDieSides[index]}
                      onChange={(e) => setComplexDieSides([...complexDieSides.slice(0,index), e.target.value, ...complexDieSides.slice(index + 1)])}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                      sx={{width: 50}}
                      size="small"
                    />
                  );
                })}
              </Stack>
            }
          </Box>
        </Box>

        <Button variant="contained" onClick={onSubmit} endIcon={<RocketLaunch />} disabled={loading}>
          Generate Outcomes
        </Button>

        <OutcomeGraph simulation={undefined} />    
      </Card>
    </>
  );
};