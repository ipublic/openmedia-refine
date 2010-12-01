
var OpenMediaExtension = { handlers: {} };

OpenMediaExtension.handlers.loadIntoOpenMediaServer = function() {
    new OpenMediaLoadDialog();    
};

ExtensionBar.addExtensionMenu({
    "id" : "openmedia",
    "label" : "OpenMedia",
    "submenu" : [
        {
            "id" : "openmedia/load-into-openmedia-server",
            label: "Load into OpenMedia Server...",
            click: function() { OpenMediaExtension.handlers.loadIntoOpenMediaServer(); }
        }
    ]
});
