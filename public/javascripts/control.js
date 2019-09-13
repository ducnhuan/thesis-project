window.onload = function()
{
    test();
};
function test()
{
    console.log('Work');
    var HOST =location.origin.replace(/^http/,'ws');
    console.log(HOST);
    var ws = new WebSocket(HOST);
    ws.onmessage = function(event)
    {
        console.log(event.data);
    }
};
