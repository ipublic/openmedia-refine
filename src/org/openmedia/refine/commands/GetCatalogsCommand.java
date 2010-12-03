package org.openmedia.refine.commands;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import com.google.refine.commands.Command;


public class GetCatalogsCommand extends Command {
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    	String openmediaURL =  request.getParameter("openmediaURL");
    	if (openmediaURL.endsWith("/"))
    		openmediaURL = openmediaURL.substring(0, openmediaURL.length()-1);
    	
    	HttpClient httpClient = new DefaultHttpClient();
    	HttpGet httpGet = new HttpGet(openmediaURL+"/admin/catalogs.json");
    	HttpResponse httpResponse = httpClient.execute(httpGet);
    	HttpEntity httpEntity = httpResponse.getEntity();
    	response.setContentType("application/json");
    	ServletOutputStream outputStream = response.getOutputStream();
		httpEntity.writeTo(outputStream);
		outputStream.close();
    }
}
