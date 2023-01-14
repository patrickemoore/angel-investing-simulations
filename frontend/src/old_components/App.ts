import React, {Component} from "react";

/*

import Header from "./Header.js";
import Footer from "./Footer.js";
import Section from "./Section.js";
import SectionProps from "./SectionProps";
import SectionSelector from "./SectionSelector";
import Histogram from "./Histogram.js";
import TimeSeries from "./TimeSeries.js";

*/

import PersistentDrawerLeft from "./PersistentDrawer.ts";

/*

import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

*/

class App extends Component {
    constructor() {
        super();
        this.state = {
            activeSection: 1,
            useComplexDie: 0
        }
        this.switchSection = this.switchSection.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    switchSection(event) {
        this.setState({
            activeSection: event.target.value
        })
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        /*
        const SectionComponents = SectionProps.map(section => (section.id == (this.state.activeSection) && <Section key = {section.id} data = {section}/>));
        console.log(this.state.activeSection);
        console.log(SectionComponents);
        */
        return (
            <div>

                <PersistentDrawerLeft/>

            </div>

            /*

            <SectionSelector switchSection={this.switchSection}/>
            {SectionComponents}

            */
        )
    }
}

export default App;