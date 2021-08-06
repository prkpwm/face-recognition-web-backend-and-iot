import axios from 'axios'

const GetMode = () => {
    return axios.get("http://192.168.0.253:1969/private/api/v1/selectScannerMode", {
        // return axios.get("http://192.168.0.253:1969/private/api/v1/selectScannerMode", {

        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })

}


const SetStatusFace = (Data) => {

    // console.log(Data);

    let formData = new FormData()
    formData.set('status_face_recognition', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateScannerModeFaceRecognition", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}


const SetStatusthermal = (Data) => {
    let formData = new FormData()
    formData.set('status_thermal', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateStatusScannerModeThermal", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const SetThermalLowest = (Data) => {
    // console.log(Data)
    let formData = new FormData()
    formData.set('thermal_low', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateScannerModeLThermal", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const SetThermalHightest = (Data) => {
    let formData = new FormData()
    formData.set('thermal_hight', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateScannerModeHThermal", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const CehckOldPassword = (Data) => {
    // console.log(Data);

    let formData = new FormData()
    formData.set('old_password', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/checkOldPassword", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const UpdatePassword = (Data) => {
    // console.log(Data);

    let formData = new FormData()
    formData.set('new_password', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updatePassword", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const GetLanguage = (Data) => {
    let formData = new FormData()
    formData.set('data', null)
    formData.set('url', "http://192.168.0.253:1969/private/api/v1/selectLanguage")
    formData.set('method', "GET")
    formData.set('_Token', localStorage.getItem('_Token'))
    return axios.post("http://192.168.0.252:2424/ByPass", formData,  {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}


const SetLanguage = (Data) => {
    let formData = new FormData()
    formData.set('data', {"language":Data})
    formData.set('url', "http://192.168.0.253:1969/private/api/v1/updateLanguage")
    formData.set('method', "post")
    return axios.post("http://192.168.0.252:2424/ByPass", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    // return axios.post("http://192.168.0.253:1969/private/api/v1/updateLanguage", formData, {
    //     headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // })
}


const GetCheckin = () => {
    return axios.get("http://192.168.0.253:1969/private/api/v1/selectAttendance", {

        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })

}

const setTimeCheckIn = (Data) => {
    let formData = new FormData()
    formData.set('ontime', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateOntime", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const setOpenCheckIn = (Data) => {
    let formData = new FormData()
    formData.set('check_status', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateCheckStatus", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setMon = (Data) => {
    let formData = new FormData()
    formData.set('work_mo', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkMo", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setTue = (Data) => {
    let formData = new FormData()
    formData.set('work_tu', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkTu", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setWed = (Data) => {
    let formData = new FormData()
    formData.set('work_wed', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkWed", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const setThu = (Data) => {
    let formData = new FormData()
    formData.set('work_thu', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkThu", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const setFri = (Data) => {
    let formData = new FormData()
    formData.set('work_fri', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkFri", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const setSat = (Data) => {
    let formData = new FormData()
    formData.set('work_sat', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkSat", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const setSun = (Data) => {
    let formData = new FormData()
    formData.set('work_sun', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWorkSun", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const getDailyReport = () => {
    return axios.get("http://192.168.0.253:1969/private/api/v1/selectGroupReport", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })
}

const setSms = (Data) => {
    let formData = new FormData()
    formData.set('Gid', Data.id)
    formData.set('status_sms', Data.sms)


    return axios.post("http://192.168.0.253:1969/private/api/v1/updateValueSms", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setEmail = (Data) => {
    let formData = new FormData()
    formData.set('Gid', Data.id)
    formData.set('status_email', Data.email)


    return axios.post("http://192.168.0.253:1969/private/api/v1/updateValueEmail", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const getDisplay = () => {
    return axios.get("http://192.168.0.253:1969/private/api/v1/selectDisplayAllData", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })
}

const setStatusFrame = (Data) => {
    let formData = new FormData()
    formData.set('rec_frame', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateFrameSettingRec", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusPerson = (Data) => {
    let formData = new FormData()
    formData.set('person_frame', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateFrameSettingPerson", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusNickname = (Data) => {
    let formData = new FormData()
    formData.set('nickname_status', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateInfoNicknameStatus", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusGroup = (Data) => {
    let formData = new FormData()
    formData.set('group_status', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateInfoGroupStatus", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusTime = (Data) => {
    let formData = new FormData()
    formData.set('checktime_status', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateInfoChecktimeStatus", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusTemp = (Data) => {
    let formData = new FormData()
    formData.set('temp_status', Data)

    return axios.post("http://192.168.0.253:1969/private/api/v1/updateInfoTempStatus", formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusWelcomeWord = (Data) => {
    let formData = new FormData()
    formData.set('welcome_status', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWelcomeSettingStatus", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setWelcomeWord = (Data) => {
    let formData = new FormData()
    formData.set('welcome_word', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateWelcomeWordSetting", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setNamePlace = (Data) => {
    let formData = new FormData()
    formData.set('organiz_name', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateOrganizSettName", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusNamePlace = (Data) => {
    let formData = new FormData()
    formData.set('show_info', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateScanShowInfo", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const setStatusLogo = (Data) =>{
    let formData = new FormData()
    formData.set('logo_header', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateScanLogoHead", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const updateLogo = (Data) =>{
    console.log('data img-->', Data)
    let formData = new FormData()
    formData.set('image', Data.image)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateSettingLogoImg", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// http://192.168.0.253:1969/private/api/v1/updateSettingLogoImg?key=id




export {
    GetMode,
    SetStatusFace,
    CehckOldPassword,
    UpdatePassword,
    SetStatusthermal,
    SetThermalLowest,
    SetThermalHightest,
    GetLanguage,
    SetLanguage,
    GetCheckin,
    setTimeCheckIn,
    setOpenCheckIn,
    setMon,
    setTue,
    setWed,
    setThu,
    setFri,
    setSat,
    setSun,
    getDailyReport,
    setSms,
    setEmail,
    getDisplay,
    setStatusFrame,
    setStatusPerson,
    setStatusNickname,
    setStatusGroup,
    setStatusTime,
    setStatusTemp,
    setStatusWelcomeWord,
    setWelcomeWord,
    setNamePlace,
    setStatusNamePlace,
    setStatusLogo,
    updateLogo
}