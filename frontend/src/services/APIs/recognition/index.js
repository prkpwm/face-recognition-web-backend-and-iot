import axios from 'axios'



const getResult = () => {
    // console.log(Data.camera)

    // console.log(Data)
    return axios.post("http://192.168.0.252:2323/recognition/resulte",  {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}







export {
   
    getResult,
}