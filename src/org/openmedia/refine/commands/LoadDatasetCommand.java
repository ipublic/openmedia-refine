package org.openmedia.refine.commands;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;

import com.google.refine.browsing.Engine;
import com.google.refine.commands.Command;
import com.google.refine.exporters.CsvExporter;
import com.google.refine.model.Column;
import com.google.refine.model.Project;

public class LoadDatasetCommand extends Command {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String openmediaURL = request.getParameter("openmediaURL");
		if (openmediaURL.endsWith("/"))
    		openmediaURL = openmediaURL.substring(0, openmediaURL.length()-1);
    	
		String title = request.getParameter("title");
		String[] catalogIDs = request.getParameterValues("catalogID[]");
		String description = request.getParameter("description");
		String keywords = request.getParameter("keywords");
        Project project = getProject(request);
        try {
        	Engine engine = getEngine(request, project);
        	CsvExporter csvExporter = new CsvExporter();
        	File tempFile = File.createTempFile(Long.toString(project.id), "csv");
        	FileWriter csvFileWriter = new FileWriter(tempFile);
        	csvExporter.export(project, null, engine, csvFileWriter);
        	csvFileWriter.close();
        	HttpClient httpClient = new DefaultHttpClient();
        	HttpPost httpPost = new HttpPost(openmediaURL+"/admin/datasets.json");
        	
        	// Basic properties
        	MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	ContentBody fileBody = new FileBody(tempFile, "text/csv");
        	entity.addPart("dataset[data_file]", fileBody);
        	entity.addPart("dataset[title]", new StringBody(title));
        	for (int i=0; i<catalogIDs.length; i++) {
        		String catID = catalogIDs[i];
        		entity.addPart("dataset[catalog_ids][]", new StringBody(catID));
        	}
        	entity.addPart("dataset[metadata][description]", new StringBody(description));
        	entity.addPart("dataset[metadata][keywords]", new StringBody(keywords));
        	entity.addPart("dataset[delimiter_character]", new StringBody(","));
        	entity.addPart("dataset[has_header_row]", new StringBody("1"));
        	
        	// dataset properties
        	List<Column> columns = project.columnModel.columns;
        	for (Column col : columns) {
        		String colName = col.getName();
        		entity.addPart("dataset[dataset_properties][][name]", new StringBody(colName));
        		entity.addPart("dataset[dataset_properties][][data_type]", new StringBody("string"));
        	}
        	
        	httpPost.setEntity(entity);
        	HttpResponse httpResponse = httpClient.execute(httpPost);
        	if (httpResponse.getStatusLine().getStatusCode()==201) {
        		respond(response, "OK");
        	}
        	else {
        		response.setStatus(500);
        		httpResponse.getEntity().writeTo(response.getOutputStream());
        	}
        } catch(Exception e) {
        	response.setStatus(500);
        	e.printStackTrace(response.getWriter());
        }		
	}
	

}
