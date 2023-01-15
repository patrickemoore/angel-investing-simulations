import { Box, Card, Checkbox, FormControlLabel, IconButton, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { AutoGraph, Pause, PlayArrow, SkipNext, SkipPrevious, SsidChart } from "@mui/icons-material";
import React, { useCallback, useState } from "react";

const DISPLAY_MARKERS: number[] = [0.1, 0.25, 0.5, 0.75, 0.9];

export function OutcomeGraph(props: {
  simulation: Simulation
}) {

  const { simulation } = props;

  const [time, setTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  const [unrealisedValueEnabled, setUnrealisedValueEnabled] = useState<boolean>(true);
  const [displayMarkersEnabled, setDisplayMarkersEnabled] = useState<boolean>(true);

  const toggleUnrealisedValueEnabled = useCallback(() => 
    setUnrealisedValueEnabled(!unrealisedValueEnabled)
  , [setUnrealisedValueEnabled, unrealisedValueEnabled]
  );

  const toggleDisplayMarkersEnabled = useCallback(() => 
    setDisplayMarkersEnabled(!displayMarkersEnabled)
  , [setDisplayMarkersEnabled, displayMarkersEnabled]
  );

  return (
    <>
      <Card sx={{mt: 10}}>
        <Stack>
          <Box>
            INSERT GRAPH HERE
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