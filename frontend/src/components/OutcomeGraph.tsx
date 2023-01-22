import { Box, Card, IconButton, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { AutoGraph, Pause, PlayArrow, SkipNext, SkipPrevious, SsidChart } from "@mui/icons-material";
import React, { useCallback, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { clamp } from "./utils/utils.tsx";

const DISPLAY_MARKERS: number[] = [0.1, 0.5, 0.75, 0.9];

const GRAPH_LAYOUT = {
  responsive: true,
  title: "Portfolio Values",
  autosize: true,
  width: 1200,
  height: 700
};

function makeExtendedSimulation(simulation: Simulation | undefined): Simulation | undefined {

  if (simulation === undefined) {
    return undefined;
  }

  const longestOutcome: number = Math.max(...simulation.map(outcome => outcome.length));
  return simulation.map((outcome) => {
    return [...Array(longestOutcome).keys()].map((portfolioState, month) =>
      outcome[Math.min(outcome.length - 1, month)])
  });
}

function makeMarkerGraphs(simulation: Simulation): PortfolioState[][] | undefined {

  if (simulation === undefined) {
    return undefined;
  }

  const simulationCount = simulation.length;

  const simulationByTime: PortfolioState[][] = simulation[0].map((_, month) => {
    return simulation.map(outcome => outcome[month]);
  });

  const sortedByBalance: PortfolioState[][] = simulationByTime.map((month) => {
    return month.sort(function(a, b){return a.realised - b.realised});
  });

  const markerGraphs = DISPLAY_MARKERS.map(marker => {
    return sortedByBalance.map((month) => {
      return month[Math.floor(clamp(0, marker * simulationCount, simulationCount - 1))];
    })
  });

  console.log(markerGraphs)

  return markerGraphs;
};

export function OutcomeGraph(props: {
  simulation: Simulation
}) {

  const { simulation } = props;

  const [time, setTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  const [unrealisedValueEnabled, setUnrealisedValueEnabled] = useState<boolean>(false);
  const [displayMarkersEnabled, setDisplayMarkersEnabled] = useState<boolean>(false);

  const toggleUnrealisedValueEnabled = useCallback(() => 
    setUnrealisedValueEnabled(!unrealisedValueEnabled)
  , [setUnrealisedValueEnabled, unrealisedValueEnabled]
  );

  const toggleDisplayMarkersEnabled = useCallback(() => 
    setDisplayMarkersEnabled(!displayMarkersEnabled)
  , [setDisplayMarkersEnabled, displayMarkersEnabled]
  );

  const extendedSimulation = useMemo(() => makeExtendedSimulation(simulation), [simulation]);

  const markerGraphs = useMemo(() => makeMarkerGraphs(extendedSimulation), [extendedSimulation]);

  const simulationPlotlyGraphs = useMemo(() => {
    return extendedSimulation?.map(outcome => {
      return {
        x: outcome.map((_, i) => i),
        y: outcome.map(portfolioState => portfolioState.realised),
        type: "scatter",
        mode: "lines",
        marker: { color: "orange" },
        showlegend: false
      }
    });
  }, [extendedSimulation]);

  const unrealisedPlotlyGraphs = useMemo(() => {
    return extendedSimulation?.map(outcome => {
      return {
        x: outcome.map((_, i) => i),
        y: outcome.map(portfolioState => portfolioState.unrealised),
        type: "scatter",
        mode: "lines",
        marker: { color: "green" },
        showlegend: false
      }
    });
  }, [extendedSimulation]);

  const markerPlotlyGraphs = useMemo(() => {
    return markerGraphs?.map(outcome => {
      return {
        x: outcome.map((_, i) => i),
        y: outcome.map(portfolioState => portfolioState.realised),
        type: "scatter",
        mode: "lines",
        marker: { color: "blue" },
        showlegend: false
      };
    });
  }, [markerGraphs]);

  const plotlyData = useMemo(() => {

    let graphsToDisplay: any[] = [];

    if (true) {
      graphsToDisplay = graphsToDisplay.concat(simulationPlotlyGraphs)
    }
    if (unrealisedValueEnabled) {
      graphsToDisplay = graphsToDisplay.concat(unrealisedPlotlyGraphs);
    }
    if (displayMarkersEnabled) {
      graphsToDisplay = graphsToDisplay.concat(markerPlotlyGraphs);
    }

    return graphsToDisplay;
  }, [simulationPlotlyGraphs, displayMarkersEnabled, markerPlotlyGraphs, unrealisedValueEnabled, unrealisedPlotlyGraphs]);

  return (
    <>
      <Card>
        <Stack>
          <Box>
            <Plot data={plotlyData} layout={GRAPH_LAYOUT}>

            </Plot>
          </Box>
          <Stack direction="row" alignItems="center">
            <Box>
              <IconButton>
                <SkipPrevious />
              </IconButton>
              <IconButton onClick={() => setPlaying(!playing)}>
                {playing ? <PlayArrow /> : <Pause />}
              </IconButton>
              <IconButton>
                <SkipNext />
              </IconButton>
              <Select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(e.target.value as number)}
                size="small">
                {[1, 2, 5, 10, 100].map((speedChoice) => {
                  return <MenuItem value={speedChoice}>{speedChoice}x</MenuItem>;
                })}
              </Select>
            </Box>

            <Box>
              <Tooltip title={unrealisedValueEnabled ? "Hide unrealised value" : "Show unrealised value"}>
                <IconButton onClick={toggleUnrealisedValueEnabled}>
                  <AutoGraph color={unrealisedValueEnabled ? "action" : "disabled"}/>
                </IconButton>
              </Tooltip>

              <Tooltip title={displayMarkersEnabled ? "Hide display markers" : "Show display markers"}>
                <IconButton onClick={toggleDisplayMarkersEnabled}>
                  <SsidChart color={displayMarkersEnabled ? "action" : "disabled"}/>
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}