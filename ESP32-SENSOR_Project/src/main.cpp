#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

// ================= CONFIGURAÇÕES =================
#define DHTPIN 23
#define DHTTYPE DHT11
#define LIGHT_AO 34
#define LIGHT_DO 35

// ================= INTERVALOS ====================
#define INTERVALO_LEITURA 60000  // 1 minuto em millis (60000 ms)
#define INTERVALO_ENVIO_FILA 1000  // 1 segundo para enviar fila

// ================= OLED CONFIG ===================
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
DHT dht(DHTPIN, DHTTYPE);

// ================= CONFIGURAÇÕES WIFI ============
//const char* ssid = "SEU_SSID";
//const char* password = "SUA_SENHA";
const char* serverUrl = "https://selene-mobile.onrender.com/api/v1/leituras/sensores";

// ================= ESTRUTURA DE DADOS ============
struct LeituraSensor {
  unsigned long timestamp;
  int contador;
  float temperatura;
  float umidade;
  int luzPercent;
  String macAddress;
};

// Buffer para fila de leituras (armazena até 100 leituras)
#define MAX_FILA 100
LeituraSensor filaLeituras[MAX_FILA];
int filaInicio = 0;
int filaFim = 0;
int filaCount = 0;

LeituraSensor ultimaLeitura;

// ================= VARIÁVEIS GLOBAIS =============
unsigned long ultimaLeituraMillis = 0;
unsigned long ultimoEnvioFilaMillis = 0;
int contador = 0;

bool oledOK = false;

bool wifiConnected = false;
bool wifiConnecting = false;
unsigned long lastWifiAttempt = 0;
const long wifiRetryInterval = 30000;
String ipAddress = "0.0.0.0";
String macAddress = "";

bool primeiraLeituraEnviada = false;

// ================= FUNÇÕES DOS SENSORES ==========
int lerLuzCorrigida() {
  return 4095 - analogRead(LIGHT_AO);
}

// ================= FUNÇÕES DE FILA ===============
bool adicionarNaFila(LeituraSensor leitura) {
  if (filaCount >= MAX_FILA) {
    Serial.println("❌ Fila cheia! Descartando leitura mais antiga...");
    filaInicio = (filaInicio + 1) % MAX_FILA;
    filaCount--;
  }
  
  filaLeituras[filaFim] = leitura;
  filaFim = (filaFim + 1) % MAX_FILA;
  filaCount++;
  
  Serial.printf("📦 Leitura #%d adicionada à fila (total: %d)\n", leitura.contador, filaCount);
  return true;
}

bool temLeituraNaFila() {
  return filaCount > 0;
}

LeituraSensor proximaLeituraFila() {
  LeituraSensor leitura = filaLeituras[filaInicio];
  filaInicio = (filaInicio + 1) % MAX_FILA;
  filaCount--;
  return leitura;
}

// ================= FUNÇÕES OLED ==================
void inicializarOLED() {
  Serial.print("🖥️  Inicializando OLED... ");
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("FALHA");
    oledOK = false;
    return;
  }
  Serial.println("OK!");
  oledOK = true;
  display.setRotation(2);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(25, 20);
  display.println("Cultivo de");
  display.setCursor(20, 35);
  display.println("Cogumelos v2.0");
  display.display();
  delay(1500);
}

void atualizarOLED() {
  if (!oledOK) return;
  
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("#");
  display.print(contador);
  
  display.setCursor(50, 0);
  display.print(wifiConnected ? "WiFi" : "---");
  
  if (filaCount > 0) {
    display.print(" F:");
    display.print(filaCount);
  }
  
  display.setCursor(0, 16);
  display.print("T:");
  display.print(ultimaLeitura.temperatura, 1);
  display.print("C");
  
  display.setCursor(64, 16);
  display.print("U:");
  display.print(ultimaLeitura.umidade, 0);
  display.print("%");
  
  display.setCursor(0, 32);
  display.print("Luz:");
  display.print(ultimaLeitura.luzPercent);
  display.print("%");
  
  display.setCursor(0, 48);
  display.print("Prox:");
  
  unsigned long minutosRestantes = (INTERVALO_LEITURA - (millis() - ultimaLeituraMillis)) / 60000;
  unsigned long segundosRestantes = ((INTERVALO_LEITURA - (millis() - ultimaLeituraMillis)) % 60000) / 1000;
  
  display.setCursor(40, 48);
  display.print(minutosRestantes);
  display.print(":");
  if (segundosRestantes < 10) display.print("0");
  display.print(segundosRestantes);
  
  display.display();
}

