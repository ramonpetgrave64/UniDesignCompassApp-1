import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Layout from "../components/layout"
import "../components/bootstrap.css"
import { Row, ButtonGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports'; // specify the location of aws-exports.js file on your project
import { log_list } from '../dummyData';
import Timer from 'react-compound-timer';
import { updateUser } from '../state/actions'
import { getProcess } from "../graphql_utils/utils"
import { connect } from 'react-redux';
import Phase from '../components/Phase';

Amplify.configure(aws_exports);
// //Comment while not using dynamic
class Compass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            compassName: "Universal Design Compass",
            compassPhases: [
                { key: '1', name: 'A. Define Problem', icon: '', description: '', link: '#', time: 0 },
                { key: '2', name: 'B. Research', icon: '', description: '', link: '#', time: 0 },
                { key: '3', name: 'C. Brainstorm', icon: '', description: '', link: '#', time: 0 },
                { key: '4', name: 'D. Select', icon: '', description: '', link: '#', time: 0 },
                { key: '5', name: 'E. Construct', icon: '', description: '', link: '#', time: 0 },
                { key: '6', name: 'F. Evaluate', icon: '', description: '', link: '#', time: 0 },
                { key: '7', name: 'G. Communicate', icon: '', description: '', link: '#', time: 0 },
                { key: '8', name: 'H. Redisign', icon: '', description: '', link: '#', time: 0 },
            ],
            previous: true,
            next: true,
            currentPhase: '0',
            emptyTime: "00:00:00",
            currentTime: "00:00:00",
            log: ""
        }
    }

    // //Comment while testing in local environment 
    // class Compass extends Component {
    //     constructor(props) {
    //         super(props)
    //         this.state = {
    //             compassName: "",
    //             compassPhases: [],
    //             previous: true,
    //             next: true,
    //             currentPhase: '',
    //             emptyTime: "",
    //             currentTime: "",
    //             log: ""
    //         }
    //     }
    // componentDidMount(){
    //     const compassPhases = this.props.user.processes.items[0].id;
    //     getProcess(compassPhases)
    //     .then((res) => {
    //         const compass = res.data.getProcess;
    //         const compassName = compass.name;
    //         const compassPhases = res.data.getProcess.phaseids.items.map((phase,index) => {
    //             return { 
    //                 key: index + 1,  
    //                 name: phase.title, 
    //                 icon: '', 
    //                 description: phase.description, 
    //                 link: '#',
    //                 time: phase.duration
    //             }
    //         })
    //         this.setState({
    //             compassName,
    //             compassPhases,
    //             previous: true,
    //             next: true,
    //             currentPhase: '0',
    //             emptyTime: "00:00:00",
    //             currentTime: "00:00:00",
    //             log: ""
    //         })
    //     })
    // }

    compassButtonHandler = (phase) => {//handle current phase too.
        this.setState({ currentPhase: phase.key })// Some sort of delay when logging maybe also delay in updating?
    }

    previousButtonHandler = () => {
        var temp = !this.state.previous//need to handle active and disabled booleans too
        this.setState({ previous: temp });
    }


    nextButtonHandler = (e) => {
        var temp = !this.state.next//need to handle active and disabled booleans too
        this.setState({ next: temp });
    }

    handleTextArea = (e) => {
        this.setState({ log: e.target.value })
    }

    updateLogHandler = (event) => {
        var x = new Date()
        var minutes = x.getMinutes();
        var seconds = x.getSeconds();
        var milliseconds = x.getMilliseconds();
        var temp = minutes.toString() + ":" + seconds.toString() + ":" + milliseconds.toString()
        const log = { id: this.state.currentPhase, timestamp: temp, text: this.state.log };
        log_list.data.push(log); // Temporary
        // console.log(log_list.data); //Temporary
        this.forceUpdate();
        //API.graphql(graphqlOperation(createLog, { input: log })); //taken out temporarily!
    }

    adjustTime = (index, time) => {
        let compassPhases = this.state.compassPhases
        compassPhases[index].time = time
        this.setState({ compassPhases })
        // console.log(compassPhases)//Testing
    }

    generateList(phase,currentPhase) {
        if (currentPhase === phase) {
            const filtered = log_list.data.filter((entry) => {
                return (entry.id === phase);
            })
            return (filtered.map((data) => {
                return (<h4>{data.text}</h4>);
            }));
        }
    }

    render() {
        return (
            <Layout>
                <div className='container'>
                    <h1 className='text-center'>{this.state.compassName}</h1>
                    <div>
                        {
                            this.state.compassPhases.map(
                                (phase, index) => {
                                    return (
                                        <Phase
                                            currentPhase={this.state.currentPhase}
                                            phase={phase}
                                            compassButtonHandler={this.compassButtonHandler}
                                            index={index}
                                            updateLogHandler={this.updateLogHandler}
                                            previous={this.state.previous}
                                            next={this.state.next}
                                            nextButtonHandler={this.nextButtonHandler}
                                            previousButtonHandler={this.previousButtonHandler}
                                            handleTextArea={this.handleTextArea}
                                            log={this.state.log}
                                            adjustTime={this.adjustTime}
                                            generateList={this.generateList}
                                            state={this.state}
                                        />
                                        
                                    );
                                })
                        }
                    </div>
                </div>

            </Layout>
        );
    }
}

const mapStateToProps = ({ state }) => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    updateUser: (user) => dispatch(updateUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Compass);

