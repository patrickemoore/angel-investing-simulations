import React from "react";

import Plot from "react-plotly.js";

export default function Histogram(props) {
    const [data, setData] = React.useState([{
        x: props.data,  
        type: "histogram",
        xbins: {
            start: 0,
            size: 10000
        }}]
    );
    const [layout, setLayout] = React.useState({
        responsive: true,
        title: "Outcome Distribution",  
    });
    const [config, setConfig] = React.useState({});

    const handleDataChange = () => {
        setData();
    };

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
class Histogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                x: [36854, 22092, 15572, 48492, 22439, 10647, 34936, 19450, 4956, 91164, 50676, 37677, 86163, 42341, 94762, 34861, 6681, 82903, 41306, 87707, 69448, 26456, 53949, 69318, 58620, 91856, 56973, 49120, 35852, 50443, 17011, 95080, 68244, 60297, 99964, 12723, 73629, 82416, 37361, 30711, 95260, 67886, 23779, 91633, 36985, 66468, 56158, 16123, 71591, 97839],  
                type: "histogram",
                xbins: {
                    start: 0,
                    size: 10000
                }}],
            layout: {
                responsive: true,
                title: "Outcome Distribution",  
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

export default Histogram;
*/