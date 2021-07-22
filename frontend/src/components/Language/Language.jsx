import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { message } from 'antd';
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import './language.scss'


library.add(fas)
let word = require('../../word.json');

class Language extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            loading: false
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
                    localStorage.setItem('lang',_Edit.data.msg[0].lang) 

                }
            })

            .catch(_EditError => {
                window.location.href = "/password";
            })
    }


    onChangeLanguage(e) {
        var lang = e.target.value;
        this.setState({ language: lang })
        localStorage.setItem('lang',lang) 
        SetLanguage(lang) // change language
            .then(_Language => {
                if (_Language.data.status) {

                    message.success({
                       content: word['Done'][this.state.language],
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                } 
            })
            .catch(_LanguageError => {
                window.location.href = "/password";
            })
    }


    render() {

        return (
            <div>
                <div className="size-web">
                    <div className="loading" style={{visibility: this.state.loading? "visible" : "hidden"}}>
                        <RotateSpinner size={150} loading={this.state.loading} />
                    </div>
                    <div className="cov-menu">

                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/setting" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Language'][this.state.language]}</h1>
                        </div>
                        <div className="box-select">
                            <div className="cov-lang">
                                <div className="lang">
                                    <label className={"container " + (this.state.language === "TH" ? "active" : "")}>ไทย
                                            <input className="check-box" type="checkbox" name="Language"
                                            checked={this.state.language == 'TH'}
                                            value="TH"
                                            onChange={(e) => {
                                                this.onChangeLanguage(e)
                                            }}

                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="lang">
                                    <label className={"container " + (this.state.language === "EN" ? "active" : "")}>English
                                            <input className="check-box" type="checkbox" name="Language"
                                            checked={this.state.language == 'EN'}
                                            value="EN"
                                            onChange={(e) => {
                                                this.onChangeLanguage(e)
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default Language