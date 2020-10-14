package com.wizontech.manoportal.k8s.controller;

// import java.io.IOException;
// import java.io.InputStream;
// import java.net.HttpURLConnection;
import java.net.MalformedURLException;
// import java.net.URL;
// import java.util.Base64;

// import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

// import com.google.gson.JsonObject;
// import com.google.gson.JsonParser;

// import org.apache.commons.io.IOUtils;
// import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

// import lombok.extern.slf4j.Slf4j;

// @Slf4j
@RequestMapping("/trace")
@Controller
public class TraceController {

  // @CrossOrigin(origins = "*")
  @GetMapping
  public String getTrace(Model model, HttpServletResponse response) throws MalformedURLException {
    // URL url = new URL("http://221.153.191.33:12020/kiali/api/authenticate");
    // JsonObject json = null;
    // HttpURLConnection conn;
    // try {
    //   conn = (HttpURLConnection) url.openConnection();

    //   String userCredentials = "admin:admin";
    //   String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
    //   conn.setRequestMethod("POST");
    //   conn.setRequestProperty("Authorization", basicAuth);
    //   // conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

    //   conn.connect();
    //   int responsecode = conn.getResponseCode();
    //   if (responsecode != 200) {
    //     throw new RuntimeException("HttpResponseCode: " + responsecode);
    //   } else {
    //     InputStream inputStr = conn.getInputStream();
    //     String res  = IOUtils.toString(inputStr, "UTF-8");
    //     json = (JsonObject)JsonParser.parseString(res);

    //     // https://ifuwanna.tistory.com/223
    //     // Cookie 1
    //     // Cookie cookie = new Cookie("kiali-token", json.get("token").toString().replaceAll("\"", ""));
    //     // cookie.setPath("http://221.153.191.33:12020");
    //     // response.addCookie(cookie);

    //     // Cookie 2
    //     // response.addHeader("Set-Cookie", "kiali-token="+json.get("token").toString().replaceAll("\"", "")+";Secure;SameSite=None");

    //     // Cookie 3
    //     ResponseCookie cookie =
    //       ResponseCookie
    //         .from("kiali-token", json.get("token").toString().replaceAll("\"", ""))
    //         .sameSite("None")
    //         .secure(true)
    //         .build();
    //     response.addHeader("Set-Cookie", cookie.toString());
    //   }
    //   model.addAttribute("connection", true);
    //   model.addAttribute("token", json.get("token"));
    //   log.debug("json : {}", json);
    // } catch (IOException e) {
    //   e.printStackTrace();
    //   model.addAttribute("connection", false);
    //   return "trace";
    // }
    return "trace";
  }
}