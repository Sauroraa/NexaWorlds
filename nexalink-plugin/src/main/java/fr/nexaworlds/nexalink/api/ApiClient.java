package fr.nexaworlds.nexalink.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

public class ApiClient {

    private final String baseUrl;
    private final String apiKey;
    private final Gson gson;

    public ApiClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.gson = new Gson();
    }

    public JsonObject get(String endpoint) throws IOException {
        HttpURLConnection conn = createConnection(endpoint, "GET");
        return readResponse(conn);
    }

    public JsonObject post(String endpoint, Object body) throws IOException {
        HttpURLConnection conn = createConnection(endpoint, "POST");
        conn.setDoOutput(true);

        String json = gson.toJson(body);
        conn.setRequestProperty("Content-Type", "application/json");

        String timestamp = String.valueOf(System.currentTimeMillis());
        conn.setRequestProperty("X-Timestamp", timestamp);
        conn.setRequestProperty("X-Signature", generateHmac(json + timestamp));

        try (OutputStream os = conn.getOutputStream()) {
            os.write(json.getBytes(StandardCharsets.UTF_8));
        }

        return readResponse(conn);
    }

    private HttpURLConnection createConnection(String endpoint, String method) throws IOException {
        URL url = new URL(baseUrl + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setRequestProperty("User-Agent", "NexaLink/1.0");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);
        return conn;
    }

    private JsonObject readResponse(HttpURLConnection conn) throws IOException {
        int status = conn.getResponseCode();
        InputStream is = (status >= 200 && status < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        if (is == null) return new JsonObject();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return gson.fromJson(sb.toString(), JsonObject.class);
        }
    }

    private String generateHmac(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec spec = new SecretKeySpec(apiKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(spec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return "";
        }
    }
}
