import axios from 'axios'



const saveImg = (Data) => {
    // console.log(Data.camera)
    let formData = new FormData()
    console.log(Data)
    formData.set('path',Data)
    return axios.post("http://192.168.0.252:2424/saveImg", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


const saveLogo = (Data) => {
    // console.log(Data.camera)
    let formData = new FormData()
    console.log(Data)
    formData.append(
        "image",
        Data,
        Data.name
    );
    return axios.post("http://192.168.0.252:2424/logo_save", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}



export {
    saveImg,
    saveLogo
    
}