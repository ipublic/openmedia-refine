//$.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {   
//      alert(textStatus);
//      alert(errorThrown);
//      alert(XMLHttpRequest.responseText);
//  }});

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

function OpenMediaLoadDialog() {
    this._createDialog();
    //this._signedin = false;
}

OpenMediaLoadDialog.prototype._createDialog = function() {
    var self = this;
    var dialog = $(DOM.loadHTML("openmedia", "scripts/load-dialog.html"));
    this._elmts = DOM.bind(dialog);
    this._elmts.getCatalogsButton.click(function() { self._getCatalogs(); });
    this._elmts.cancelButton.click(function() { self._dismiss(); });
    this._elmts.loadButton.click(function() { self._loadDataset(); });
    this._level = DialogSystem.showDialog(dialog);	

};

OpenMediaLoadDialog.prototype._getCatalogs = function() {
    var self = this;
    var omURL = $('#openmedia-url').val();
    if (omURL=='') {
	alert('Please enter a url for your OpenMedia server');
	return;
    }

    $.ajax({url: '/command/openmedia/get-catalogs', 
	    data: {openmediaURL: omURL}, 
	    success: function(data, textStatus, xhr) {
		var catalogs = eval(data);
		$('#dataset-catalogs').html('');
		for (var i=0; i<catalogs.length; i++) {
		    var c = catalogs[i];
		    $("<option value=\""+c._id+ "\">" + c.title + "</option>").appendTo('#dataset-catalogs');
		}
	    },

	    error: function(xhr, textStatus, errorThrown) {
		alert('Error: ' + xhr.responseText);
	    }
	   });

};

OpenMediaLoadDialog.prototype._loadDataset = function() {
    var errors = [];
    var openmediaURL = $('#openmedia-url').val();
    var title = $('#dataset-title').val();
    var description = $('#dataset-description').val();
    var keywords = $('#dataset-keywords').val();
    var catalogIDs = $('#dataset-catalogs').val();

    if (title==null || title.trim()=='') {
	errors.push("Title is required");
    }

    if (catalogIDs==null || catalogIDs.length==0) {
	errors.push("At least one catalog must be selected");
    }

    if (errors.length > 0) {
	alert('The following errors prevented your dataset from being loaded:\n\n' + errors.join("\n"));
    } else {
	var params = { project: theProject.id, openmediaURL: openmediaURL, title: title, catalogID: catalogIDs };
	if (description != null && description.trim() != '') { params.description = description.trim(); }
	if (keywords != null && keywords.trim() != '') { params.keywords = keywords.trim(); }
		       
	$.ajax({url: '/command/openmedia/load-dataset', data: params, 
		success: function() {
		    alert('loaded');
		},
		error: function(xhr, textStatus, errorThrown) {
		    alert('Error: ' + xhr.responseText);
		}
	       });
    }
}

OpenMediaLoadDialog.prototype._load = function() {
    var self = this;
    alert('TBD');
};

OpenMediaLoadDialog.prototype._dismiss = function() {
    DialogSystem.dismissUntil(this._level - 1);
};

OpenMediaLoadDialog.prototype._show_error = function(msg, error) {
    this._elmts.dialogBody.children().hide();
    this._elmts.errorCase.show();
    this._elmts.errorMessage.text(msg);
    this._elmts.errorDetails.html(
        (('message' in error) ? '<p>' + error.message + '</p>' : '<pre>' + JSON.stringify(error, null, 2) + '</pre>') +
        (('stack' in error) ? '<pre>' + error.stack.replace(/\\n/g,'\n').replace(/\\t/g,'\t') + '</pre>' : "")
    );
    this._end();
    console.log(error);
};

OpenMediaLoadDialog.prototype._end = function() {
    var self = this;
    this._elmts.loadButton.text("Close").removeAttr("disabled").removeClass("button-disabled").unbind().click(function() {
        self._dismiss();
    });
    this._elmts.cancelButton.hide();
    this._elmts.authorization.hide();
};