package org.openmedia.refine.commands;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.refine.commands.Command;


public class GetCatalogsCommand extends Command {
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("application/json");
        JSONObject json = new JSONObject();
        try {
            json.put("value", "We are in command!");
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace(response.getWriter());
        }
        respond(response, json.toString());
    }
}
