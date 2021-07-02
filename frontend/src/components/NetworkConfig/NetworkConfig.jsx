import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { message } from 'antd';
import { GetLanguage } from "../../services/APIs/Setting";
import { connectNetwork, getNetwork } from "../../services/APIs/NetworkConfig";
import { RotateSpinner } from "react-spinners-kit";
import './language.scss'


library.add(fas)


class NetworkConfig extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            loading: false,
            available_networks: [],
        }

    }

    componentDidMount() {
        this.setState({
            loading: true
        })
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



        getNetwork() // Get language for display
            .then(_Edit => {
                if (_Edit.data.status) {
                    this.setState({
                        getNetwork: _Edit.data,
                    })
                }
            })
    }

    new_connection() {
        connectNetwork(config) // change language
            .then(config => {
                if (config.data.status) {
                    message.success({
                        content: 'Done',
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });

                } else {
                    message.error({
                        content: 'Not Change Password',
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
                    <div className="loading" style={{ visibility: this.state.loading ? "visible" : "hidden" }}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <div className="cov-menu">

                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Language</h1>
                        </div>
                        <div>
                            {this.state.available_networks}
                        </div>

                    </div>
                </div>
            </div>
        )

    }



}

export default NetworkConfig