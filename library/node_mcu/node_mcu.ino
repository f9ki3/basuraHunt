#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define echoPin D6  
#define trigPin D5  
#define ledPin D4   

const char* ssid = "ROUTER1";       // Replace with your Wi-Fi network name
const char* password = "chloesmartbro123"; // Replace with your Wi-Fi password
const char* serverName = "http://192.168.1.120:5000/data2"; // Replace with your server URL

long duration;
float distance;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT); 
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
  digitalWrite(ledPin, HIGH); 
}

void loop() {
  // Clear the trigger pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read the duration of the pulse from the echo pin
  duration = pulseIn(echoPin, HIGH);
  
  if (duration > 0) { // Check if a valid pulse was received
    // Calculate the distance
    distance = duration * 0.0344 / 2;  // Using the speed of sound in cm/µs
    
    // Print the distance to the serial monitor
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    
    // Wait for 500ms before sending the data
    delay(500); // Add a delay before sending data to the server
    
    // Send data to Flask API
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      WiFiClient client;  // Create a WiFiClient object
      http.begin(client, serverName); // Specify the URL with WiFiClient object
      http.addHeader("Content-Type", "application/json");
      
      String postData = "{\"distance\": " + String(distance) + "}";
      int httpResponseCode = http.POST(postData);
      
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Server Response:");
        Serial.println(response);
        digitalWrite(ledPin, HIGH); // Turn on the LED to indicate successful data transmission
      } else {
        Serial.print("Error: ");
        Serial.println(httpResponseCode);
        digitalWrite(ledPin, LOW); // Turn off the LED to indicate an issue
      }
      
      http.end();
    } else {
      Serial.println("Error: WiFi not connected.");
      digitalWrite(ledPin, LOW); // Turn off the LED to indicate an issue
    }
  } else {
    // Print an error message if no valid pulse was received
    Serial.println("Error: No pulse received.");
    digitalWrite(ledPin, LOW); // Turn off the LED to indicate an issue
  }
  
  // Wait for a second before the next measurement
  delay(1000);
  
  // Turn off the LED after the measurement (for indication purposes)
  digitalWrite(ledPin, LOW);
}
