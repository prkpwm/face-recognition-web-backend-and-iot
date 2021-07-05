import axios from 'axios'

const selectStatusSound = () =>{
    return axios.get("http://192.168.0.253:1969/private/api/v1/selectStatusVoice", {

        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })
}

const setStatusSound = (Data) =>{
    let formData = new FormData()
    formData.set('voice_feedback', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/updateVoiceFeedBack", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const uploadVoiceFile = (Data) =>{
    console.log('Voice file-->', Data)
    let formData = new FormData()
    formData.set('voice', Data.soundVoice)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/uploadSoundVioce", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const uploadVoiceEffect = (Data) =>{
    console.log('Voice effect-->', Data)
    let formData = new FormData()
    formData.set('voice_effect', Data.soundEffects)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/uploadSoundEffect", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const getVoiceMaster = () => {
    console.log('front 1')
    return axios.get("http://192.168.0.253:1969/private/api/v1/getSound", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token')
        }
    })
}

const setVoiceMaster = (Data) =>{
    let formData = new FormData()
    formData.set('setVolume', Data)
    console.log(formData)
    return axios.post("http://192.168.0.253:1969/private/api/v1/setSound", formData, { 
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('_Token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export {
    setVoiceMaster,
    getVoiceMaster,
    selectStatusSound,
    setStatusSound,
    uploadVoiceFile,
    uploadVoiceEffect
}