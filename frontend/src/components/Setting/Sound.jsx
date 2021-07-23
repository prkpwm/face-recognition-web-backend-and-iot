import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Slider, InputNumber, Upload, message, Button, Switch } from 'antd';
import 'antd/dist/antd.css';
import './sound.scss'
import { selectStatusSound, setStatusSound, uploadVoiceFile, uploadVoiceEffect, getVoiceMaster, setVoiceMaster } from "../../services/APIs/sound"
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
import { RotateSpinner } from "react-spinners-kit";
import {BarDate} from "../BarDate";
library.add(fas)

let word = require('../../word.json');

class Sound extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: 'TH',
            inputValue: localStorage.getItem('VoiceMaster'),
            loading: true,
            loading_page: false,
            statusSound: true,
            soundFile: undefined,
            soundEffect: undefined
        }

    }

    componentDidMount() {
        // get data from mongodb
        selectStatusSound()
            .then(_Sound => {
                // console.log("_Sound.data.msg:",_Sound.data.msg[0].statusSound)
                if (_Sound.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading_page: false
                        })
                    }, 800);
                    this.setState({
                        statusSound: _Sound.data.msg[0].statusSound,
                    })

                }
            })
            .catch(_DisplayError => {
                window.location.href = "/password";
            })
        // inputValue
        getVoiceMaster()
            .then(_SoundMaster => {
                // console.log("_SoundMaster.data.msg[0]:",_SoundMaster.data.msg)
                // console.log(_SoundMaster.data);
                if (_SoundMaster.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading_page: false
                        })
                    }, 800);
                    this.setState({
                        inputValue: _SoundMaster.data.msg,
                    })
                    localStorage.setItem('VoiceMaster', _SoundMaster.data.msg)

                }
            })
            .catch(errorVoice => {
                // console.log(errorVoice[0])
                window.location.href = "/password";
            })
        setTimeout(() => {
            this.setState({
                language: localStorage.getItem('lang'),
                loading: false
            })
        }, 800);

        // print log status sound
        // console.log(this.state.statusSound)
    }

    onChange = value => {
        this.setState({
            inputValue: value,
        });
        localStorage.setItem('VoiceMaster', value)
        this.setState({
            inputValue: value,
        })
        setVoiceMaster(value)
            .then(_welcomeWord => {
                if (_welcomeWord.data.status) {
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
    };


    handleChange_effect_voice = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }

        setTimeout(async () => {
            const isLt2M = info.file.size / 1024 / 1024 < 2;
            if (isLt2M && (info.file.type === 'audio/mpeg' || info.file.type === 'audio/x-wav')) {
                info.file.status = 'done'
            } else {
                info.file.status = 'error'
            }
            if (info.file.status === "done") {
                // Get this url from response in real world.
                console.log('img----', info.file.originFileObj)
                this.setState({
                    loading: false,
                    soundEffect: info.file.originFileObj
                })

                const res = await uploadVoiceEffect({
                    soundEffects: this.state.soundEffect
                })
                console.log('res---> ', res)
                if (res.data.status) {
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
            }
        }, 1000)
    }


    handleChange_voice = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }

        setTimeout(async () => {
            const isLt2M = info.file.size / 1024 / 1024 < 2;
            if (isLt2M && (info.file.type === 'audio/mpeg' || info.file.type === 'audio/x-wav')) {
                info.file.status = 'done'
            } else {
                info.file.status = 'error'
            }
            if (info.file.status === "done") {
                // Get this url from response in real world.
                console.log('img----', info.file.originFileObj)
                this.setState({
                    loading: false,
                    soundFile: info.file.originFileObj
                })

                const res = await uploadVoiceFile({
                    soundVoice: this.state.soundFile
                })
                console.log('res---> ', res)
                if (res.data.status) {
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
            }
        }, 1000)
    }


    onChangevoice(checked) {
        // console.log(`switch to ${checked}`);
        this.setState({
            statusSound: checked
        })

    }


    render() {

        // console.log(this.state.statusSound)
        console.log(this.state.inputValue);

        const { inputValue } = this.state;



        const props_voice = {
            name: 'file',
            headers: {
                authorization: 'authorization-text',
            },
            onChange: this.handleChange_voice,

        };

        const props_effect = {
            name: 'file',
            headers: {
                authorization: 'authorization-text',
            },
            onChange: this.handleChange_effect_voice,
        };

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
                            <h1 className="hd">{word['Sound'][this.state.language]}</h1>
                        </div>
                        <div className="set-sound">
                            <div className="master-volume">
                                <p className="name">{word['Master Volume'][this.state.language]}</p>
                                <div className="box-volume">
                                    <div className="volume">
                                        <div className="slide">
                                            <Slider
                                                tipFormatter={null}
                                                min={0}
                                                max={10}
                                                onChange={this.onChange}
                                                value={typeof inputValue === 'number' ? inputValue : this.state.inputValue}
                                            /></div>
                                    </div>
                                    <div className="num">
                                        <InputNumber
                                            min={0}
                                            max={10}
                                            value={inputValue}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="voice">
                                <p className="name">{word['Voice'][this.state.language]}</p>
                                <div className="box-upload">
                                    <div className="cov-upload">
                                        <div className="name-file">
                                            <p className="name">{word['Thai'][this.state.language]}</p>
                                        </div>
                                        <div className="btn-up">
                                            <Upload {...props_voice} fileList={this.state.fileList}>
                                                <Button>{word['Upload'][this.state.language]}</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sound-effect">
                                <p className="name">{word['Sound Effect'][this.state.language]}</p>
                                <div className="box-upload">
                                    <div className="cov-upload">
                                        <div className="name-file">
                                            <p className="name">{word['Bell'][this.state.language]}</p>
                                        </div>
                                        <div className="btn-up">
                                            <Upload {...props_effect} fileList={this.state.fileList}>
                                                <Button>{word['Upload'][this.state.language]}</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="voice-feedback">
                                <p className="name">{word['Voice feedback'][this.state.language]}</p>
                                <div className="boxsetfeed">
                                    <div className="switchset">
                                        <Switch className="switcho" defaultChecked checked={this.state.statusSound} onChange={(e) => this.onChangevoice(e)} />
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

export default Sound