document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        let r = await axios.post('/user/forgot', {
            email: event.target.email.value
        })

        alert('password reset link has sent to your email. if your email was registered')
        window.location.href = `http://3.108.52.99:1000/`;
    }
    catch (e) {
        console.log(e)
    }
})