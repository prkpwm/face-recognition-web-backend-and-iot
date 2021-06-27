import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './checkupdate.scss'

library.add(fas)


class Checkupdate extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
        }

    }

    onChange(checked) {
        console.log(`switch to ${checked}`);
    }


    render() {





        return (
            <div>
                <div className="size-web">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Check for update</h1>
                        </div>
                        <div className="boxset topbox">
                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">Check for update</p>
                                </div>
                                <div className="btnac">
                                    <button type="button" className="btn btn-secondary btn-check">Check</button>
                                </div>
                            </div>

                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">Scanner Ver.000</p>
                                </div>
                                <div className="btnac">
                                    <p className="lastup">Last update 00/00/0000</p>
                                </div>
                            </div>
                        </div>
                        <div className="boxset">
                            <div className="cov-ta">
                                <div className="txth">
                                    <p className="txt">Check for update</p>
                                </div>
                                <div className="btnac">
                                    <Switch className="switcho" defaultChecked onChange={(e) => this.onChange(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Checkupdate