// ================= FUNÇÕES WIFI ==================
void iniciarConexaoWiFi() {
  if (wifiConnecting || wifiConnected) return;
  Serial.println("📶 Conectando WiFi...");
  wifiConnecting = true;
  WiFi.disconnect(true);
  delay(100);
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  WiFi.begin(ssid, password);
  lastWifiAttempt = millis();
}

void verificarConexaoWiFi() {
  if (!wifiConnecting) return;
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    wifiConnecting = false;
    ipAddress = WiFi.localIP().toString();
    macAddress = WiFi.macAddress();
    Serial.println("\n✅ WiFi conectado!");
    Serial.print("📡 IP: ");
    Serial.println(ipAddress);
    Serial.print("🔗 MAC Original: ");
    Serial.println(macAddress);
    
    // Converter MAC para minúsculas para compatibilidade
    macAddress.toLowerCase();
    Serial.print("🔗 MAC Convertido: ");
    Serial.println(macAddress);
    
  } else if (millis() - lastWifiAttempt > 15000) {
    Serial.println("🔄 Timeout WiFi, tentando novamente...");
    wifiConnecting = false;
    iniciarConexaoWiFi();
  }
}

// ================= ENVIO PARA API =================
bool enviarLeituraParaAPI(LeituraSensor leitura) {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi não conectado!");
    return false;
  }
  
  Serial.println("\n📤 Enviando leitura para API...");
  Serial.print("   MAC: ");
  Serial.println(leitura.macAddress);  // Já está em minúsculas
  Serial.print("   Temp: ");
  Serial.println(leitura.temperatura);
  Serial.print("   Umid: ");
  Serial.println(leitura.umidade);
  Serial.print("   Lux: ");
  Serial.println(leitura.luzPercent);
  
  HTTPClient http;
  http.begin(serverUrl);
  http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000);
  
  // Criar JSON no formato EXATO que a API espera
  StaticJsonDocument<256> doc;
  
  doc["mac"] = leitura.macAddress;  // MAC em minúsculas
  doc["temp"] = leitura.temperatura;
  doc["umid"] = leitura.umidade;
  doc["lux"] = leitura.luzPercent;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("📦 JSON enviado:");
  Serial.println(jsonString);
  
  int httpCode = http.POST(jsonString);
  String response = http.getString();
  http.end();
  
  Serial.print("📡 Código HTTP: ");
  Serial.println(httpCode);
  Serial.print("📨 Resposta: ");
  Serial.println(response);
  
  if (httpCode == 201 || httpCode == 200) {
    Serial.println("✅ Leitura enviada com sucesso!");
    return true;
  } else {
    Serial.println("❌ Falha no envio!");
    return false;
  }
}

// ================= PROCESSAMENTO DE LEITURAS =====
void processarLeitura(LeituraSensor leitura) {
  ultimaLeitura = leitura;
  atualizarOLED();
  
  if (enviarLeituraParaAPI(leitura)) {
    Serial.printf("✅ Leitura #%d enviada com sucesso\n", leitura.contador);
  } else {
    Serial.printf("📦 Leitura #%d adicionada à fila\n", leitura.contador);
    adicionarNaFila(leitura);
  }
}

void processarFila() {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) return;
  if (!temLeituraNaFila()) return;
  
  unsigned long agora = millis();
  if (agora - ultimoEnvioFilaMillis >= INTERVALO_ENVIO_FILA) {
    ultimoEnvioFilaMillis = agora;
    
    LeituraSensor leitura = proximaLeituraFila();
    Serial.printf("📤 Processando fila - leitura #%d (%d restantes)\n", 
                  leitura.contador, filaCount);
    
    if (enviarLeituraParaAPI(leitura)) {
      Serial.printf("✅ Leitura #%d recuperada da fila\n", leitura.contador);
    } else {
      Serial.printf("❌ Falha, leitura #%d volta para fila\n", leitura.contador);
      adicionarNaFila(leitura);
    }
    
    atualizarOLED();
  }
}

