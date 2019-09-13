window.onload = function()
{
    test();
};
function test()
{
    console.log('Work');
    var HOST =location.origin;
    console.log(HOST);
    var ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = function(event)
    {
        console.log(event.data);
    }
};
