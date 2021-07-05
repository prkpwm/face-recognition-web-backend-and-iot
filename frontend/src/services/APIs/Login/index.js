import axios from 'axios'


const Auth = (Data) => {

    console.log(Data);

    let formData = new FormData()
    formData.set('password',Data)
    
    return axios.post("http://192.168.0.253:1969/authentication    ", formData, {
        headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('__sessionToken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

}





export {
    Auth
}