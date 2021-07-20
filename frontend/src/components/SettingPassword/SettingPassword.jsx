import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { message } from 'antd';
import { CehckOldPassword, UpdatePassword } from "../../services/APIs/Setting";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './settingpassword.scss'
import { GetLanguage, SetLanguage } from "../../services/APIs/Setting";
let word = {
    'Password Setting': { 'EN': 'Password Setting', 'TH': 'การตั้งค่ารหัสผ่าน' },
    'Old Password': { 'EN': 'Old Password', 'TH': 'รหัสผ่านเก่า' },
    'New Password': { 'EN': 'New Password', 'TH': 'รหัสผ่านใหม่' },
    'Confirm Password': { 'EN': 'Confirm Password', 'TH': 'ยืนยันรหัสผ่าน' },
    'Save': { 'EN': 'Save', 'TH': 'บันทึก' },
    'The password is less than 8 characters.': { 'EN': 'Save', 'TH': 'รหัสผ่านมีความยาวน้อยกว่า 8 ตัวอักษร' },
    'Done': { 'EN': 'Save', 'TH': 'เสร็จแล้ว' },
    'Not Change Password': { 'EN': 'Save', 'TH': 'ไม่เปลี่ยนรหัสผ่าน' },
}

library.add(fas)

class SettingPassword extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            language: "TH",
            old_password: "",
            new_password: "",
            confirm_password: "",
            status_checkold_password: null,
            visible_newpass: true,
            valid_confirmpassword: null,
            disabled_btn_save: true,
            loading: true
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


    }
    OnChangeOldPassword(e) { // check old password
        console.log(e.target.value)
        var value = e.target.value
        this.setState({
            old_password: e.target.value
        })

        this.CheckOldPass(value)
    }


    OnChangeNewPassword(e) { // new password
        this.setState({
            new_password: e.target.value
        })

    }

    OnChangeConfirmPassword(e) { // confirm password
        var confirm = e.target.value
        this.setState({
            confirm_password: e.target.value
        })

        if (confirm != this.state.new_password) {
            this.setState({
                valid_confirmpassword: true
            })
        } else {
            this.setState({
                valid_confirmpassword: false,
                disabled_btn_save: false
            })
        }

    }


    CheckOldPass(value) {
        if (value.length >= 8) {
            CehckOldPassword(value)
                .then(_Oldpass => {
                    if (_Oldpass.data.status) {
                        this.setState({
                            status_checkold_password: _Oldpass.data.status,
                            visible_newpass: false
                        })
                    } else {
                        this.setState({
                            status_checkold_password: _Oldpass.data.status,
                            visible_newpass: true
                        })
                    }

                })
                .catch(_OldpassError => console.error(_OldpassError))
        }
    }


    SaveNewPassword() { // Update Password
        // console.log(this.state.new_password.length) 
        if (this.state.new_password.length < 8) {
            this.setState({
                new_password: "",
                confirm_password: "",
                valid_confirmpassword: null
            })

            message.error({
                content: word['The password is less than 8 characters.'][this.state.language],
                className: 'message-alert',
                // duration: 200,
                style: {
                    marginTop: '8vh',
                },
            });
        } else {
            UpdatePassword(this.state.new_password)
                .then(_StatusUpdate => {
                    console.log("GFOL", _StatusUpdate)
                    if (_StatusUpdate.data.status) {

                        message.success({
                            content: word['Done'][this.state.language],
                            className: 'message-done',
                            // duration: 500,
                            style: {
                                marginTop: '2vh',
                            },
                        });

                        localStorage.removeItem("_Token")
                        setTimeout(function () {
                            window.location.href = "/password";
                        }, 200);

                    } else {
                        message.error({
                            content: word['Not Change Password'][this.state.language],
                            className: 'message-alert',
                            // duration: 200,
                            style: {
                                marginTop: '5vh',
                            },
                        });
                    }


                })
                .catch(_StatusUpdateError => console.error(_StatusUpdateError))
        }
    }


    render() {



        // console.log(this.state.status_checkold_password)

        return (
            <div>
                <div className="size-web">
                    <div className="cov-menu">
                        <div className="hmenu">
                            <div className="icon-back">
                                <a href="/menu" className="link-back"><FontAwesomeIcon icon={['fas', 'less-than']} /></a>
                            </div>
                            <h1 className="hd">{word['Password Setting'][this.state.language]}</h1>
                        </div>
                        <div className="box-inputset">
                            <div className="box-old">
                                <div className="form-group">
                                    <label className="la-pass" htmlFor="Oldpass">{word['Old Password'][this.state.language]}</label>
                                    <input type="text" maxLength="8" onChange={(e) => { this.OnChangeOldPassword(e) }} value={this.state.old_password} className="form-control input-data" id="Oldpass" />
                                    <div className={"color-status " + (this.state.status_checkold_password == true ? "green" : this.state.status_checkold_password == false ? "red" : null)}></div>
                                </div>
                            </div>
                            <div className="box-new">
                                <div className="form-group">
                                    <label className="la-pass" htmlFor="Newpass">{word['New Password'][this.state.language]}</label>
                                    <input type="text"
                                        className="form-control input-data" maxLength="8"
                                        value={this.state.new_password}
                                        onChange={(e) => { this.OnChangeNewPassword(e) }} id="Newpass"
                                        disabled={this.state.visible_newpass}
                                    />

                                </div>
                            </div>
                            <div className="box-confirm">
                                <div className="form-group">
                                    <label className="la-pass old" htmlFor="Confirm">{word['Confirm Password'][this.state.language]}</label>
                                    <input type="text" maxLength="8"
                                        value={this.state.confirm_password}
                                        onChange={(e) => { this.OnChangeConfirmPassword(e) }}
                                        className="form-control input-data" id="Confirm"
                                        disabled={this.state.visible_newpass}
                                    />
                                    <div className={"color-status " + (this.state.valid_confirmpassword == true ? "red" : this.state.valid_confirmpassword == false ? "green" : null)}></div>
                                </div>

                            </div>
                            <div className="cov-save">
                                <button className="btn btn-primary btn-save" onClick={() => { this.SaveNewPassword() }} disabled={this.state.disabled_btn_save}>{word['Save'][this.state.language]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default SettingPassword