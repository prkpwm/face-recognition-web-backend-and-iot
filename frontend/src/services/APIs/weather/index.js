import axios from 'axios'


const weather = (Data) => {
    // console.log(Data.camera)
    let formData = new FormData()
    formData.set('weather',Data)
    console.log(Data)
    return axios.post("http://192.168.0.252:2424/get_weather", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}



export {
    weather
}