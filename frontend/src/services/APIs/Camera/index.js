import axios from 'axios'


const Camera = (Data) => {
    
    // console.log(Data.camera)
    let formData = new FormData()
    console.log(Data)
    formData.set('camera',Data.camera)


    return axios.post("http://192.168.0.252:2424/manage_camera", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}

const Temp = (Data) => {
    
    // console.log(Data.camera)
    let formData = new FormData()

    return axios.post("http://192.168.0.252:2424/getTemp", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}

const Clean = (Data) => {
    
    // console.log(Data.camera)
    let formData = new FormData()

    return axios.post("http://192.168.0.252:2424/clean_data", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}



export {
    Camera,
    Temp,
    Clean
}