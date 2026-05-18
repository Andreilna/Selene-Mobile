#include <Arduino.h>
#include <esp_camera.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "base64.h"
#include "mbedtls/base64.h"
#include "time.h"

// ================= CONFIG =================
//const char *ssid = "SEU_SSID";
//const char *password = "SUA_SENHA";
const char *serverUrl = "https://selene-mobile.onrender.com/api/v1/leituras/camera";

String macAddress = "";
int contadorFotos = 0;

// ================= WIFI =================
void conectarWiFi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.println("[WiFi] Conectando...");

  int tentativas = 0;

  while (WiFi.status() != WL_CONNECTED && tentativas < 20)
  {
    delay(500);
    Serial.print(".");
    tentativas++;
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    macAddress = WiFi.macAddress();

    Serial.println("\n[WiFi] OK");
    Serial.println(WiFi.localIP());
    Serial.println(macAddress);
  }
  else
  {
    Serial.println("\n[WiFi] FALHOU");
  }
}

// ================= CAMERA =================
bool initCamera()
{
  camera_config_t config;

  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;

  config.pin_d0 = 5;
  config.pin_d1 = 18;
  config.pin_d2 = 19;
  config.pin_d3 = 21;
  config.pin_d4 = 36;
  config.pin_d5 = 39;
  config.pin_d6 = 34;
  config.pin_d7 = 35;

  config.pin_xclk = 0;
  config.pin_pclk = 22;
  config.pin_vsync = 25;
  config.pin_href = 23;

  config.pin_sccb_sda = 26;
  config.pin_sccb_scl = 27;

  config.pin_pwdn = 32;
  config.pin_reset = -1;

  config.xclk_freq_hz = 20000000;

  config.pixel_format = PIXFORMAT_JPEG;

  // 🔥 QUALIDADE MELHORADA
  config.frame_size = FRAMESIZE_VGA; // 640x480
  config.jpeg_quality = 8;
  config.fb_count = 2;

  if (esp_camera_init(&config) != ESP_OK)
  {
    return false;
  }

  // 🔥 AJUSTES DE QUALIDADE
  sensor_t *s = esp_camera_sensor_get();

  s->set_brightness(s, 1);
  s->set_contrast(s, 1);
  s->set_saturation(s, 1);
  s->set_sharpness(s, 1);

  s->set_gain_ctrl(s, 1);
  s->set_exposure_ctrl(s, 1);
  s->set_whitebal(s, 1);

  return true;
}

// ================= ENVIO HTTP =================
bool enviarFoto(uint8_t *imagem, size_t tamanho)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    conectarWiFi();
  }

  HTTPClient http;

  http.setTimeout(15000);

  http.begin(serverUrl);

  http.addHeader("Content-Type", "application/json");

  String base64Image = base64::encode(imagem, tamanho);

  // 🔥 TIMESTAMP REAL
  unsigned long timestamp = time(nullptr);

  String payload = "{";

  payload += "\"equipamento\":\"ESP32-CAM\",";
  payload += "\"mac\":\"" + macAddress + "\",";
  payload += "\"tamanho\":" + String(tamanho) + ",";
  payload += "\"timestamp\":" + String(timestamp) + ",";
  payload += "\"foto\":\"" + base64Image + "\"";

  payload += "}";

  int code = http.POST(payload);

  Serial.print("[HTTP] Code: ");
  Serial.println(code);

  if (code == 200 || code == 201)
  {
    Serial.println("[HTTP] OK");
    http.end();
    return true;
  }

  Serial.println("[HTTP] FAIL");

  http.end();

  return false;
}

// ================= FOTO =================
void tirarFoto()
{
  contadorFotos++;

  Serial.println("\n📸 Foto #" + String(contadorFotos));

  // 🔥 LIGA FLASH
  digitalWrite(4, HIGH);

  delay(2000); // estabiliza iluminação

  // 🔥 DESCARTA FRAMES RUINS
  for (int i = 0; i < 3; i++)
  {
    camera_fb_t *fb = esp_camera_fb_get();

    if (fb)
    {
      esp_camera_fb_return(fb);
    }
  }

  // 🔥 FOTO REAL
  camera_fb_t *fb = esp_camera_fb_get();

  digitalWrite(4, LOW);

  if (!fb)
  {
    Serial.println("ERRO CAMERA");
    return;
  }

  Serial.println("Tamanho: " + String(fb->len));

  enviarFoto(fb->buf, fb->len);

  esp_camera_fb_return(fb);
}

// ================= SETUP =================
void setup()
{
  Serial.begin(115200);

  pinMode(4, OUTPUT);

  conectarWiFi();

  // 🔥 SINCRONIZA HORÁRIO
  configTime(0, 0, "pool.ntp.org");

  Serial.println("[NTP] Sincronizando horario...");

  delay(2000);

  if (!initCamera())
  {
    Serial.println("ERRO CAMERA");

    while (true)
      ;
  }

  Serial.println("SYSTEM OK");
}

// ================= LOOP =================
void loop()
{
  static unsigned long last = 0;

  // 🔥 FOTO A CADA 90 SEGUNDOS
  if (millis() - last > 90000)
  {
    last = millis();

    tirarFoto();
  }

  delay(10);
}