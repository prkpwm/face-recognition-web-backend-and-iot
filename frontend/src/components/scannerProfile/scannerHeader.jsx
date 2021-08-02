import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBullseye, fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch, Input } from 'antd';
import 'antd/dist/antd.css';
import './scannerHeader.scss'
import { saveImg,saveLogo } from "../../services/APIs/Header";
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";
import { save } from 'save-file'
library.add(fas)



// let word = {'':{'EN':'','TH':''},

//         }
let word = require('../../word.json');

class scannerHeader extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            loading: true,
            LogoSelected: true,
            nameSelected: true,
            LogoLocation: null,
            file: null,
            L1: null,
            L2: null,
        }
        this.onChangeLogo = this.onChangeLogo.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false,
                LogoSelected: localStorage.getItem('LogoSelected') != null ? (/true/i).test(localStorage.getItem('LogoSelected')) : true,
                nameSelected: localStorage.getItem('nameSelected') != null ? (/true/i).test(localStorage.getItem('nameSelected')) : true,
                L1: localStorage.getItem('L1') != null ? localStorage.getItem('L1') : null,
                L2: localStorage.getItem('L2') != null ? localStorage.getItem('L2') : null,
                LogoLocation: localStorage.getItem('LogoLocation'),
                language: localStorage.getItem('lang'),
            })
        }, 800);
        // console.log(this.state.LogoSelected,this.state.nameSelected)
        console.log(this.state.LogoLocation,localStorage.getItem('LogoLocation'))

    }



    onChangeLogo(event) {
        // saveImg(event.target.files[0].name) // change language
        saveLogo(event.target.files[0]) // change language
        // save(event.target.files[0], event.target.files[0].name)
        this.setState({
            LogoLocation: URL.createObjectURL(event.target.files[0]),
        })

        localStorage.setItem('LogoLocation', "/image/temp/"+event.target.files[0].name)


    }


    onChangeLogoSelect(event) {
        console.log(event);
        this.setState({
            LogoSelected: event,

        })
        localStorage.setItem('LogoSelected', event)

    }

    onChangenameSelect(event) {
        console.log(event);
        this.setState({
            nameSelected: event,

        })
        localStorage.setItem('nameSelected', event)
    }

    OnChangeLine1(event) {
        console.log(event.target.value);
        this.setState({
            L1: event.target.value,

        })
        localStorage.setItem('L1', event.target.value)

    }

    OnChangeLine2(event) {
        console.log(event.target.value);
        this.setState({
            L2: event.target.value,

        })
        localStorage.setItem('L2', event.target.value)

    }



    render() {




        return (
            <div>
                <div className="size-web">
                    <div className="loading" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <BarDate></BarDate>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/scannerProfile" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Scanner Header'][this.state.language]}</h1>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="logo">
                                    <div className="circle">
                                        <img src={this.state.LogoLocation == null ? localStorage.getItem('LogoLocation') : this.state.LogoLocation  } alt="" className="img-fluid" />

                                    </div>
                                </div>
                                <div className="btnac">
                                        <Input type="file" id="myFile" className="btn btn-secondary btn-check" name="file" onChange={this.onChangeLogo} />
                                        {/* <button type="button" className="btn btn-secondary btn-check">{word['Browse'][this.state.language]}</button> */}
                                </div>
                                <div className="btnac">
                                    <Switch className="switcho" checked={this.state.LogoSelected} onChange={(e) => this.onChangeLogoSelect(e)} />

                                </div>
                            </div>
                        </div>
                        <div className="boxset">
                            <div className="cov-ta">
                                <div className="box-new">
                                    <div className="form-group">
                                        <input type="text"
                                            className="form-control input-data" maxLength="64"
                                            value={this.state.L1}
                                            onChange={(e) => { this.OnChangeLine1(e) }}
                                            placeholder={"Scannername Line 1"}
                                        />
                                        <div className="btnac" style={{ float: "right", marginLeft: "43em" }}>
                                            <Switch className="switcho" checked={this.state.nameSelected} onChange={(e) => this.onChangenameSelect(e)} />
                                        </div>
                                        <input type="text"
                                            className="form-control input-data" maxLength="64"
                                            value={this.state.L2}
                                            onChange={(e) => { this.OnChangeLine2(e) }}
                                            placeholder={"Scannername Line 2"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default scannerHeader