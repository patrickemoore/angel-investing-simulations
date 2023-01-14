import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import Histogram from "./Histogram.js";
import TimeSeries from "./TimeSeries.js";

import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import Slider from "@mui/material/Slider";

import Heapify from "heapify";

export default function SimulationPanel() {

    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STATE DECLARATIONS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Die

    const [activeDie, setActiveDie] = React.useState(new Map());
    
    // Time Series Graph Data

    const [timeSeriesX, setTimeSeriesX] = React.useState([0, 1, 2, 3, 4, 5]);
    const [timeSeriesY, setTimeSeriesY] = React.useState([0, 1, 2, 3, 4, 5]); 

    // Die Settings

    const [useComplexDie, toggleComplexDie] = React.useState(false);
    const [dieSides, setDieSides] = React.useState(10);
    const [winMultiplier, setWinMultiplier] = React.useState(30);

    // Investment Settings

    const [portfolioValue, setPortfolioValue] = React.useState(250000);
    const [investmentValue, setInvestmentValue] = React.useState(10000);
    const [investmentsPerYear, setInvestmentsPerYear] = React.useState(5);

    // Coin Flip Settings

    const [coinFlipEnabled, toggleCoinFlipEnabled] = React.useState(false);
    const [coinFlipMultiplier, setCoinFlipMultiplier] = React.useState(2);
    const [coinFlipProbability, setCoinFlipProbability] = React.useState(0.5);
    const [coinFlipExtensionTime, setCoinFlipExtensionTime] = React.useState(1);
    const [coinFlipMaximumFlips, setCoinFlipMaximumFlips] = React.useState(8);

    // Re-Investment of Earnings Settings

    const [reInvestEarningsEnabled, toggleReInvestEarningsEnabled] = React.useState(true);
    const [reInvestEarningsLastTime, setReInvestEarningsLastTime] = React.useState(5);

    // Multi-Simulation Settings

    const [simulationCount, setSimulationCount] = React.useState(1); 

    // View Settings

    const [percentileMarkersEnabled, togglePercentileMarkersEnabled] = React.useState(true);
    const [simulationSpeed, setSimulationSpeed] = React.useState(1);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STATE CHANGES
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Die Settings

    const handleComplexDieToggle = () => toggleComplexDie(!useComplexDie);
    const handleDieSideChange = (e: any) => setDieSides(e.target.value);
    const handleWinMultiplierChange = (e: any) => setWinMultiplier(e.target.value);

    // Investment Settings

    

    // Coin Flip Settings

    const handleCoinFlipEnabledToggle = () => toggleCoinFlipEnabled(!coinFlipEnabled);
    const handleCoinFlipMultiplierChange = (e: any) => setCoinFlipMultiplier(e.target.value);
    const handleCoinFlipProbabilityChange = (e: any) => setCoinFlipProbability(e.target.value);
    const handleCoinFlipExtensionTimeChange = (e: any) => setCoinFlipExtensionTime(e.target.value);
    const handleCoinFlipMaximumFlipsChange = (e: any) => setCoinFlipMaximumFlips(e.target.value);

    // Re-Investment of Earnings Settings

    const handleReInvestEarningsEnabledToggle = () => toggleReInvestEarningsEnabled(!reInvestEarningsEnabled);
    const handleReInvestEarningsLastTimeChange = (e: any) => setReInvestEarningsLastTime(e.target.value);

    // Multi-Simulation Settings

    const handleSimulationCountChange = (e: any) => setSimulationCount(e.target.value);

    // View Settings

    const handlePercentileMarkersEnabledToggle = () => togglePercentileMarkersEnabled(!percentileMarkersEnabled);
    const handleSimulationSpeedChange = (e: any) => setSimulationSpeed(e.target.value);
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // SIMULATION
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    const clamp = (a, x, b) => {
        return Math.min(Math.max(x, a), b);
    };

    const generateTimeAndReturn = () => {
        // generate two random numbers (the percentile ranks of the x and t distributions respectively)

        const [r1, r2] = [Math.random(), Math.random()];

        var x = 0;

        // Calculate x via rounding down to the nearest percentile marker from r1

        for (let [key, value] of activeDie.entries()) {
            if (r1 >= key) {
                x = Math.max(x, value);
            }
        }

        // Calculate t via inverse CDF of N~(3 + log_2(x+1), 2^2) at r2 (approximated by the 1.35 * logit(r2))

        var mu = 3 + Math.log2(x+1);
        var sigma = 2;

        var t = 12 * Math.max(0.5, mu + sigma * clamp(-2, Math.log(r2/(1-r2)) * 1.35, 2));

        return {x, t};
    };

    const beginSimulations = () => {
        // Create the Die Distribution

        activeDie.clear();

        if (useComplexDie) {
            // INSERT COMPLEX DIE STUFF
        } else {
            activeDie.set(0.9);
        }

        // Complete all the simulations

        const pq = new Heapify();

        if (simulationCount == 1) {

            // Initiate all the future investment events

            var investmentCount;
            var balance = portfolioValue;

            if (reInvestEarningsEnabled) {
                investmentCount = reInvestEarningsLastTime * investmentsPerYear;
            } else {
                investmentCount = portfolioValue / investmentValue;
            }
            
            for (let i = 0; i < investmentCount; i++) {
                pq.push(-investmentValue, i * 12 / investmentsPerYear);
            }

            var event;
            var returnEvent;

            // progress through time

            for (let i = 0; pq.size(); i++) {

                // push balance to y of timeseries

                // INSERT HERE

                // deal with all scheduled investments/returns for the month

                while (pq.peekPriority() <= i) {
                    event = pq.pop();

                    if (balance + event >= 0) {
                        balance += event;

                        if (event == -investmentValue) {

                            returnEvent = generateTimeAndReturn();
                            pq.push(returnEvent.x * investmentValue, i + returnEvent.t);
                        }
                    }
                }
            }
            
        } else if (simulationCount > 1) {
            // initiate all the simulations
            for (let i = 1; i <= simulationCount; i++) {
                // advance forward in time
            }
        }

        

        // Push the results to the Time Series Graph


        // Push the results to the Histogram
    };
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UI LAYOUT
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div>
            <Grid
                container 
                spacing={2} 
                columns={13}
                direction="row"
                justifyContent="space-evenly"
                alignItems="stretch">
                <Grid item xs = {3}></Grid>
                <Grid item xs = {6}>
                    <Box
                        //</Grid>sx={{ p: 2, border: '4px solid blue'}}
                        >
                        <Typography 
                            variant="h2"
                            textAlign="center">
                            Investing Simulation Model  
                        </Typography> 
                    </Box>
                </Grid>
                <Grid item xs = {3}></Grid>
            </Grid>
            <Divider></Divider>         
            <br></br>       
            <Grid
                container 
                spacing={2} 
                columns={13}
                direction="row"
                justifyContent="space-evenly"
                alignItems="stretch">
                <Grid item xs = {3}>
                    <Card style={{height: '100%'}} elevation="3">
                        <Divider>
                            
                            <Typography 
                                variant="h4"
                                textAlign="center">
                                Returns  
                            </Typography> 
                        </Divider>
                        <FormControlLabel 
                            control={<Switch/>} 
                            label="Use Complex Die"
                            value={useComplexDie}
                            onChange={handleComplexDieToggle}
                        />
                        <Divider>Simple Die</Divider>
                        <TextField
                            fullWidth
                            type="number" 
                            label="Die Sides"
                            defaultValue="10"
                            margin="normal"
                            value={dieSides}
                            onChange={handleDieSideChange}>
                        </TextField>
                        <TextField
                            fullWidth
                            type="number" 
                            label="Win Multiplier" 
                            defaultValue="30"
                            margin="normal"
                            InputProps={{endAdornment: <InputAdornment position="end">times</InputAdornment>,}}
                            value={winMultiplier}
                            onChange={handleWinMultiplierChange}>
                        </TextField>
                        <FormControlLabel 
                            control={<Switch defaultChecked />} 
                            label="Enable Coin Flip"/>
                        <TextField 
                            fullWidth
                            type="number" 
                            label="Coin Flip Multiplier"
                            defaultValue="2"
                            margin="normal" 
                            InputProps={{endAdornment: <InputAdornment position="end">times</InputAdornment>,}}
                            value={coinFlipMultiplier}
                            onChange={handleCoinFlipMultiplierChange}>
                        </TextField>
                        
                        <TextField 
                            fullWidth
                            type="number" 
                            label="Coin Flip Probability"
                            defaultValue="0.5"
                            margin="normal"
                            value={coinFlipProbability}
                            onChange={handleCoinFlipProbabilityChange}>
                        </TextField>
                        <TextField 
                            fullWidth
                            type="number" 
                            label="Coin Flip Extension Time"
                            defaultValue="1"
                            margin="normal" 
                            InputProps={{endAdornment: <InputAdornment position="end">years</InputAdornment>,}}
                            value={coinFlipExtensionTime}
                            onChange={handleCoinFlipExtensionTimeChange}>
                        </TextField>
                        <TextField 
                            fullWidth
                            type="number" 
                            label="Maximum Coin Flips"
                            defaultValue="8"
                            margin="normal"
                            value={coinFlipMaximumFlips}
                            onChange={handleCoinFlipMaximumFlipsChange}>
                        </TextField>
                        <Divider>Complex Die</Divider>
                        <Slider
                            track={false}
                            aria-labelledby="track-false-range-slider"
                            defaultValue={[50, 90, 99]}
                            // INSERT SLIDER STATE
                        />
                
                    </Card>
                        
                </Grid>

                <Grid item xs = {3}>

                    <Card style={{height: '100%'}} elevation="3">

                        <Divider>
                                
                            <Typography 
                                variant="h4"
                                textAlign="center">
                                Investments
                            </Typography> 

                        </Divider>

                        <TextField 
                            fullWidth
                            type="number" 
                            label="Porfolio Value"
                            defaultValue="250000"
                            margin="normal" 
                            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}}>
                        </TextField>

                        <TextField 
                            fullWidth
                            type="number" 
                            label="Investment Value"
                            defaultValue="10000"
                            margin="normal" 
                            InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>,}}>
                        </TextField>

                        <TextField 
                            fullWidth
                            type="number" 
                            label="Investments per Year"
                            defaultValue="5" 
                            margin="normal" 
                            InputProps={{endAdornment: <InputAdornment position="end">per year</InputAdornment>,}}>
                        </TextField>

                    </Card>
                        
                </Grid>
                    
                    
                <Grid item xs = {3}>

                    <Card style={{height: '100%'}} elevation="3">

                        <Divider>
                                
                            <Typography 
                                variant="h4"
                                textAlign="center">
                                Re-Invest Earnings
                            </Typography> 

                        </Divider>

                        <FormControlLabel control={<Switch defaultChecked />} label="Reinvest Earnings" />

                        <TextField 
                            type="number" 
                            label="Last Investment Time"
                            defaultValue="5"
                            margin="normal" 
                            InputProps={{endAdornment: <InputAdornment position="end">years</InputAdornment>,}}
                            value={reInvestEarningsLastTime}
                            onChange={handleReInvestEarningsLastTimeChange}>
                        </TextField>

                    </Card>
                        
                </Grid>
                    
                <Grid item xs = {3}>

                    <Card style={{height: '100%'}} elevation="3">

                        <Divider>
                                
                            <Typography 
                                variant="h4"
                                textAlign="center">
                                View Settings
                            </Typography> 

                        </Divider>

                        <TextField 
                            type="number" 
                            label="Simulation Count"
                            defaultValue="1000"
                            margin="normal"
                            value={simulationCount}
                            onChange={handleSimulationCountChange}>
                        </TextField>

                        <FormControlLabel control={<Switch defaultChecked />} label="Show Percentile Markers" />

                        <TextField 
                            type="number"
                            label="Simulation Speed"
                            defaultValue="1"
                            margin="normal" 
                            InputProps={{endAdornment: <InputAdornment position="end">times</InputAdornment>,}}
                            value={simulationSpeed}
                            onChange={handleSimulationSpeedChange}>
                        </TextField>

                    </Card>
                        
                </Grid>

            </Grid>

            <Grid
                container 
                spacing={2} 
                columns={13}
                direction="row"
                justifyContent="space-evenly"
                alignItems="stretch">

                <Grid item xs = {3}>

                </Grid>

                <Grid item xs = {3}>

                </Grid>

                <Grid item xs = {3}>

                </Grid>
                    
                <Grid item xs = {3}>

                    <Button 
                        fullWidth
                        variant="contained"
                        onClick={beginSimulations}>
                        Simulate
                    </Button>

                </Grid>

            </Grid>

            <br></br>

            <Divider/>

            <br></br>

            <Grid container
                columns={13}
                justifyContent="space-evenly">

                <Grid item
                    xs={6}>

                    <Card style={{height: '100%'}} elevation="3">

                        <TimeSeries x={timeSeriesX} y={timeSeriesY}/>

                    </Card>

                </Grid>

                <Grid item
                    xs={6}>

                    <Card style={{height: '100%'}} elevation="3">

                        <Histogram data={[10, 20, 10000, 12000, 43000]}/>

                    </Card>

                </Grid>

            </Grid>

            <br></br>

            <Divider></Divider>

            <br></br>

            <Typography 
                variant="h5" 
                textAlign="center"
                >
                Created with Material UI by Patrick Moore
            </Typography>

            <br></br>

            <Divider></Divider>

        </div>
        
    );
}