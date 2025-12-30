document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const uuid = window.location.pathname.split('/').pop();
        console.log(window.location.href)
        let result = await axios.put(`/user/forgot/${uuid}`, {
            password: event.target.new.value
        })
        alert('password updated')
        window.location.href = `http://3.108.52.99:1000/`;
    }
    catch (e) {
        console.log(e)
    }
})