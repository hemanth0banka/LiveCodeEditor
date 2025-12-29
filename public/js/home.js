let userId
let email
let username
let openProject
let content
let update = true
let aa
let auto = false
let aiTimeout


const socket = io('http://13.200.243.168:1000/', {
    auth: {
        token: `Bearer ${localStorage.getItem('token')}`
    }
})

const err = (e) => {
    if (e.response.status === 401) {
        alert(`Session Expried , Relogin `)
        localStorage.removeItem('token')
        window.location.href = 'http://13.200.243.168:1000/'
    }
    console.log(e)
}
const send = async (p) => {
    try {
        const r = await axios.post('/ai/ask', { prompt: p }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return r.data
    }
    catch (e) {
        return "Ai is Busy ..."
        err(e)
    }
}
const editor = (data, type) => {
    document.querySelector('#editor').innerHTML = ''
    content = document.createElement('textarea');
    content.value = data;
    document.querySelector('#editor').appendChild(content)
    content.addEventListener('input', () => {
        if (update) {
            socket.emit('content-change', { roomId: openProject, data: content.value })
        }
        update = true
        if ((aa) && (auto)) {
            clearTimeout(aiTimeout);
            aiTimeout = setTimeout(async () => {
                const p = `answer me directly no other words. suggest me next only 2-3 lines for this these along with previous 2-3 lines ${content.value}`
                let r = await send(p);
                const aiResponseElement = document.querySelector('#ai #msg');
                if (aiResponseElement) aiResponseElement.innerHTML = r;
            }, 1000)
        }
    });
}

function buttons(obj) {
    socket.emit('join-room', { roomId: obj._id })
    const button = document.createElement('button')
    button.id = obj._id
    const p = document.createElement('div')
    p.innerHTML = obj.documentName
    if (obj.admin === userId) {
        const t = document.createElement('div')
        t.innerHTML = '✦︎'
        button.appendChild(t)
    }
    button.appendChild(p)
    button.addEventListener('click', async () => {
        try {
            button.style = 'background-color : white;'
            openProject = obj._id
            const res = await axios.get(`/document/${obj._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            document.querySelector('#dashboard').innerHTML = ''
            const head = document.createElement('div')
            head.id = 'head'
            const download = document.createElement('button')
            download.id = 'submit'
            download.innerHTML = '🡻'
            download.addEventListener('click', async () => {
                try {
                    const doc = await axios.get(`/document/${obj._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    let type
                    if (doc.data.type === 'python') type = 'py'
                    if (doc.data.type === 'java') type = 'java'
                    if (doc.data.type === 'javascript') type = 'js'
                    if (doc.data.type === 'c') type = 'c'
                    if (doc.data.type === 'php') type = 'php'
                    downloadFile(doc.data.documentName, type, doc.data.content)
                }
                catch (e) {
                    err(e)
                }
            })
            let run = ''
            const img = document.createElement('img')
            img.src = '/img/chatgpt.gif'
            const ai = document.createElement('button')
            aa = false
            ai.appendChild(img)
            ai.id = 'submit'
            ai.addEventListener('click', async () => {
                if (aa) {
                    aa = false
                    auto = false
                    document.querySelector('#dashboard').removeChild(document.querySelector('#ai'))
                }
                else {
                    aa = true
                    const field = document.createElement('div')
                    field.id = 'ai'
                    const msg = document.createElement('div')
                    msg.id = 'msg'
                    const div = document.createElement('div')
                    div.id = 'ask'
                    const input = document.createElement('input')
                    const sub = document.createElement('button')
                    sub.innerHTML = '➤'
                    sub.id = 'submit'
                    sub.addEventListener('click', async () => {
                        const my = document.createElement('div')
                        my.innerHTML = input.value
                        my.id = 'my'
                        msg.appendChild(my)
                        const r = await send(input.value)
                        input.value = ''
                        const you = document.createElement('div')
                        you.innerHTML = r
                        you.id = 'you';
                        msg.appendChild(you);

                    })
                    const change = document.createElement('button')
                    change.innerHTML = '🗘'
                    change.id = 'submit'
                    change.addEventListener('click', () => {
                        if (auto) {
                            auto = false
                            change.style = 'background-color:#0d6efd;'
                        }
                        else {
                            auto = true;
                            change.style = 'background-color:rgb(50, 50, 50);'
                        }
                    })
                    div.appendChild(input)
                    div.appendChild(sub)
                    div.appendChild(change)
                    field.appendChild(div)
                    field.appendChild(msg)
                    document.querySelector('#dashboard').appendChild(field)
                }
            })
            const save = document.createElement('button')
            save.id = 'submit'
            save.innerHTML = 'save'
            save.addEventListener('click', async () => {
                try {
                    await axios.post('/document/save', {
                        id: res.data._id,
                        content: content.value
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    alert('Changes are saved')
                }
                catch (e) {
                    err(e)
                }
            })
            const edit = document.createElement('div')
            edit.id = 'editor'
            document.querySelector('#dashboard').appendChild(head)
            document.querySelector('#dashboard').appendChild(edit)
            const p = document.createElement('div')
            p.innerHTML = ` ~  ${res.data.documentName} . ${res.data.type}`
            p.id = 'docname'
            document.querySelector('#head').appendChild(p)
            const menuButton = document.createElement('button')
            menuButton.innerHTML = '☰'
            menuButton.id = 'submit'
            menuButton.addEventListener('click', async () => {
                try {
                    const res = await axios.get(`/document/${obj._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    const menu = document.createElement('div')
                    menu.id = 'menu'
                    const room = document.createElement('div')
                    const id = document.createElement('div')
                    id.innerHTML = `Doc id : ${res.data._id}`
                    const close = document.createElement('button')
                    close.innerHTML = '✖'
                    close.addEventListener('click', () => {
                        document.querySelector('#dashboard').removeChild(menu)
                    })
                    room.appendChild(id)
                    room.appendChild(close)
                    menu.appendChild(room)
                    menu.id = 'menu'
                    const admin = document.createElement('div')
                    admin.innerHTML = `${res.data.admin.username} (Admin)`
                    menu.appendChild(admin)
                    const members = document.createElement('ul')
                    for (let x of res.data.members) {
                        let user;
                        (async () => {
                            try {
                                user = await axios.get(`/document/member/${x}`, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                const li = document.createElement('li')
                                const name = document.createElement('div')
                                name.innerHTML = user.data.data.username
                                li.appendChild(name)
                                if (userId === res.data.admin._id) {
                                    const remove = document.createElement('button')
                                    remove.innerHTML = '❎'
                                    remove.addEventListener('click', async () => {
                                        socket.emit('member-removed', { documentId: res.data._id, userId: user.data.data._id })
                                        members.removeChild(li)
                                    })
                                    li.appendChild(remove)
                                }
                                members.appendChild(li)
                            }
                            catch (e) {
                                err(e)
                            }
                        })()
                    }
                    menu.appendChild(members)
                    if (userId === res.data.admin._id) {
                        const waiting = document.createElement('ul')
                        for (let x of res.data.waiting) {
                            (async () => {
                                try {
                                    const user = await axios.get(`/document/member/${x}`, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                    const li = document.createElement('li')
                                    const name = document.createElement('div')
                                    name.innerHTML = user.data.data.username
                                    const ok = document.createElement('button')
                                    ok.innerHTML = '✅'
                                    ok.addEventListener('click', async () => {
                                        try {
                                            await axios.post('/document/accept', {
                                                documentid: res.data._id,
                                                userId: user.data.data._id
                                            }, {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }
                                            })
                                            socket.emit('member', { roomId: res.data._id, userId: user.data.data._id, type: 'accept' })
                                            waiting.removeChild(li)
                                        }
                                        catch (e) {
                                            err(e)
                                        }
                                    })
                                    const del = document.createElement('button')
                                    del.innerHTML = '❌'
                                    del.addEventListener('click', async () => {
                                        try {
                                            await axios.post('/document/reject', {
                                                documentid: res.data._id,
                                                userId: user.data.data._id
                                            }, {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }
                                            })
                                            socket.emit('member', {
                                                roomId: res.data._id,
                                                documentName: res.data.documentName, userId: user.data.data._id, type: 'reject'
                                            })
                                            waiting.removeChild(li)
                                        }
                                        catch (e) {
                                            err(e)
                                        }
                                    })
                                    li.appendChild(name)
                                    li.appendChild(ok)
                                    li.appendChild(del)
                                    waiting.appendChild(li)
                                }
                                catch (e) {
                                    err(e)
                                }
                            })()
                        }
                        const tag = document.createElement('div')
                        tag.innerHTML = 'Requests'
                        menu.appendChild(tag)
                        menu.appendChild(waiting)
                        const deldoc = document.createElement('button')
                        deldoc.innerHTML = 'Delete Doc'
                        deldoc.id = 'cancel'
                        deldoc.addEventListener('click', () => {
                            socket.emit('del-doc', { id: res.data._id })
                        })
                        menu.appendChild(deldoc)
                    }
                    else {
                        const exit = document.createElement('button')
                        exit.innerHTML = 'Exit ➜]'
                        exit.id = 'cancel'
                        exit.addEventListener('click', async () => {
                            try {
                                await axios.put('/document/exit', { documentId: res.data._id }, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                socket.emit('leave-room', { roomId: res.data._id })
                                alert('exited')
                                const tag = document.getElementById(res.data._id)
                                document.querySelector('#documents').removeChild(tag)
                                document.querySelector('#dashboard').innerHTML = ''
                            }
                            catch (e) {
                                err(e)
                            }
                        })
                        menu.appendChild(exit)
                    }
                    document.querySelector('#dashboard').appendChild(menu)
                }
                catch (e) {
                    err(e)
                }
            })
            const typing = document.createElement('div')
            typing.id = 'typing'
            head.appendChild(typing)
            if (obj.type === 'javascript') {
                const run = document.createElement('button')
                run.id = 'submit'
                run.innerHTML = 'Run'
                run.addEventListener('click', async () => {
                    const old = document.querySelector('#compiler')
                    if (old) {
                        document.querySelector('#dashboard').removeChild(old)
                    }
                    let compiler = document.createElement('div')
                    compiler.id = 'compiler'
                    const close = document.createElement('button')
                    close.innerHTML = 'close'
                    close.id = 'cancel'
                    close.addEventListener('click', () => {
                        document.querySelector('#dashboard').removeChild(compiler)
                    })
                    compiler.appendChild(close)
                    const space = document.createElement('div')
                    compiler.appendChild(space)
                    const fun = (code) => {
                        try {
                            console.log = (e) => {
                                const txt = document.createElement('div')
                                txt.innerHTML = e
                                space.appendChild(txt)
                            }
                            eval(code)
                        }
                        catch (e) {
                            const txt = document.createElement('div')
                            txt.innerHTML = e
                            space.appendChild(txt)
                        }
                    }
                    fun(content.value)
                    document.querySelector('#dashboard').appendChild(compiler)
                })
                head.appendChild(run)
            }
            head.appendChild(ai)
            head.appendChild(save)
            head.appendChild(download)
            head.appendChild(menuButton)
            editor(res.data.content, res.data.type)
        }
        catch (e) {
            err(e)
        }
    })
    document.querySelector('#documents').appendChild(button)
    button.style = "background-color : white;"
}


function downloadFile(filename, type, data) {
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${type}`;
    a.click();
}

window.addEventListener('load', async () => {
    try {
        const res = await axios.get('/user/documents', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        userId = res.data.data[0].userId
        username = res.data.data[0].username
        email = res.data.data[0].email
        for (let x of res.data.data[1]) {
            buttons(x)
        }
        for (let x of res.data.data[2]) {
            buttons(x)
        }
        for (let obj of res.data.data[3]) {
            pending(obj)
        }
        document.querySelector('#username').innerHTML = username
    }
    catch (e) {
        if (e.status === 401) window.location.href = 'http://13.200.243.168:1000/'
        err(e)
    }
})

function pending(obj) {
    socket.emit('join-room', { roomId: obj._id })
    const button = document.createElement('button')
    button.id = obj._id
    const p = document.createElement('div')
    p.innerHTML = obj.documentName
    const img = document.createElement('img')
    img.src = '/img/clock-history.svg'
    button.appendChild(img)
    button.appendChild(p)
    button.style = 'bacground-color : lightgray;'
    document.querySelector('#documents').appendChild(button)
    button.addEventListener('click', () => {
        alert('request in Pending , you will added to the project , Once admin approves you')
    })
}

document.querySelector('#create').addEventListener('click', () => {
    openProject = ''
    document.querySelector('#dashboard').innerHTML = ''
    const form = document.createElement('form')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const div3 = document.createElement('div')
    const namelabel = document.createElement('label')
    namelabel.innerHTML = 'Document Name : '
    const name = document.createElement('input');
    name.type = 'text';
    div1.appendChild(namelabel)
    div1.appendChild(name)
    const typelabel = document.createElement('label')
    typelabel.innerHTML = 'Document Type : '
    const type = document.createElement('select');
    const option1 = document.createElement('option')
    option1.innerHTML = 'Python'
    option1.value = 'python'
    const option2 = document.createElement('option')
    option2.innerHTML = 'Java'
    option2.value = 'java'
    const option3 = document.createElement('option')
    option3.innerHTML = 'C'
    option3.value = 'c'
    const option4 = document.createElement('option')
    option4.innerHTML = 'JavaScript'
    option4.value = 'javascript'
    const option5 = document.createElement('option')
    option5.innerHTML = 'Php'
    option5.value = 'php'
    type.appendChild(option1)
    type.appendChild(option2)
    type.appendChild(option3)
    type.appendChild(option4)
    type.appendChild(option5)
    div2.appendChild(typelabel)
    div2.appendChild(type)
    const submit = document.createElement('button')
    submit.type = 'submit'
    submit.id = 'submit'
    submit.innerHTML = 'Create'
    const cancel = document.createElement('button')
    cancel.type = 'cancel'
    cancel.id = 'cancel'
    cancel.innerHTML = 'cancel'
    cancel.addEventListener('click', (event) => {
        event.preventDefault()
        document.querySelector('#dashboard').innerHTML = ''
    })
    div3.appendChild(submit)
    div3.appendChild(cancel)
    form.appendChild(div1)
    form.appendChild(div2)
    form.appendChild(div3)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        try {
            const obj = {
                documentName: name.value,
                type: type.value
            }
            socket.emit('create-document', obj)
            document.querySelector('#dashboard').innerHTML = ''
        }
        catch (e) {
            err(e)
        }
    })
    document.querySelector('#dashboard').appendChild(form)
})

document.querySelector('#join').addEventListener('click', () => {
    openProject = ''
    document.querySelector('#dashboard').innerHTML = ''
    const form = document.createElement('form')
    const div1 = document.createElement('div')
    const div3 = document.createElement('div')
    const namelabel = document.createElement('label')
    namelabel.innerHTML = 'Document Id : '
    const name = document.createElement('input');
    name.type = 'text';
    div1.appendChild(namelabel)
    div1.appendChild(name)
    const submit = document.createElement('button')
    submit.type = 'submit'
    submit.id = 'submit'
    submit.innerHTML = 'Request'
    const cancel = document.createElement('button')
    cancel.type = 'cancel'
    cancel.id = 'cancel'
    cancel.innerHTML = 'cancel'
    cancel.addEventListener('click', (event) => {
        event.preventDefault()
        document.querySelector('#dashboard').innerHTML = ''
    })
    div3.appendChild(submit)
    div3.appendChild(cancel)
    form.appendChild(div1)
    form.appendChild(div3)
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        try {
            const res = await axios.post('/document/joinrequest', {
                id: name.value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(res)
            alert('Join Request Sent')
            socket.emit('waiting', { roomId: name.value })
            document.querySelector('#dashboard').innerHTML = ''
            pending(res.data.data)

        }
        catch (e) {
            alert('No Document Found')
            err(e)
        }
    })
    document.querySelector('#dashboard').appendChild(form)
})

document.querySelector('#setting').addEventListener('click', () => {
    document.querySelector('#dashboard').innerHTML = ''
    const div = document.createElement('div')
    div.id = 'options'
    const forgot = document.createElement('button')
    forgot.innerHTML = '🔐 Reset password'
    forgot.addEventListener('click', async () => {
        try {
            await axios.post('/user/forgot', { email })
            alert('your password reset link was send to your email')
            localStorage.removeItem('token')
            window.location.href = 'http://13.200.243.168:1000/'
        }
        catch (e) {
            err(e)
        }
    })
    forgot.id = 'submit'
    const del = document.createElement('button')
    del.innerHTML = '⚠️ Delete Account'
    del.addEventListener('click', () => { })
    del.id = 'cancel'
    del.addEventListener('click', async () => {
        try {
            await axios.delete('/user/delete', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            alert('Account Deleted')
            localStorage.removeItem('token')
            window.location.href = 'http://13.200.243.168:1000/'
        }
        catch (e) {
            err(e)
        }
    })
    const logout = document.createElement('button')
    logout.innerHTML = '⏻ LogOut'
    logout.addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href = 'http://13.200.243.168:1000/'
    })
    logout.id = 'edit'
    div.appendChild(forgot)
    div.appendChild(del)
    div.appendChild(logout)
    document.querySelector('#dashboard').appendChild(div)
})

socket.on('waiting', ({ roomId, documentName, id, type }) => {
    if (id === userId) {
        if (type == 'accept') {
            (async () => {
                try {
                    alert(`your Request Aceepted to the project : ${roomId}`)
                    const tag = document.getElementById(roomId)
                    document.querySelector('#documents').removeChild(tag)
                    socket.emit('leave-room', { roomId })
                    const res = await axios.get(`/document/${roomId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    buttons(res.data)
                }
                catch (e) {
                    err(e)
                }
            })()
        }
        else {
            alert(`your Request rejected to the project : ${roomId}`)
            const tag = document.getElementById(roomId)
            document.querySelector('#documents').removeChild(tag)
            socket.emit('leave-room', { roomId })
        }
    }
})

socket.on('join-room', (newDocument) => {
    buttons(newDocument);
    alert('Project Created');
});
let t;
const time = () => {
    t = setTimeout(() => {
        document.querySelector('#typing').innerHTML = ''
    }, 2000)
}
socket.on('content-change', (obj) => {
    update = false
    const { roomId, data } = obj
    if (roomId === openProject) {
        content.value = data
        document.querySelector('#typing').innerHTML = `${obj.name} typing...`
        clearTimeout(t)
        time()
    }
    else {
        const ele = document.getElementById(roomId)
        ele.style = "background-color : lightgreen;"
    }
})

socket.on('member-removed', ({ documentId, id, name }) => {
    if (userId === id) {
        socket.emit('leave-room', { roomId: documentId })
        alert(`your are removed from project : ${name}`)
        const doc = document.getElementById(documentId)
        document.querySelector('#documents').removeChild(doc)
        if (openProject === documentId) {
            document.querySelector('#dashboard').innerHTML = ''
        }
    }
})

socket.on('del-doc', ({ id }) => {
    alert(`project : ${id} has deleted by admin`)
    socket.emit('leave-room', { roomId: id })
    const tag = document.getElementById(id)
    document.querySelector('#documents').removeChild(tag)
    if (openProject === id) {
        document.querySelector('#dashboard').innerHTML = ''
    }
})