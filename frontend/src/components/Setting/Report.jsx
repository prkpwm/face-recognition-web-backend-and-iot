import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Switch, message } from 'antd';
import { getDailyReport, setSms, setEmail } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import 'antd/dist/antd.css';
import './report.scss'
import { GetLanguage } from "../../services/APIs/Setting";
import {BarDate} from "../BarDate";
library.add(fas)

let word = require('../../word.json');

class Report extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            reportdaily: [],
            loading: false
        }

    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        getDailyReport() // display
            .then(_Daily => {

                if (_Daily.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading: false
                        })
                    }, 800);


                    this.setState({
                        reportdaily: _Daily.data.msg
                    })

                }
            })

            .catch(_DailyError => {
                window.location.href = "/password";
            })
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 10);

    }

    onChangeSMS(checked, value) { // setting swtich sms
        value.smsReport = checked;
        this.setState({
            smsReport: checked
        })

        var Data = {
            id: value._id,
            sms: value.smsReport
        }

        setSms(Data)
            .then(_StautsSms => {
                if (_StautsSms.data.status) {

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

            .catch(_StautsSmsError => console.error(_StautsSmsError))



    }


    onChangeEmail(checked, value) { // setting switch email
        value.emailReport = checked
        this.setState({
            emailReport: checked
        })

        var Data = {
            id: value._id,
            email: value.emailReport
        }
        setEmail(Data)
            .then(_StautsEmail => {
                console.log(_StautsEmail);
                if (_StautsEmail.data.status) {

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

            .catch(_StautsEmailError => console.error(_StautsEmailError))

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
                            <h1 className="hd">{word['Report'][this.state.language]}</h1>
                        </div>
                        <div className="hd-report">
                            <p className="type-report">{word['Daily report'][this.state.language]}</p>
                        </div>
                        <div className="setgroup">
                            <div className="must-do">
                                <p className="txt">{word['Group selection'][this.state.language]}</p>
                            </div>
                            <div className="box-list-group">
                                <div className="bs-example">
                                    <div className="accordion" id="accordionExample">
                                        {this.state.reportdaily ? this.state.reportdaily.map((value, index) => {

                                            return <div className="card" key={value._id}>
                                                <div className="card-header" id={"heading" + index}>
                                                    <button type="button" className="btn btn-link btn-toggle" data-toggle="collapse" data-target={"#collapse" + index}>
                                                        <div className="name-status">
                                                            <div className="names">
                                                                <p className="txt">{value.groupName ? value.groupName : ""}</p>
                                                            </div>
                                                            <div className="img-status">
                                                                <div className="covimg">
                                                                    <div className="sms-img">
                                                                        {value.smsReport ? <img src="/image/icon/Ysms.svg" alt="" className="img-fluid" /> : <img src="/image/icon/Nsms.svg" alt="" className="img-fluid" />}
                                                                    </div>
                                                                    <div className="email-img">
                                                                        {value.emailReport ? <img src="/image/icon/Yemail.svg" alt="" className="img-fluid" /> : <img src="/image/icon/Nemail.svg" alt="" className="img-fluid" />}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div id={"collapse" + index} className="collapse" aria-labelledby={"heading" + index} data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <div className="cov-setting">
                                                            <div className="cov-tasms">
                                                                <div className="txt-sms">
                                                                    <p className="txt">{word['SMS'][this.state.language]}</p>
                                                                </div>
                                                                <div className="switchset">
                                                                    <Switch className="switcho" checked={value.smsReport}
                                                                        onChange={(e) => {
                                                                            // value.smsReport = e
                                                                            // this.setState({
                                                                            //     smsReport: e
                                                                            // })
                                                                            this.onChangeSMS(e, value)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <hr className="green" />
                                                            <div className="cov-tasms">
                                                                <div className="txt-sms">
                                                                    <p className="txt">{word['Email'][this.state.language]}</p>
                                                                </div>
                                                                <div className="switchset">
                                                                    <Switch className="switcho" checked={value.emailReport} onChange={(e) => { this.onChangeEmail(e, value) }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }) : null}

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

export default Report