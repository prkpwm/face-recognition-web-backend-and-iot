import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { message } from 'antd';
import { GetLanguage } from "../../services/APIs/Setting";
import { connectNetwork, getNetwork } from "../../services/APIs/NetworkConfig";
import { RotateSpinner } from "react-spinners-kit";
import './NetworkConfig.scss'
import Slider from "react-slick";
import {BarDate} from "../BarDate";
library.add(fas)
let word = require('../../word.json');

class NetworkConfig extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            loading: false,
            available_networks: [],
            getNetwork: [],
        }

    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);



        getNetwork() // Get language for display
            .then(_Edit => {
                if (_Edit.status == 200) {
                    console.log(_Edit.data.available)
                    this.setState({
                        getNetwork: _Edit.data.available,
                    })
                }
            })


    }

    new_connection() {
        connectNetwork() // change language
            .then(config => {
                if (config.data.status) {
                    message.success({
                        content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: word['Not Change Password'][this.state.language],
                        className: 'message-alert',
                        style: {
                            marginTop: '5vh',
                        },
                    });
                }
            })
    }


    render() {

        return (
            <div>
                <div className="size-web">
                <div className="loading" style={{visibility: this.state.loading? "visible" : "hidden"}}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <BarDate></BarDate>
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Network configuration'][this.state.language]}</h1>
                        </div>
                        <div className="box-display">

                
                            <div className="slide-member">
                                <Slider
                                    // asNavFor={this.state.nav1}
                                    // ref={slider => (this.slider2 = slider)}
                                    slidesToShow={2}
                                    swipeToSlide={true}
                                    focusOnSelect={true}
                                    centerMode={true}
                                    centerPadding={"60px"}
                                    arrows={false}
                                    variableWidth={false}
                                    swipeToSlide={true}
                                    infinite={true}
                                    className="slide-name"
                                >
                                </Slider>
                                <div className="detail-slide">
                                    <div className="slidebottom">
                                        <div className="cov-list-name">
                                            {this.state.getNetwork ? this.state.getNetwork.map((v, index) => (
                                                <div className="list-name" key={v.user_id} onClick={() => { window.location.href = "/NetworkConnect?ssid="+v.split(":")[0] } }>
                                                    <div className="ta-list">
                                                        <div className="name">
                                                            <p className="txt" style={{fontSize:'20px'}}>{v}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : null}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div id="animateSearch" className="animate__animated box-search">
                                <div className="input-group boxgroup">
                                    <input type="search" placeholder="..." aria-describedby="button-addon1" className="form-control border-0 bg-light search-group" />
                                    <div className="input-group-append">
                                        <button id="button-addon1" type="submit" className="btn btn-link text-primary"><FontAwesomeIcon icon={['fas', 'search']} /></button>
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

export default NetworkConfig