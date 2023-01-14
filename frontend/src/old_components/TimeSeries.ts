import React, {Component} from "react";

import Plot from "react-plotly.js";

export default function TimeSeries(props) {
    const [data, setData] = React.useState([{
        x: props.x,
        y: props.y,  
        type: "line",
        xbins: {
            start: 0,
            size: 10000
        }}]
    );
    const [layout, setLayout] = React.useState({
        responsive: true,
        title: "Portfolio Values",  
    });
    const [config, setConfig] = React.useState({});
    return (
        <>
            <Plot
                data={data}
                layout={layout}
                onInitialized={(figure) => this.setState(figure)}
                onUpdate={(figure) => this.setState(figure)}>
            </Plot>
        </>
    );
}

/*
class TimeSeries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                x: [0,1,2,3,4,5],
                y: [0,1,2,3,4,5],  
                type: "line",
                xbins: {
                    start: 0,
                    size: 10000
                }}],
            layout: {
                responsive: true,
                title: "Portfolio Values",  
            },
            config: {}
        }
    }

    render() {
        return (
            <Plot
                data={this.state.data}
                layout={this.state.layout}
                onInitialized={(figure) => this.setState(figure)}
                onUpdate={(figure) => this.setState(figure)}>
            </Plot>
        );
    }
} 

export default TimeSeries;
*/