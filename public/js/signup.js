document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault()
    if (event.target.password.value != event.target.confirmpassword.value) {
        alert('Please enter same password in both fields')
        return 0
    }
    try {
        const r = await axios.post('/user/signup', {
            username: event.target.username.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            password: event.target.password.value
        })
        alert('Registered Successfully!')
        window.location.href = 'http://13.200.243.168:1000/';
    }
    catch (e) {
        if(e.status === 400) alert('there is an account with this email')
        console.log(e)
    }
})