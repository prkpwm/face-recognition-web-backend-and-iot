import axios from 'axios'

const getNetwork = () =>{
    return axios.get("http://192.168.0.252:2424/available_networks", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('_Token')
            }
        })
}

const connectNetwork = (Data) => {
    
    // console.log(Data.camera)
    let formData = new FormData()
    // formData.set('camera',Data.camera)
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