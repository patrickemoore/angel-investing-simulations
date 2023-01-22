import { ArrowDropDown, RocketLaunch } from "@mui/icons-material";
import { Backdrop, Box, Button, ButtonGroup, Card, Checkbox, ClickAwayListener, Divider, FormControlLabel, Grow, InputAdornment, MenuItem, MenuList, Paper, Popper, Stack, Tab, Tabs, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { OutcomeGraph } from "./OutcomeGraph.tsx";
import { generateOutcomes } from "./utils/utils.tsx";

const SX_TEXT_FIELD = { width: 200 };
const options = [1, 10, 20, 50, 100, 1000];
const MAX_DOUBLE_WINS = 6;

export function ParameterInput(props: {

}) {
  const [loading, setLoading] = useState(false);
  const [timeStopped, setTimeStopped] = useState(false);
  const [investmentsRemaining, setInvestmentsRemaining] = useState(25);

  // portfolio
  const [portfolioValue, setPortFolioValue] = useState<number | string>(250000);
  const [investmentValue, setInvestmentValue] = useState<number | string>(10000);
  
  // time
  const [investmentsPerYear, setInvestmentsPerYear] = useState<number | string>(5);

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

  const [dieTab, setDieTab] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setDieTab(newValue);
  };

  const complexDieEnabled = useMemo(() => {
    return dieTab === 1;
  }, [dieTab]);
  
  const activeDie = useMemo(() => {

    if (complexDieEnabled) {
      return new Map(complexDieSides.map((side, index) => [index / complexDieSides.length, side]));
    }

    if (coinTossEnabled) {
      return new Map([...Array(3).keys()].map(toss => {
        return [
          1 - (1 / (sideCount as number)) * (1 / (doubleWinProbability as number)) ** (-toss),
          (simpleDieWinSide as number) * (winMultipliter as number) ** toss
        ];
      }));
    }

    return new Map([[1 - (1 / (sideCount as number)), simpleDieWinSide as number]]);
    /*

    return complexDieEnabled ? (
     ) : (
      new Map([...Array(3).keys()].map(toss => {
        return [
          1 - (1 / (sideCount as number)) * (1 / (doubleWinProbability as number)) ** (-toss),
          (simpleDieWinSide as number) * (winMultipliter as number) ** toss
        ];
      }))
      // new Map([[1 - (1 / (sideCount as number)), simpleDieWinSide as number]])
     );
     */
  }, [
    complexDieEnabled,
    complexDieSides,
    simpleDieWinSide,
    sideCount,
    coinTossEnabled,
    doubleWinProbability,
    winMultipliter
  ]);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const simulationCount = useMemo(() => options[selectedIndex], [options, selectedIndex]);

  const simulationParams: SimulationParameters = useMemo(() => {
    return {
      simulationCount: simulationCount as number,
      distributionParams: {
        die: activeDie
      },
      timeParams: {
        investmentsPerYear: investmentsPerYear as number,
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

  }, [simulationParams, setLoading]);

  return (
    <>
      <Card sx={{p: 3}}>
        <Grid2 container columns={4}>
          <Grid2 xs="auto">
            <Card sx={{width: 250}}>
              <Box sx={{m: 2}}>
                <Stack direction="column" spacing={2}>
                  <TextField 
                    label="Portfolio Value"
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

                  <TextField 
                    label="Investment Frequency"
                    value={investmentsPerYear}
                    onChange={(e) => setInvestmentsPerYear(e.target.value)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                    sx={SX_TEXT_FIELD}
                    size="small"
                    InputProps={{endAdornment: <InputAdornment position="end">per year</InputAdornment>}}
                    InputLabelProps={{ shrink: true }}
                  />

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
                      InputProps={{endAdornment: <InputAdornment position="end">years</InputAdornment>}}
                      InputLabelProps={{ shrink: true }}
                    />}
                </Stack>
              </Box>

            </Card>


            <Card sx={{width: 250}}>
              <Box>
                <Tabs value={dieTab} onChange={handleChange} sx={{ borderBottom: 1, borderColor: 'divider' }} >
                  <Tab value={0} label="Simple Die" />
                  <Tab value={1} label="Complex Die" />
                </Tabs>
              </Box>
              <Box sx={{m: 2}}>
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
                        fullWidth
                      />
                      <TextField 
                        label="Win Multiplier"
                        value={winMultipliter}
                        onChange={(e) => setWinMultiplier(e.target.value)}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                        sx={SX_TEXT_FIELD}
                        size="small"
                      />
                    </>
                  }
                  </Stack>}
                {dieTab === 1 && 
                  <Grid2 container>
                    {complexDieSides.map((value, index) => {
                      return (
                        <Grid2  >
                          <TextField 
                            value={complexDieSides[index]}
                            onChange={(e) => setComplexDieSides([...complexDieSides.slice(0,index), e.target.value, ...complexDieSides.slice(index + 1)])}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*'}}
                            sx={{width: 50}}
                            size="small"
                          />
                        </Grid2>
                        
                      );
                    })}
                  </Grid2>
                }
              </Box>
            </Card>

            <ButtonGroup variant="contained" ref={anchorRef} size="small">
              <Button 
                onClick={onSubmit}
                endIcon={<RocketLaunch />}>Generate {options[selectedIndex]} outcome{options[selectedIndex] > 1 ? "s" : ""}</Button>
              <Button
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDown />
              </Button>
            </ButtonGroup>
            <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          Generate {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid2>
        <Grid2 xs={3}>

          <OutcomeGraph simulation={simulation} />    

        </Grid2>

        </Grid2>
      
      </Card>
    </>
  );
};