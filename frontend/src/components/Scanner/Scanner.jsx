import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { GetMode, SetStatusFace, SetStatusthermal, SetThermalLowest, SetThermalHightest } from "../../services/APIs/Setting";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch, message, Select } from 'antd';
import { RotateSpinner } from "react-spinners-kit";
import 'antd/dist/antd.css';
import './scanner.scss'


library.add(fas)

const { Option } = Select;

let word = require('../../word.json');

class Scanner extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            StatusFace: true,
            StatusThermal: true,
            ThermalLowest: "35.0",
            ThermalHeightest: "38.0",
            loading: true
        }

    }


    componentDidMount() {
        GetMode() // API Get Status Scanner
            .then(_Mode => {
                if (_Mode.data.status) {

                    setTimeout(() => {
                        this.setState({
                            language: localStorage.getItem('lang'),
                            loading: false
                        })
                    }, 800);


                    this.setState({
                        StatusFace: _Mode.data.msg[0].face_status,
                        StatusThermal: _Mode.data.msg[0].thermal_status,
                        ThermalLowest: _Mode.data.msg[0].thermal_lowest,
                        ThermalHeightest: _Mode.data.msg[0].thermal_hight
                    })
                }
            })

            .catch(_ModeError => {
                // console.log(_ModeError);
                window.location.href = "/password";
            })
    }


    onChangeFace(checked) { // Switch Face Recognition
        this.setState({
            StatusFace: checked
        })


        SetStatusFace(checked)
            .then(_StatusFace => {
                if (_StatusFace.data.status) {

                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_StatusFaceError => console.error(_StatusFaceError))
    }

    onChangeThermal(checked) { // Switch Thermal scan
        this.setState({
            StatusThermal: checked
        })


        SetStatusthermal(checked)
            .then(_StatusFace => {

                if (_StatusFace.data.status) {

                    message.success({
                       content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                       content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_StatusFaceError => console.error(_StatusFaceError))
    }

    Changehigh(v) { // Set High Thermal
        this.setState({
            ThermalHeightest: v
        })


        SetThermalHightest(v)
            .then(_ThermalHigh => {

                if (_ThermalHigh.data.status) {

                    message.success({
                       content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                       content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_ThermalHighError => console.error(_ThermalHighError))

    }

    Changelow(v) { // Set Low Thermal
        console.log(`selected ${v}`);

        this.setState({
            ThermalLowest: v
        })


        SetThermalLowest(v)
            .then(_ThermalLow => {

                if (_ThermalLow.data.status) {

                    message.success({
                       content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                       content: word['Please try again.'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            })

            .catch(_ThermalLowError => console.error(_ThermalLowError))
    }




    render() {





        return (
            <div>
                <div className="size-web">
                    <div className="loading" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Scanner mode</h1>
                        </div>
                        <div className="box-switch">
                            <div className="list-set">
                                <p className="txt-hd">Face recognition</p>
                                <div className="cov-switch scanner">
                                    <Switch className="switcho" checked={this.state.StatusFace} onChange={(e) => this.onChangeFace(e)} />
                                </div>
                            </div>
                            <div className="list-set">
                                <p className="txt-hd">Thermal scan</p>
                                <div className="cov-switch scanner">
                                    <Switch className="switcho" checked={this.state.StatusThermal} onChange={(e) => this.onChangeThermal(e)} />
                                </div>
                            </div>
                        </div>
                        {
                            this.state.StatusThermal ?
                                <div className="set-thermal">
                                    <p className="hd-sett">Temperature range set</p>
                                    <div className="box-set-high">
                                        <div className="box-hd">
                                            <p className="txt">Highest</p>
                                        </div>
                                        <div className="box-select">
                                            <Select
                                                dropdownClassName="drop-name"
                                                value={this.state.ThermalHeightest}
                                                // open={true}s
                                                showArrow={false}

                                                onSelect={(e) => this.Changehigh(e)}>

                                                <Option value="35.0">35.0</Option>
                                                <Option value="35.1">35.1</Option>
                                                <Option value="35.2">35.2</Option>
                                                <Option value="35.3">35.3</Option>
                                                <Option value="35.4">35.4</Option>
                                                <Option value="35.5">35.5</Option>
                                                <Option value="35.6">35.6</Option>
                                                <Option value="35.7">35.7</Option>
                                                <Option value="35.8">35.8</Option>
                                                <Option value="35.9">35.9</Option>
                                                <Option value="36.0">36.0</Option>
                                                <Option value="36.1">36.1</Option>
                                                <Option value="36.2">36.2</Option>
                                                <Option value="36.3">36.3</Option>
                                                <Option value="36.4">36.4</Option>
                                                <Option value="36.5">36.5</Option>
                                                <Option value="36.6">36.6</Option>
                                                <Option value="36.7">36.7</Option>
                                                <Option value="36.8">36.8</Option>
                                                <Option value="36.9">36.9</Option>
                                                <Option value="37.0">37.0</Option>
                                                <Option value="37.1">37.1</Option>
                                                <Option value="37.2">37.2</Option>
                                                <Option value="37.3">37.3</Option>
                                                <Option value="37.4">37.4</Option>
                                                <Option value="37.5">37.5</Option>
                                                <Option value="37.6">37.6</Option>
                                                <Option value="37.7">37.7</Option>
                                                <Option value="37.8">37.8</Option>
                                                <Option value="37.9">37.9</Option>
                                                <Option value="38.0">38.0</Option>
                                            </Select>
                                        </div>
                                        <div className="unit">
                                            <p className="txt">ํC</p>
                                        </div>
                                    </div>

                                    <div className="box-set-low">
                                        <div className="box-hd">
                                            <p className="txt">Lowest</p>
                                        </div>
                                        <div className="box-select">
                                            <Select
                                                dropdownClassName="drop-name"
                                                value={this.state.ThermalLowest}
                                                // open={true}
                                                showArrow={false}

                                                onSelect={(e) => this.Changelow(e)}>

                                                <Option value="35.0">35.0</Option>
                                                <Option value="35.1">35.1</Option>
                                                <Option value="35.2">35.2</Option>
                                                <Option value="35.3">35.3</Option>
                                                <Option value="35.4">35.4</Option>
                                                <Option value="35.5">35.5</Option>
                                                <Option value="35.6">35.6</Option>
                                                <Option value="35.7">35.7</Option>
                                                <Option value="35.8">35.8</Option>
                                                <Option value="35.9">35.9</Option>
                                                <Option value="36.0">36.0</Option>
                                                <Option value="36.1">36.1</Option>
                                                <Option value="36.2">36.2</Option>
                                                <Option value="36.3">36.3</Option>
                                                <Option value="36.4">36.4</Option>
                                                <Option value="36.5">36.5</Option>
                                                <Option value="36.6">36.6</Option>
                                                <Option value="36.7">36.7</Option>
                                                <Option value="36.8">36.8</Option>
                                                <Option value="36.9">36.9</Option>
                                                <Option value="37.0">37.0</Option>
                                                <Option value="37.1">37.1</Option>
                                                <Option value="37.2">37.2</Option>
                                                <Option value="37.3">37.3</Option>
                                                <Option value="37.4">37.4</Option>
                                                <Option value="37.5">37.5</Option>
                                                <Option value="37.6">37.6</Option>
                                                <Option value="37.7">37.7</Option>
                                                <Option value="37.8">37.8</Option>
                                                <Option value="37.9">37.9</Option>
                                                <Option value="38.0">38.0</Option>
                                            </Select>
                                        </div>
                                        <div className="unit">
                                            <p className="txt">ํC</p>
                                        </div>
                                    </div>
                                </div> : null
                        }
                    </div>
                </div>
            </div>
        )

    }



}

export default Scanner