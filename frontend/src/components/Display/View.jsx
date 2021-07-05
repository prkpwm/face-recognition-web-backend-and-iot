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


library.add(fas)

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
            loading: false,
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
            color: "green",
            fileImg:undefined
        }
        this.onKeyUpWordWelcome = this.onKeyUpWordWelcome.bind(this);
        this.onKeyUpPlaceName = this.onKeyUpPlaceName.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            loading_page: true
        })
        getDisplay() // display all
            .then(_Display => {
                console.log(_Display.data.msg)
                if (_Display.data.status) {

                    setTimeout(() => {
                        this.setState({
                            loading_page: false
                        })
                    }, 800);


                    this.setState({
                        logo: _Display.data.msg[0].logo_path,
                        status_logo: _Display.data.msg[0].scanner_logo_header,
                        name_place: _Display.data.msg[0].organization_name,
                        status_name_place: _Display.data.msg[0].scanner_show_info,
                        status_frame: _Display.data.msg[0].fset_rec_frame,
                        status_person: _Display.data.msg[0].fset_person_frame,
                        word_welcome: _Display.data.msg[0].welcome_word,
                        status_word_welcome: _Display.data.msg[0].welcome_repres,
                        status_nickname: _Display.data.msg[0].nickname_repres,
                        status_group: _Display.data.msg[0].group_repres,
                        status_time: _Display.data.msg[0].checktime_repres,
                        status_temp: _Display.data.msg[0].temp_repres,
                        color: _Display.data.msg[0].color
                    })

                }
            })

            .catch(_DisplayError => {
                window.location.href = "/password";
            })
    }

    onChangeColor = (e) => {
        this.setState({
            color: e.target.value,
        });
    };

// upload image 
    handleChange = (info) => {
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
            getBase64(info.file.originFileObj, async  (imageUrl) =>{
                console.log('img----',info.file.originFileObj)
                this.setState({
                    imageUrl,
                    loading: false,
                    fileImg:info.file.originFileObj
                })
                
                const res = await updateLogo({
                    image:this.state.fileImg
                })
                console.log('res---> ', res)
                if(res.data.status){
                    message.success({
                        content: 'Done',
                        className: 'message-done',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                    
                }else{
                    message.error({
                        content: 'Please try again.',
                        className: 'message-alert',
                        style: {
                            marginTop: '2vh',
                        },
                    });
                }
            });
          }
        }, 1000)    
    }


    onChangeStatuslogo(checked) {
        this.setState({
            status_logo:checked
        })

        setStatusLogo(checked)
        .then(statusLogo => {
            if(statusLogo.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
                    className: 'message-alert',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }
        })
        .catch(_StatusFaceError => console.error(_StatusFaceError))
    }

    onKeyUpPlaceName(event){
        // var value = event.target.value
        if (event.charCode === 13) {
            // this.setState({ word_welcome: event.target.value });
            this.updatePlaceName(event.target.value)
          }
    }

    updatePlaceName(name_place){
        let PlaceValue = name_place;
        console.log("placeValue: "+PlaceValue)
        setNamePlace(PlaceValue)
        .then(_Nameplace => {
            if(_Nameplace.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_name_place:checked
        })

        setStatusNamePlace(checked)
        .then(statusNamePlace => {
            if(statusNamePlace.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_frame:checked
        })
        
        setStatusFrame(checked)
        .then(_statusFrame => {
            if(_statusFrame.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_person:checked
        })
        
        setStatusPerson(checked)
        .then(_statusFace => {
            if(_statusFace.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
                    className: 'message-alert',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }
        })
        .catch(_StatusFaceError => console.error(_StatusFaceError))
    }

    updateWordWelcome(welcomeValue){
        let WelcomeValue = welcomeValue;
        console.log("welcomeValue: "+WelcomeValue)
        setWelcomeWord(WelcomeValue)
        .then(_welcomeWord => {
            if(_welcomeWord.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
                    className: 'message-alert',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }
        })
        .catch(_StatusFaceError => console.error(_StatusFaceError))
    }

    onKeyUpWordWelcome(event){
        // var value = event.target.value
        if (event.charCode === 13) {
            // this.setState({ word_welcome: event.target.value });
            this.updateWordWelcome(event.target.value)
          }
    }

    onChangeStatusWordwelcome(checked) {
        this.setState({
            status_word_welcome:checked
        })

        setStatusWelcomeWord(checked)
        .then(_statusWelcomeWord => {
            if(_statusWelcomeWord.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_nickname:checked
        })
        
        setStatusNickname(checked)
        .then(_statusNickname => {
            if(_statusNickname.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_group:checked
        })
        
        setStatusGroup(checked)
        .then(_statusGroup => {
            if(_statusGroup.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_time:checked
        })
        
        setStatusTime(checked)
        .then(_statusCheckTime => {
            if(_statusCheckTime.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
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
            status_temp:checked
        })
        
        setStatusTemp(checked)
        .then(_statusTemp => {
            if(_statusTemp.data.status){
                message.success({
                    content: 'Done',
                    className: 'message-done',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }else{
                message.error({
                    content: 'Please try again.',
                    className: 'message-alert',
                    style: {
                        marginTop: '2vh',
                    },
                });
            }
        })
        .catch(_StatusFaceError => console.error(_StatusFaceError))
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
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/display" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">Display setting</h1>
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
                                                        {this.state.logo? <img src={"/image/Logo/" + this.state.logo} alt="" className="img-fluid" /> : null }
                                                        
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
                                                {this.state.status_group ? <p className="group">Student</p> : null}   
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
                                                                <p className="status-time">มาสาย</p>
                                                            </div>
                                                        </div>
                                                    </div> : null}    
                                                </div>
                                                <div className="col-lg-6 temperature">
                                                    {this.state.status_temp ? <div className="box-tem">
                                                        <div className="cov-ta-tem">
                                                            <div className="result-temper">
                                                                <p className="num">35.6°</p>
                                                                <p className="status-time">อุณหภูมิผ่านเกณฑ์</p>
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
                                <p className="hname">Color Preset</p>
                            </div>
                            <div className="box-list-color">
                                <Radio.Group className="group-check" onChange={(e) => {this.onChangeColor(e)}} value={this.state.color}>
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
                                <h5 className="modal-title" id="TitleHeader">Scanner header</h5>
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
                                                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : null}
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
                                <h5 className="modal-title" id="TitleHeader">Frame</h5>
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
                                <h5 className="modal-title" id="TitleHeader">Information</h5>
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
                                                <p className="hd-input">Welcome word</p>
                                                <Input className="wordwel" onKeyPress={this.onKeyUpWordWelcome} placeholder={this.state.word_welcome ? this.state.word_welcome : ""}/>
                                            </div>
                                            <div className="switch">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_word_welcome} onChange={(e) => this.onChangeStatusWordwelcome(e)} />
                                            </div>
                                        </div>

                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <p className="hd-input">Nickname</p>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked={this.state.status_nickname} onChange={(e) => this.onChangeNickname(e)} />
                                            </div>
                                        </div>

                                        <div className="cov-tasetword">
                                            <div className="cov-input-word">
                                                <p className="hd-input">Group</p>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked ={this.state.status_group} onChange={(e) => this.onChangeGroup(e)} />
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
                                                            <p className="result-time">มาสาย</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked ={this.state.status_time} onChange={(e) => this.onChangeTime(e)} />
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
                                                            <p className="result-time">มาสาย</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="switchtwo">
                                                <Switch className="switcho" defaultChecked checked = {this.state.status_temp} onChange={(e) => this.onChangeTem(e)} />
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