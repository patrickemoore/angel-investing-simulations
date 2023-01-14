import React, { Component } from "react";
import FormItem from "../Old_Components/FormItem";
import "../style.css";
import BalanceGraph from "../Old_Components/BalanceGraph";

class Simulation extends Component {
    constructor() {
        super();
        this.state = {

            simulationOngoing: false,
            timeStopped: false,
            investmentsRemaining: 25,

            // Parameters

            // Simulation
            simulationCount: 1000,

            // Portfolio
            portfolioValue: 250000,
            investmentValue: 10000,

            // Time
            investmentsPerYear: 5,
            investmentPeriod: 5,
            simulationSpeed: 100,

            // Investment Decision
            reInvestEarnings: false,
            lastInvestmentTime: 5,

            // Die
            complexDieEnabled: false,
            sideCount: 10,
            simpleDieWinSide: 30,
            complexDieSides: [0,0,0,1,1,1,1,2,4,20],

            // Coin Toss
            coinTossEnabled: false,  
            doubleWinProbability: 0.5,
            winMultiplier: 2,
            maxDoubleWins: 8,
            extensionTime: 1,
            
            // Unrealised Value
            unrealisedValueEnabled: true,

            // Display Markers
            displayMarkersEnabled: true,
            displayMarkers: [.1,.25,.5,.75,.9],
        };
        this.graphData = [];
        this.defaultDies = [new Map(), new Map()];
        this.activeDie = new Map();

        this.defaultDies[0].set(0.9, 30);

        this.defaultDies[1].set(0.3, 1);
        this.defaultDies[1].set(0.7, 2);
        this.defaultDies[1].set(0.8, 4);
        this.defaultDies[1].set(0.9, 20);
        this.activeDie = new Map(this.defaultDies[0]);

        this.handleChange = this.handleChange.bind(this);
        this.startSimulation = this.startSimulation.bind(this);
        this.startTime = this.startTime.bind(this);
        this.invest = this.invest.bind(this);
        this.endInvestment = this.endInvestment.bind(this);
        this.investmentTimer = this.investmentTimer.bind(this);
        this.conductMultipleSimulations = this.conductMultipleSimulations.bind(this);
        this.generateTimeAndReturn = this.generateTimeAndReturn.bind(this);
    }

    componentDidMount() {
        if (this.props.id < 6) {
            this.setState({
                investmentsPerYear: 10000
            });
        }
    }

    handleChange(event) {
        if (!this.state.simulationOngoing) {
            const {name, value} = event.target;
            this.setState({
                [name]: value
            });
        }
    }

    clamp(a, x, b) {
        return Math.min(Math.max(x, a), b);
    }

    // Generation of investment return multiplier and time

    generateTimeAndReturn() {

        // generate two random numbers (the percentile ranks of the x and t distributions respectively)

        const [r1, r2] = [Math.random(), Math.random()];

        var x = 0;

        // Calculate x via rounding down to the nearest percentile marker from r1

        for (let [key, value] of this.activeDie.entries()) {
            if (r1 >= key) {
                x = Math.max(x, value);
            }
        }

        // Calculate t via inverse CDF of N~(3 + log_2(x+1), 2^2) at r2 (approximated by the 1.35 * logit(r2))

        var mu = 3 + Math.log2(x+1);
        var sigma = 2;

        var t = 12 * Math.max(0.5, mu + sigma * this.clamp(-2, Math.log(r2/(1-r2)) * 1.35, 2));

        return {x, t};
    }

    startTime() {
        this.monthlyBalances.push(this.balance);
        var d = new Date();
        d.setTime(d.getTime() + this.t * 2629800000);
        this.graphData[this.graphData.length-1].dataPoints.push({
            x: d,
            y: this.balance
        });
        this.t++;
        this.forceUpdate();
        console.log(this.t, this.endingTime);
        if (this.t < this.endingTime) {
            setTimeout(this.startTime, 1000 / this.state.simulationSpeed);
        } else {
            this.simulationOngoing = false;
        }
    }

