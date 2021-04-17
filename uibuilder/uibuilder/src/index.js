// run this function when the document is loaded
window.onload = function() {
    // Start up uibuilder - see the docs for the optional parameters
    uibuilder.start()
    
    var env = new window.env()
    env.layout(document.getElementById('main'))

    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function(msg){
        env.incoming(msg)
    })
    env.setReceiver(uibuilder.send.bind(this))
    //uibuilder.send( { 'topic': 'from-the-front', 'payload': 42 } )
    
}