import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { getDisplay, setStatusFrame, setStatusPerson, setStatusNickname, setStatusGroup, setStatusTime, setStatusTemp, setStatusWelcomeWord, setWelcomeWord, setNamePlace, setStatusNamePlace, setStatusLogo, updateLogo } from "../../services/APIs/Setting";
import { Upload, message, Switch, Radio, Input } from 'antd';
import { RotateSpinner } from "react-spinners-kit";
import 'antd/dist/antd.css';
import './view.scss'
import { BarDate } from "../BarDate";
import { GetLanguage } from "../../services/APIs/Setting";
import { saveImg,saveLogo } from "../../services/APIs/Header";
library.add(fas)

let word = require('../../word.json');

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

// function beforeUpload(file) {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//         message.error('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//         message.error('Image must smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
// }

class Views extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            loading: true,
            loading_page: false,
            logo: "",
            status_logo: true,
            name_place: "",
            status_name_place: true,
            status_frame: true,
            status_person: true,
            word_welcome: "",
            status_word_welcome: true,
            status_nickname: true,
            status_group: true,
            status_time: true,
            status_temp: true,
            pm25_status: true,
            weather_status: true,
            color: "green",
            fileImg: undefined,
            LogoLocation:undefined,
        }
        this.onKeyUpWordWelcome = this.onKeyUpWordWelcome.bind(this);
        this.onKeyUpPlaceName = this.onKeyUpPlaceName.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // getDisplay() // display all
        //     .then(_Display => {
        //         console.log(_Display.data.msg)
        //         if (_Display.data.status) {
        //             setTimeout(() => {
        //                 this.setState({
        //                     loading: false,
        //                     language: localStorage.getItem('lang'),
        //                 })
        //             }, 800);

        //             this.setState({
        //                 logo: _Display.data.msg[0].logo_path,
        //                 status_logo: _Display.data.msg[0].scanner_logo_header,
        //                 name_place: _Display.data.msg[0].organization_name,
        //                 status_name_place: _Display.data.msg[0].scanner_show_info,
        //                 status_frame: _Display.data.msg[0].fset_rec_frame,
        //                 status_person: _Display.data.msg[0].fset_person_frame,
        //                 word_welcome: _Display.data.msg[0].welcome_word,
        //                 status_word_welcome: _Display.data.msg[0].welcome_repres,
        //                 status_nickname: _Display.data.msg[0].nickname_repres,
        //                 status_group: _Display.data.msg[0].group_repres,
        //                 status_time: _Display.data.msg[0].checktime_repres,
        //                 status_temp: _Display.data.msg[0].temp_repres,
        //                 color: _Display.data.msg[0].color,
        //             })

        //         }
        //     })
        setTimeout(() => {
            this.setState({
                loading: false,
                language: localStorage.getItem('lang'),
            })
        }, 800);

        this.setState({
            logo: localStorage.getItem('LogoLocation'),
            status_logo: (/true/i).test(localStorage.getItem('LogoSelected')),
            name_place: localStorage.getItem('L1'),
            status_name_place: (/true/i).test(localStorage.getItem('nameSelected')),
            status_frame: (/true/i).test(localStorage.getItem('t1')) ,
            status_person: (/true/i).test(localStorage.getItem('t2')),
            word_welcome: localStorage.getItem('welcome_word'),
            status_word_welcome: (/true/i).test(localStorage.getItem('welcome_status')),
            status_nickname: (/true/i).test(localStorage.getItem('nickname_status')),
            status_group:(/true/i).test(localStorage.getItem('group_status')) ,
            status_time: (/true/i).test(localStorage.getItem('time_trick_status')),
            status_temp:(/true/i).test(localStorage.getItem('temp_status')) ,
            color: (/true/i).test(localStorage.getItem('color')) ,
            LogoLocation:localStorage.getItem('LogoLocation'),
            pm25_status: localStorage.getItem('pm25_status') != null ? (/true/i).test(localStorage.getItem('pm25_status')) : true,
            weather_status: localStorage.getItem('weather_status') != null ? (/true/i).test(localStorage.getItem('weather_status')) : true,

        })

    }

    onChangeColor = (e) => {
        this.setState({
            color: e.target.value,
        });
        localStorage.setItem('color',e.target.value)
    };

    onChangeLogo(event) {
        // saveImg(event.target.files[0].name) // change language
        console.log(event.file)

        saveLogo(event.file) // change language
        // // save(event.target.files[0], event.target.files[0].name)
        this.setState({
            LogoLocation: URL.createObjectURL(event.file),
        })

        localStorage.setItem('LogoLocation', "/image/temp/"+event.file.name)


    }
    // upload image 
    handleChange = (info) => {
        console.log(info)
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        setTimeout(() => {
            const isLt2M = info.file.size / 1024 / 1024 < 2;
            if (isLt2M && (info.file.type === 'image/jpeg' || info.file.type === 'image/png')) {
                info.file.status = 'done'
            } else {
                info.file.status = 'error'
            }
            if (info.file.status === "done") {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, async (imageUrl) => {
                    console.log('img----', info.file.originFileObj)
                    // localStorage.setItem('LogoLocation', imageUrl)
                    this.setState({
                        imageUrl,
                        loading: false,
                        fileImg: info.file.originFileObj

                    })
                    saveLogo(info.file.originFileObj) 
                    localStorage.setItem('LogoLocation', "/image/temp/"+info.file.name)
                    const res = await updateLogo({
                        image: this.state.fileImg
                    })
                    this.setState({
                        LogoLocation: localStorage.getItem('LogoLocation')
                    })
                    // console.log('res---> ', res)
                    // if (res.data.status) {
                    //     message.success({
                    //         content: word['Done'][this.state.language],
                    //         className: 'message-done',
                    //         style: {
                    //             marginTop: '2vh',
                    //         },
                    //     });

                    // } else {
                    //     message.error({
                    //         content: word['Please try again.'][this.state.language],
                    //         className: 'message-alert',
                    //         style: {
                    //             marginTop: '2vh',
                    //         },
                    //     });
                    // }
                });

            }
        }, 1000)
    }


    onChangeStatuslogo(checked) {
        this.setState({
            status_logo: checked
        })
        localStorage.setItem('LogoSelected',checked)
        setStatusLogo(checked)
            .then(statusLogo => {
                if (statusLogo.data.status) {
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

    onKeyUpPlaceName(event) {
        // var value = event.target.value
        if (event.charCode === 13) {
            // this.setState({ word_welcome: event.target.value });
            this.updatePlaceName(event.target.value)
        }
        

    }

    updatePlaceName(name_place) {
        let PlaceValue = name_place;
        console.log("placeValue: " + PlaceValue)
        localStorage.setItem('L1',PlaceValue)
        setNamePlace(PlaceValue)
            .then(_Nameplace => {
                if (_Nameplace.data.status) {
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


    onChangeStatusname(checked) {
        this.setState({
            status_name_place: checked
        })
        localStorage.setItem('nameSelected',checked)
        setStatusNamePlace(checked)
            .then(statusNamePlace => {
                if (statusNamePlace.data.status) {
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



    onChangeDetect(checked) {
        this.setState({
            status_frame: checked
        })
        localStorage.setItem('t1',checked)
        setStatusFrame(checked)
            .then(_statusFrame => {
                if (_statusFrame.data.status) {
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


    onChangeFace(checked) {
        this.setState({
            status_person: checked
        })
        localStorage.setItem('t2',checked)
        setStatusPerson(checked)
            .then(_statusFace => {
                if (_statusFace.data.status) {
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

    updateWordWelcome(welcomeValue) {
        let WelcomeValue = welcomeValue;
        console.log("welcomeValue: " + WelcomeValue)
        localStorage.setItem('welcome_word',WelcomeValue)
        setWelcomeWord(WelcomeValue)
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
    }

    onKeyUpWordWelcome(event) {
        // var value = event.target.value
        if (event.charCode === 13) {
            // this.setState({ word_welcome: event.target.value });
            this.updateWordWelcome(event.target.value)
        }
    }

    onChangeStatusWordwelcome(checked) {
        this.setState({
            status_word_welcome: checked
        })
        localStorage.setItem('welcome_status',checked)
        setStatusWelcomeWord(checked)
            .then(_statusWelcomeWord => {
                if (_statusWelcomeWord.data.status) {
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


    onChangeNickname(checked) {
        this.setState({
            status_nickname: checked
        })
        localStorage.setItem('nickname_status',checked)
        setStatusNickname(checked)
            .then(_statusNickname => {
                if (_statusNickname.data.status) {
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

    onChangeGroup(checked) {
        this.setState({
            status_group: checked
        })
        localStorage.setItem('group_status',checked)
        setStatusGroup(checked)
            .then(_statusGroup => {
                if (_statusGroup.data.status) {
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

    onChangeTime(checked) {
        this.setState({
            status_time: checked
        })
        localStorage.setItem('time_trick_status',checked)
        setStatusTime(checked)
            .then(_statusCheckTime => {
                if (_statusCheckTime.data.status) {
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

    onChangeTem(checked) {
        this.setState({
            status_temp: checked
        })
        localStorage.setItem('temp_status',checked)
        setStatusTemp(checked)
            .then(_statusTemp => {
                if (_statusTemp.data.status) {
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


    onChangePM25Status(event) {
        console.log(event);
        this.setState({
            pm25_status: event,

        })
        localStorage.setItem('pm25_status', event)
    }

    onChangeWeatherStatus(event) {
        console.log(event);
        this.setState({
            weather_status: event,

        })
        localStorage.setItem('weather_status', event)
    }
    render() {
        // console.log(this.state.fileImg)
        const { loading, imageUrl } = this.state;
        const radioStyle = {
            display: 'inliine-block',
            height: '30px',
            lineHeight: '30px',
        };

        const uploadButton = (
            <div className="cover-btnupload">
                {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
                <div className="btn-upload">Browse</div>
            </div>
        );




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
                                <a href="/display" className="link-back "><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd red">{word['Display setting'][this.state.language]}</h1>
                        </div>
                        <div className="box-viewsetting">
                            <div className="row list-col">
                                <div className="col-lg-3 btn-ac">
                                    <div className="cov-set-header">
                                        <button type="button" className="btn btn-primary btnmodal-hd" data-toggle="modal" data-target="#Header">
                                            <div className="box-icon">
                                                <img src="/image/icon/iconset.svg" alt="" className="img-fluid" />
                                            </div>
                                        </button>
                                    </div>
                                    <div className="cov-set-frame">
                                        <button type="button" className="btn btn-primary btnmodal-hd" data-toggle="modal" data-target="#Frame">
                                            <div className="box-icon">
                                                <img src="/image/icon/iconset.svg" alt="" className="img-fluid" />
                                            </div>
                                        </button>
                                    </div>
                                    <div className="cov-set-information">
                                        <button type="button" className="btn btn-primary btnmodal-hd" data-toggle="modal" data-target="#Information">
                                            <div className="box-icon">
                                                <img src="/image/icon/iconset.svg" alt="" className="img-fluid" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-lg-9 display-set">
                                    <div className="boxex">
                                        <div className="name-official">
                                            <div className="cov-ta">
                                                <div className="logo">
                                                    <div className="circle">
                                                        {this.state.LogoLocation ? <img src={this.state.LogoLocation} alt="" className="img-fluid" /> : null}

                                                    </div>
                                                </div>
                                                <div className="nameoff">
                                                    <p className="name">{this.state.name_place ? this.state.name_place : ""}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="scan">
                                            <img src="/image/scanning_bar.png" alt="" className="img-fluid" />
                                        </div>
                                        {this.state.status_person ? <div className="cov-img-default">
                                            <img src="/image/Human.png" alt="" className="img-fluid" />
                                        </div> : null}

                                        <div className="result">
                                            <div className="name-result">
                                                <p className="status-process">SUCCESS</p>
                                                {this.state.status_nickname ? <p className="name-user">Bai toeyyy</p> : null}
                                                {this.state.status_group ? <p className="group">{word['Student'][this.state.language]}</p> : null}
                                            </div>
                                            <div className="row list-result">
                                                <div className="col-lg-6 time">
                                                    {this.state.status_time ? <div className="box-time">
                                                        <div className="cov-ta-time">
                                                            <div className="img-result">
                                                                <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
                                                            </div>
                                                            <div className="result-num">
                                                                <p className="num">09.09</p>
                                                                <p className="status-time">{word['Late'][this.state.language]}</p>
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                                </div>
                                                <div className="col-lg-6 temperature">
                                                    {this.state.status_temp ? <div className="box-tem">
                                                        <div className="cov-ta-tem">
                                                            <div className="result-temper">
                                                                <p className="num">35.6°</p>
                                                                <p className="status-time">{word['Pass'][this.state.language]}</p>
                                                            </div>
                                                            <div className="img-tem">
                                                                <img src="/image/icon/temg.svg" alt="" className="img-fluid imgtem" />
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                                </div>
                                                <div className="col-lg-6 time">
                                                    {this.state.pm25_status ? <div className="box-time">
                                                        <div className="cov-ta-time">
                                                            <div className="img-result">
                                                                <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
                                                            </div>
                                                            <div className="result-num">
                                                                <p className="num">18</p>
                                                                <p className="status-time">{word['Very good'][this.state.language]}</p>
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                                </div>
                                                <div className="col-lg-6 temperature">
                                                    {this.state.weather_status ? <div className="box-tem">
                                                        <div className="cov-ta-tem">
                                                            <div className="result-temper">
                                                                <p className="num">{word['clear sky'][this.state.language]}</p>
                                                                <p className="status-time">{word['Bangkok'][this.state.language]}</p>
                                                            </div>
                                                            <div className="img-tem">
                                                                <img src="/image/icon/temg.svg" alt="" className="img-fluid imgtem" />
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cov-color-preset">
                            <div className="cov-menu">
                                <p className="hname">{word['Color Preset'][this.state.language]}</p>
                            </div>
                            <div className="box-list-color">
                                <Radio.Group className="group-check" onChange={(e) => { this.onChangeColor(e) }} value={this.state.color}>
                                    <Radio className="radio-check" style={radioStyle} value={"Green"}>
                                        <div className="color green">
                                            <div className="circle"></div>
                                        </div>
                                    </Radio>
                                    <Radio className="radio-check" style={radioStyle} value={"Blue"}>
                                        <div className="color blue">
                                            <div className="circle"></div>
                                        </div>
                                    </Radio>
                                    <Radio className="radio-check" style={radioStyle} value={"Purple"}>
                                        <div className="color purple">
                                            <div className="circle"></div>
                                        </div>
                                    </Radio>
                                    <Radio className="radio-check" style={radioStyle} value={"Red"}>
                                        <div className="color red">
                                            <div className="circle"></div>
                                        </div>
                                    </Radio>
                                    <Radio className="radio-check" style={radioStyle} value={"Yellow"}>
                                        <div className="color yellow">
                                            <div className="circle"></div>
                                        </div>
                                    </Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bd-example-modal-lg" id="Header" tabIndex="-1" role="dialog" aria-labelledby="TitleHeader" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={['fas', 'less-than']} />
                                </button>
                                <h5 className="modal-title" id="TitleHeader">{word['Scanner Header'][this.state.language]}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="cov-setlogo">
                                    <div className="browse-logo">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            onChange={this.handleChange}
                                        >

                                            <div className="cov-btn-img">   
                                                <div className="box-img">
                                                    <div className="br-img">
                                                        <FontAwesomeIcon className="icon-add" icon={['fas', 'plus']} />
                                                        {this.state.LogoLocation ? <img src={this.state.LogoLocation} alt="avatar" style={{ width: '100%' }} /> : null}
                                                    </div>
                                                </div>
                                                <div className="box-btnup">
                                                    {uploadButton}
                                                </div>
                                            </div>
                                        </Upload>
                                    </div>
                                    <div className="cov-switch">
                                        <Switch className="switcho" defaultChecked checked={this.state.status_logo} onChange={(e) => this.onChangeStatuslogo(e)} />
                                    </div>
                                </div>
                                <div className="set-name">
                                    <div className="cov-boxsett">
                                        <div className="input-box">
                                            <Input className="namescreen" onKeyPress={this.onKeyUpPlaceName} placeholder={this.state.name_place ? this.state.name_place : ""} />
                                        </div>
                                        <div className="switch">
                                            <Switch className="switcho" defaultChecked checked={this.state.status_name_place} onChange={(e) => this.onChangeStatusname(e)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bd-example-modal-lg" id="Frame" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={['fas', 'less-than']} />
                                </button>
                                <h5 className="modal-title" id="TitleHeader">{word['Frame'][this.state.language]}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="box-detect">
                                    <div className="cov-tadetect">
                                        <div className="img-detect">
                                            <img src="/image/brdetect.svg" alt="" className="img-fluid" />
                                        </div>
                                        <div className="switch">
                                            <Switch className="switcho" defaultChecked checked={this.state.status_frame} onChange={(e) => this.onChangeDetect(e)} />
                                        </div>
                                    </div>
                                    <div className="cov-face">
                                        <div className="img-detect">
                                            <img src="/image/Human.png" alt="" className="img-fluid" />
                                        </div>
                                        <div className="switch">
                                            <Switch className="switcho" defaultChecked checked={this.state.status_person} onChange={(e) => this.onChangeFace(e)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bd-example-modal-lg" id="Information" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={['fas', 'less-than']} />
                                </button>
                                <h5 className="modal-title" id="TitleHeader">{word['Information'][this.state.language]}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="show-result">
                                    <div className="cov-txt-result">
                                        <p className="status-result">SUCESS</p>
                                        <h1 className="name-user">Bai toeyyy</h1>
                                        <p className="group">Student</p>
                                    </div>

                                    <div className="setting-show">
                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <p className="hd-input">{word['Welcome word'][this.state.language]}</p>
                                                <Input className="wordwel" onKeyPress={this.onKeyUpWordWelcome} placeholder={this.state.word_welcome ? this.state.word_welcome : ""} />
                                            </div>
                                            <div className="switch">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_word_welcome} onChange={(e) => this.onChangeStatusWordwelcome(e)} />
                                            </div>
                                        </div>

                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <p className="hd-input">{word['Nickname'][this.state.language]}</p>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_nickname} onChange={(e) => this.onChangeNickname(e)} />
                                            </div>
                                        </div>

                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <p className="hd-input">{word['Group'][this.state.language]}</p>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_group} onChange={(e) => this.onChangeGroup(e)} />
                                            </div>
                                        </div>

                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <div className="box-dis-time">
                                                    <div className="cov-tdata">
                                                        <div className="img-time">
                                                            <img src="/image/icon/timer.svg" alt="" className="img-fluid" />
                                                        </div>
                                                        <div className="txt-time">
                                                            <p className="numtime">09.09</p>
                                                            <p className="result-time">{word['Late'][this.state.language]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_time} onChange={(e) => this.onChangeTime(e)} />
                                            </div>
                                        </div>

                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <div className="box-dis-time">
                                                    <div className="cov-tdata">
                                                        <div className="img-time">
                                                            <img src="/image/icon/temg.svg" alt="" className="img-fluid tems" />
                                                        </div>
                                                        <div className="txt-time">
                                                            <p className="numtime">36.5°</p>
                                                            <p className="result-time">{word['Scanning pass'][this.state.language]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_temp} onChange={(e) => this.onChangeTem(e)} />
                                            </div>
                                        </div>


                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <div className="box-dis-time">
                                                    <div className="cov-tdata">
                                                        <div className="img-time">
                                                            <img src="/image/icon/temg.svg" alt="" className="img-fluid tems" />
                                                        </div>
                                                        <div className="txt-time">
                                                            <p className="numtime">18</p>
                                                            <p className="result-time">{word['Very good'][this.state.language]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.pm25_status} onChange={(e) => this.onChangePM25Status(e)} />
                                            </div>
                                        </div>


                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <div className="box-dis-time">
                                                    <div className="cov-tdata">
                                                        <div className="img-time">
                                                            <img src="/image/icon/temg.svg" alt="" className="img-fluid tems" />
                                                        </div>
                                                        <div className="txt-time">
                                                            <p className="weather">{word['clear sky'][this.state.language]}</p>
                                                            <p className="result-time">{word['Bangkok'][this.state.language]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.weather_status} onChange={(e) => this.onChangeWeatherStatus(e)} />
                                            </div>
                                        </div>
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

export default Views