    endInvestment(timesEnded, rolledSide, investmentValue) {        
        //console.log("Investment ended with value " + investmentValue);       
        if (this.state.coinTossEnabled && rolledSide === this.state.sideCount-1 && timesEnded < this.state.maxDoubleWins && Math.random() < this.state.doubleWinProbability) {
            //console.log("Extended by a year!");
            this.endingTime = Math.max(this.endingTime, this.t + 12 * this.state.extensionTime);
            setTimeout(() => {this.endInvestment(timesEnded+1, rolledSide, investmentValue * this.state.winMultiplier)}, 12000 * this.state.extensionTime / this.state.simulationSpeed);
        } else {
            this.balance += investmentValue;
        }
    }

    invest() {
        //console.log("Invested!");

        var investmentValue = this.state.investmentValue;
        this.balance -= investmentValue;
        this.investmentsRemaining--;

        var rolledSide = Math.floor(Math.random() * this.state.sideCount);
        if (this.state.complexDieEnabled) {
            investmentValue = this.state.complexDieSides[rolledSide] * investmentValue;
        } else {
            investmentValue = (rolledSide === this.state.sideCount-1) ? investmentValue * this.state.simpleDieWinSide : 0;
        }
        //console.log(rolledSide, investmentValue, this.investmentsRemaining);
        this.endingTime = Math.max(this.endingTime, this.t + 12 * this.state.investmentPeriod);
        setTimeout(() => {this.endInvestment(0, rolledSide, investmentValue)}, 12000 / this.state.simulationSpeed * this.state.investmentPeriod);
    }   
    
    investmentTimer() {
        if (this.balance >= this.state.investmentValue) {
            this.invest();
        }
        if (!this.timeStopped && (this.state.reInvestEarnings ? this.t <= this.state.lastInvestmentTime * 12 : this.investmentsRemaining > 0)) {
            setTimeout(() => this.investmentTimer(), (this.state.id < 6 ? 0 : 12000 / this.state.simulationSpeed / this.state.investmentsPerYear));
        }
    }
    
    componentWillUnmount() {
        this.setState({
            timeStopped: true
        })
    }

    startSimulation() {
        if (this.simulationOngoing) {
            setTimeout(() => this.startSimulation(), 1000);
        }
        this.simulationOngoing = true;

        this.t = 0;
        this.endingTime = 12;
        this.balance = this.state.portfolioValue;
        this.graphData.push({type: "line", dataPoints: []});
        this.investmentsRemaining = Math.floor(this.state.portfolioValue / this.state.investmentValue);

        this.startTime();
        this.investmentTimer();
    }

    async conductMultipleSimulations() {
        for (var i = 0; i < this.state.simulationCount; i++) {
            this.startSimulation();
        }
    }

