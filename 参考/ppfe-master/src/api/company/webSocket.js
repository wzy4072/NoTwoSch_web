function changeVuexValue(store ,key, value) {
    store.dispatch(key, value);
}
export default {
    wsMonitor(store, url, verification) {
        // const socket = new WebSocket('ws://localhost:8181');
        const socket = new WebSocket(url);

        socket.addEventListener('open', function (event) {
            // socket.send("test");
            socket.send(verification);
        });

        socket.addEventListener('message', function (event) {
            var result = JSON.parse(event.data);
            if(result.setterName) {
                changeVuexValue(store, result.setterName, result.value);    
            }
        });
    }
}