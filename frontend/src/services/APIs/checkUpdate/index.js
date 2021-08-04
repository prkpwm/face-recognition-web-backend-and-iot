import axios from 'axios'


const checkUpdate = (version) => {
    
    // console.log(Data)
    let formData = new FormData()
    formData.set('version',version)



    return axios.post("http://192.168.0.252:2424/dowload_update", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}





export {
    checkUpdate
}