    render() {
        var formList = [];
        if (this.props.id >= 1) {

            formList.push(
                <FormItem
                    id={1} 
                    displayName="Portfolio Value" 
                    name="portfolioValue" 
                    value={this.state.portfolioValue} 
                    handleChange={this.handleChange}
                />
            );
            
            formList.push(
                <FormItem
                    id={2} 
                    displayName="Investment Period" 
                    name="investmentPeriod" 
                    value={this.state.investmentPeriod} 
                    handleChange={this.handleChange}
                />
            );

            formList.push(
                <FormItem
                    id={3} 
                    displayName="Win Value" 
                    name="simpleDieWinSide" 
                    value={this.state.simpleDieWinSide} 
                    handleChange={this.handleChange}
                />
            );

            formList.push(
                <FormItem
                    id={4} 
                    displayName="Simulation Speed" 
                    name="simulationSpeed" 
                    value={this.state.simulationSpeed} 
                    handleChange={this.handleChange}
                />
            );
        }
        if (this.props.id >= 2) {
            formList.push(
                <FormItem
                    id={5} 
                    displayName="Investment Value" 
                    name="investmentValue" 
                    value={this.state.investmentValue} 
                    handleChange={this.handleChange}
                />
            );
        }
        if (this.props.id >= 3) {
            formList.push(
                <FormItem
                    id={6} 
                    displayName="Use Complex Die" 
                    name="complexDieEnabled" 
                    value={this.state.complexDieEnabled}
                    type="checkbox"
                    handleChange={this.handleChange}
                />
            );

            formList.push(
                <FormItem
                    id={7} 
                    displayName="Die Side Count" 
                    name="sideCount" 
                    value={this.state.sideCount} 
                    handleChange={this.handleChange}
                />
            );

            // Complex Die Sides
        }
        if (this.props.id >= 4) {

            formList.push(
                <FormItem
                    id={8} 
                    displayName="Show Outcome Markers" 
                    name="displayMarkersEnabled" 
                    value={this.state.displayMarkersEnabled}
                    type="checkbox"
                    handleChange={this.handleChange}
                />
            );

            formList.push(
                <FormItem
                    id={9} 
                    displayName="Simulation Count" 
                    name="simulationCount" 
                    value={this.state.simulationCount} 
                    handleChange={this.handleChange}
                />
            );
        }
        if (this.props.id >= 5) {

            formList.push(
                <FormItem
                    id={10} 
                    displayName="Enable Coin Toss" 
                    name="coinTossEnabled" 
                    value={this.state.coinTossEnabled}
                    type="checkbox"
                    handleChange={this.handleChange}
                />
            );

            formList.push(
                <FormItem
                    id={11} 
                    displayName="Double Win Probability" 
                    name="doubleWinProbability" 
                    value={this.state.doubleWinProbability} 
                    handleChange={this.handleChange}
                />
            );
            formList.push(
                <FormItem
                    id={12} 
                    displayName="Win Multiplier" 
                    name="winMultiplier" 
                    value={this.state.winMultiplier} 
                    handleChange={this.handleChange}
                />
            );
            formList.push(
                <FormItem
                    id={13} 
                    displayName="Maximum Double Wins" 
                    name="maxDoubleWins" 
                    value={this.state.maxDoubleWins} 
                    handleChange={this.handleChange}
                />
            );
            formList.push(
                <FormItem
                    id={14} 
                    displayName="Extension Time" 
                    name="extensionTime" 
                    value={this.state.extensionTime} 
                    handleChange={this.handleChange}
                />
            );
        }
        if (this.props.id >= 6) {
            formList.push(
                <FormItem
                    id={15} 
                    displayName="Investments Per Year" 
                    name="investmentsPerYear" 
                    value={this.state.investmentsPerYear} 
                    handleChange={this.handleChange}
                />
            );
        }
        if (this.props.id >= 7) {

            formList.push(
                <FormItem
                    id={16} 
                    displayName="Re-Invest Earnings" 
                    name="reInvestEarnings" 
                    value={this.state.reInvestEarnings}
                    type="checkbox"
                    handleChange={this.handleChange}
                />
            );

            formList.push(
                <FormItem
                    id={17} 
                    displayName="Last Investment Time" 
                    name="lastInvestmentTime" 
                    value={this.state.lastInvestmentTime} 
                    handleChange={this.handleChange}
                />
            );
        }

        this.monthlyBalances = [];


        return (
            <div> 
                {formList}
                <button onClick={this.startSimulation}>{this.state.simulationOngoing ? "Simulation Ongoing" : "Simulate!"}</button>
                <p>{this.t}</p>
                <p>Current Balance: {this.balance}</p>
                <p>Monthly Balances: {this.monthlyBalances.map((balance) => <li>{balance}</li>)}</p>
                <BalanceGraph data={this.graphData}/>
            </div>
        )
    }
}

export default Simulation;