// ================= NOVA LEITURA ==================
// ================= NOVA LEITURA ==================
void fazerNovaLeitura() {
  contador++;
  
  LeituraSensor novaLeitura;
  novaLeitura.timestamp = millis();
  novaLeitura.contador = contador;
  novaLeitura.temperatura = dht.readTemperature();
  novaLeitura.umidade = dht.readHumidity();
  novaLeitura.macAddress = macAddress;
  
  int luz = lerLuzCorrigida();
  novaLeitura.luzPercent = (luz * 100) / 4095;
  
  // Validar leituras do DHT
  if (isnan(novaLeitura.temperatura) || isnan(novaLeitura.umidade)) {
    Serial.println("❌ Falha ao ler DHT!");
    novaLeitura.temperatura = ultimaLeitura.temperatura;
    novaLeitura.umidade = ultimaLeitura.umidade;
  }
  
  // 🔥 FORMATAR VALORES ANTES DE MOSTRAR
  float tempFormatada = round(novaLeitura.temperatura * 10) / 10.0;
  float umidFormatada = round(novaLeitura.umidade * 10) / 10.0;
  
  Serial.println("\n🍄 NOVA LEITURA ==================");
  Serial.printf("   #%d\n", contador);
  Serial.printf("   MAC: %s\n", novaLeitura.macAddress.c_str());
  Serial.printf("   Temperatura: %.1f°C\n", tempFormatada);
  Serial.printf("   Umidade: %.1f%%\n", umidFormatada);
  Serial.printf("   Luminosidade: %d%%\n", novaLeitura.luzPercent);
  Serial.println("===================================\n");
  
  processarLeitura(novaLeitura);
}

// ================= SETUP =========================
void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("\n==================================");
  Serial.println("   SISTEMA MONITORAMENTO");
  Serial.println("   PRODUÇÃO DE COGUMELOS v2.0");
  Serial.println("==================================");
  
  Wire.begin(21, 22);
  inicializarOLED();
  
  dht.begin();
  pinMode(LIGHT_AO, INPUT);
  pinMode(LIGHT_DO, INPUT);
  
  // Mostrar configurações
  Serial.println("\n📋 CONFIGURAÇÕES:");
  Serial.print("   SSID: ");
  Serial.println(ssid);
  Serial.print("   Servidor: ");
  Serial.println(serverUrl);
  
  iniciarConexaoWiFi();
  
  // Aguardar WiFi e capturar MAC
  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED && tentativas < 30) {
    delay(500);
    tentativas++;
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    wifiConnecting = false;
    ipAddress = WiFi.localIP().toString();
    macAddress = WiFi.macAddress();
    macAddress.toLowerCase();  // Converter para minúsculas
    
    Serial.println("\n✅ WiFi conectado!");
    Serial.print("📡 IP: ");
    Serial.println(ipAddress);
    Serial.print("🔗 MAC: ");
    Serial.println(macAddress);
  }
  
  // Leitura inicial para o display
  ultimaLeitura.timestamp = millis();
  ultimaLeitura.contador = 0;
  ultimaLeitura.temperatura = dht.readTemperature();
  ultimaLeitura.umidade = dht.readHumidity();
  ultimaLeitura.macAddress = macAddress;
  int luz = lerLuzCorrigida();
  ultimaLeitura.luzPercent = (luz * 100) / 4095;
  
  Serial.println("\n✅ Sistema pronto!");
  Serial.println("==================================\n");
  
  atualizarOLED();
  
  // Primeira leitura imediata se WiFi conectado
  if (wifiConnected) {
    delay(2000);
    Serial.println("📸 Fazendo primeira leitura...");
    ultimaLeituraMillis = millis();
    fazerNovaLeitura();
    primeiraLeituraEnviada = true;
  }
}

// ================= LOOP ==========================
void loop() {
  verificarConexaoWiFi();
  
  unsigned long agora = millis();
  
  // Verifica se é hora de fazer nova leitura
  if (wifiConnected && primeiraLeituraEnviada) {
    if (agora - ultimaLeituraMillis >= INTERVALO_LEITURA) {
      ultimaLeituraMillis = agora;
      fazerNovaLeitura();
    }
  } else if (wifiConnected && !primeiraLeituraEnviada) {
    // Se WiFi conectou mas não fez primeira leitura
    primeiraLeituraEnviada = true;
    ultimaLeituraMillis = millis();
    fazerNovaLeitura();
  }
  
  // Processa fila
  processarFila();
  
  // Atualiza display
  static unsigned long lastDisplayUpdate = 0;
  if (millis() - lastDisplayUpdate > 1000) {
    lastDisplayUpdate = millis();
    atualizarOLED();
  }
  
  // Tenta reconectar WiFi
  if (!wifiConnecting && !wifiConnected) {
    static unsigned long lastWifiRetry = 0;
    if (millis() - lastWifiRetry > wifiRetryInterval) {
      lastWifiRetry = millis();
      iniciarConexaoWiFi();
    }
  }
  
  delay(100);
}