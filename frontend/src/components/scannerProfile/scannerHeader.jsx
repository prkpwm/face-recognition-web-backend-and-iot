import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch, Input } from 'antd';
import 'antd/dist/antd.css';
import './scannerHeader.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import { BarDate } from "../BarDate";

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
            selectedFile: null,
            LogoSelected:localStorage.getItem('LogoSelected') != null ? localStorage.getItem('LogoSelected') : true,
            nameSelected:localStorage.getItem('nameSelected') != null ? localStorage.getItem('nameSelected') : true,
            L1:localStorage.getItem('L1') == null ? localStorage.getItem('L1') : null,
            L2:localStorage.getItem('L2') == null ? localStorage.getItem('L2') : null,
        }
        this.onChangeLogo = this.onChangeLogo.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    componentDidMount() {
        this.setState({
            loading: true,
            LogoSelected:localStorage.getItem('LogoSelected') != null ? localStorage.getItem('LogoSelected') : true,
            nameSelected:localStorage.getItem('nameSelected') != null ? localStorage.getItem('nameSelected') : true,
            L1:localStorage.getItem('L1') == null ? localStorage.getItem('L1') : null,
            L2:localStorage.getItem('L2') == null ? localStorage.getItem('L2') : null,
        })
        // console.log(this.state.LogoSelected,this.state.nameSelected)
        GetLanguage() // Get language for display
            .then(_Edit => {


                if (_Edit.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading: false
                        })
                    }, 800);
                    this.setState({
                        language: _Edit.data.msg[0].lang,

                    })


                }
            })

            .catch(_EditError => {
                window.location.href = "/password";
            })
    }

    onChangeLogo(event) {
        console.log( URL.createObjectURL(event.target.files[0]));
        this.setState({
            selectedFile: URL.createObjectURL(event.target.files[0]),

        })


    }


    onChangeLogoSelect(event) {
        console.log(event);
        this.setState({
            LogoSelected: event,

        })
        localStorage.setItem('LogoSelected',event) 

    }

    onChangenameSelect(event) {
        console.log( event);
        this.setState({
            LogoSelected: event,

        })
        localStorage.setItem('nameSelected',event) 
    }

    onChangeL1(event) {
        console.log( event.target.value);
        this.setState({
            L1: event.target.value,

        })
        localStorage.setItem('L1',event) 

    }

    onChangeL2(event) {
        console.log( event.target.value);
        this.setState({
            L2: event.target.value,

        })
        localStorage.setItem('L2',event) 

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
                                        <img src={this.state.selectedFile == null ? "/image/Logo/logo-office.png" : this.state.selectedFile} alt="" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="btnac">
                                    <form action="/upload" method="post" enctype="multipart/form-data">
                                        <Input type="file" className="btn btn-secondary btn-check"  name={word['Browse'][this.state.language]} onChange={this.onChangeLogo} />
                                        {/* <button type="button" className="btn btn-secondary btn-check">{word['Browse'][this.state.language]}</button> */}
                                    </form>
                                </div>
                                <div className="btnac">
                                    <Switch className="switcho" defaultChecked={this.state.LogoSelected} onChange={(e) => this.onChangeLogoSelect(e)} />
                                   
                                </div>
                                {console.log( this.state.LogoSelected)}
                            </div>
                        </div>
                        <div className="boxset">
                            <div className="cov-ta">
                                <div className="box-new">
                                    <div className="form-group">
                                        <input type="text"
                                            className="form-control input-data" maxLength="64"
                                            value={this.state.L1}
                                            onChange={(e) => { this.OnChangeL1(e) }} id="Newpass"
                                            disabled={this.state.visible_newpass}
                                            placeholder={"Scannername Line 1"}
                                        />
                                        <div className="btnac" style={{ float: "right", marginLeft: "43em" }}>
                                            <Switch className="switcho" defaultChecked={this.state.nameSelected} onChange={(e) => this.onChangenameSelect(e)} />
                                        </div>

                                        <input type="text"
                                            className="form-control input-data" maxLength="64"
                                            value={this.state.L2}
                                            onChange={(e) => { this.OnChangeL2(e) }} id="Newpass"
                                            disabled={this.state.visible_newpass}
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