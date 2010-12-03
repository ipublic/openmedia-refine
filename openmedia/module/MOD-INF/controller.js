
var html = "text/html";
var encoding = "UTF-8";
var ClientSideResourceManager = Packages.com.google.refine.ClientSideResourceManager;

/*
 * Function invoked to initialize the extension.
 */
function init() {
    // Packages.java.lang.System.err.println("Initializing sample extension");
    // Packages.java.lang.System.err.println(module.getMountPoint());

    var RS = Packages.com.google.refine.RefineServlet;
    RS.registerCommand(module, "get-catalogs", new Packages.org.openmedia.refine.commands.GetCatalogsCommand());
    RS.registerCommand(module, "load-dataset", new Packages.org.openmedia.refine.commands.LoadDatasetCommand());
    
    // Script files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/scripts",
        module,
        [
            "scripts/extension.js",
	    "scripts/load-dialog.js"
        ]
    );
    
    // Style files to inject into /project page
    ClientSideResourceManager.addPaths(
        "project/styles",
        module,
        [
            //"styles/extension.less"
        ]
    );
}
