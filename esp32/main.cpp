/*
 * AURA OS — Código ESP32 com PlatformIO
 * Controla Servos, Ponte H (Motores DC), Tela TFT ST7789 e Servidor Web
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

WebServer server(80);

// Pinos dos Servos
Servo headPan;
Servo headTilt;
Servo armLeft;
Servo armRight;

void handleRoot() {
    server.send(200, "application/json", "{\"status\":\"AURA ESP32 OK\"}");
}

void handleMove() {
    if (server.hasArg("dir")) {
        String dir = server.arg("dir");
        Serial.println("Comando Movimento: " + dir);
        // Lógica dos motores de passo / DC
    }
    server.send(200, "text/plain", "OK");
}

void handleServo() {
    if (server.hasArg("id") && server.hasArg("angle")) {
        String id = server.arg("id");
        int angle = server.arg("angle").toInt();
        
        if (id == "head_pan") headPan.write(angle);
        if (id == "head_tilt") headTilt.write(angle);
    }
    server.send(200, "text/plain", "OK");
}

void setup() {
    Serial.begin(115200);

    // Attach Servos
    headPan.attach(13);
    headTilt.attach(12);
    armLeft.attach(14);
    armRight.attach(27);

    // WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Conectado IP: ");
    Serial.println(WiFi.localIP());

    server.on("/", handleRoot);
    server.on("/move", handleMove);
    server.on("/servo", handleServo);
    server.begin();
}

void loop() {
    server.handleClient();
}
