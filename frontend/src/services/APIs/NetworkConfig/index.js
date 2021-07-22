import axios from 'axios'



const getNetwork = (Data) => {
    // console.log(Data.camera)
    let formData = new FormData()
    formData.set('getNetwork',Data)
    // console.log(Data)
    return axios.post("http://192.168.0.252:2424/available_networks", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const connectNetwork = (Data) => {
    
    // console.log(Data)
    let formData = new FormData()
    formData.set('ssid',"\""+Data.ssid+"\"")
    formData.set('password',"\""+Data.password+"\"")
    return axios.post("http://192.168.0.252:2424/new_connection", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}





export {
    connectNetwork,
    getNetwork
}