import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { message } from 'antd';
import { CehckOldPassword, UpdatePassword } from "../../services/APIs/Setting";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './settingpassword.scss'


library.add(fas)

class SettingPassword extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            old_password: "",
            new_password: "",
            confirm_password: "",
            status_checkold_password: null,
            visible_newpass: true,
            valid_confirmpassword: null,
            disabled_btn_save: true
        }

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
        if (value.length === 8) {
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


    SaveNewPassword(){ // Update Password
        // console.log(this.state.new_password.length) 
        if(this.state.new_password.length < 8){
            this.setState({
                new_password: "",
                confirm_password: "",
                valid_confirmpassword: null
            })

            message.error({
                content: 'The password is less than 8 characters.',
                className: 'message-alert',
                // duration: 200,
                style: {
                    marginTop: '8vh',
                },
            });
        }else{
            UpdatePassword(this.state.new_password)
            .then(_StatusUpdate => {
                console.log("GFOL",_StatusUpdate)
                if(_StatusUpdate.data.status){

                    message.success({
                        content: 'Done',
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

                }else{
                    message.error({
                        content: 'Not Change Password',
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
                            <h1 className="hd">Password Setting</h1>
                        </div>
                        <div className="box-inputset">
                            <div className="box-old">
                                <div className="form-group">
                                    <label className="la-pass" htmlFor="Oldpass">Old Password</label>
                                    <input type="text" maxLength="8" onChange={(e) => { this.OnChangeOldPassword(e) }} value={this.state.old_password} className="form-control input-data" id="Oldpass" />
                                    <div className={"color-status " + (this.state.status_checkold_password == true ? "green" : this.state.status_checkold_password == false ? "red" : null)}></div>
                                </div>
                            </div>
                            <div className="box-new">
                                <div className="form-group">
                                    <label className="la-pass" htmlFor="Newpass">New Password</label>
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
                                    <label className="la-pass old" htmlFor="Confirm">Confirm Password</label>
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
                                <button className="btn btn-primary btn-save" onClick={()=>{this.SaveNewPassword()}} disabled={this.state.disabled_btn_save}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }



}

export default SettingPassword