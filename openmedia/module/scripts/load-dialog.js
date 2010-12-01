$.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {   
      alert(textStatus);
      alert(errorThrown);
      alert(XMLHttpRequest.responseText);
  }});

function OpenMediaLoadDialog() {
    this._createDialog();
    //this._signedin = false;
}

OpenMediaLoadDialog.prototype._createDialog = function() {
    var self = this;
    var dialog = $(DOM.loadHTML("openmedia", "scripts/load-dialog.html"));
    this._elmts = DOM.bind(dialog);
    this._elmts.cancelButton.click(function() { self._dismiss(); });
    $.getJSON('/command/openmedia/get-catalogs', null, function(data) {
	self._elmts.functionalCase.show().text(data.value);
	self._level = DialogSystem.showDialog(dialog);	
    });
};

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