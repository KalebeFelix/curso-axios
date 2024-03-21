const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';

axios.interceptors.request.use((config) => {
    config.headers['hello'] = 'world';
    console.log(config);
    return config
})

axios.interceptors.response.use((response) => {
    console.log("sucesso");
    return response
}, (error) => {
    console.log("erro");
    return Promise.reject(error)
})

const get = async () => {
    try {
        const config = {
            params: {
                _limit: 10
            }
        }
        const response = await axios.get('todos', config);
        renderOutput(response);
    } catch (error) {
        console.log(error);
    }
    
/*
    MESMA COISA QUE:

    axios.get('https://jsonplaceholder.typicode.com/todos', {
        params: {
            _limit: 10
        }
    })
        .then((response) => {
            renderOutput(response);
        })
        .catch((error) => {
            console.log(error);
        })
*/
}

const post = async() => {
    try {
        const data = {
            title: 'foo',
        }
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', data);
        renderOutput(response);
    } catch (error) {
        console.log(error);
    }
}

const put = async() => {
    try {
        const data = {
            title: 'bar',
            body: 'bar',
        }
        const response = await axios.put('https://jsonplaceholder.typicode.com/todos/1', data);
        renderOutput(response);
    } catch (error) {
        console.log(error);
    }
}

const patch = async() => {
    try {
        const data = {
            title: 'hello',
        }
        const response = await axios.patch('https://jsonplaceholder.typicode.com/todos/1', data);
        renderOutput(response);
    } catch (error) {
        console.log(error);
    }
}

const del = async() => {
    try {
        const response = await axios.delete('https://jsonplaceholder.typicode.com/todos/2');
        renderOutput(response);
    } catch (error) {
        console.log(error);
    }
}

const multiple = async() => {
    try {
        const response = await axios.all([
            axios.get('https://jsonplaceholder.typicode.com/todos/1'),
            axios.get('https://jsonplaceholder.typicode.com/todos/2'),
        ]);
        console.log(response[0].data);
        console.log(response[1].data);
    } catch (error) {
        console.log(error);
    }   
}

const transform = async() => {
    try {
        const config = {
            params: {
                _limit: 10
            },
            transformResponse: [ (data) => {
                const payload = JSON.parse(data).map(d => {
                    return{
                        ...d,
                        adrress: 'brasil',
                    }
                });

                return payload;
            }]
        }

        const response = await axios.get('https://jsonplaceholder.typicode.com/todos', config);
        renderOutput(response);

    } catch (error) {
        console.log(error);
    }
}

const errorHandling = async() => {
    try {
        const config = {
            params: {
                _limit: 10
            }
        }
        const response = await axios.get('https://jsonplaceholder.typicode.com/todosS', config);
        renderOutput(response);
    } catch (error) {
        renderOutput(error.response);
    }
}

const cancel = async () => {
    const controller = new AbortController();
    try {
        const config = {
            params: {
                _limit: 5
            },
            signal: controller.signal
        };
        const response = axios.get('https://jsonplaceholder.typicode.com/posts', config);
        renderOutput(response);
    } catch (error) {
        console.error('Erro:', error.message);
    }
    controller.abort()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
