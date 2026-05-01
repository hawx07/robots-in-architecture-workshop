const inventorySummary = [
  "Keyestudio ESP32 smart home kit",
  "Keyestudio/Arduino starter kits",
  "ELEGOO Smart Robot Car V4 with camera",
  "Mini robot arm kits",
  "Fabri Creator robot arm parts",
  "Raspberry Pi Zero 2 W with AI Camera",
  "Freenove crawling robot"
];

const sensors = [
  {
    id: "ultrasonic",
    name: "Ultrasonic Distance",
    part: "HC-SR04 / robot car ultrasonic",
    type: "distance",
    kit: "ELEGOO car + starter kit",
    icon: "range",
    intro: "Measures distance by sending an ultrasonic pulse and timing the echo. This is the main obstacle sensor for the rover and a good proximity trigger for architectural models.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["TRIG", "D9"],
      ["ECHO", "D10"]
    ],
    workshopUse: "Stop a rover before collision, make a model react when someone approaches, or scan distances by mounting the sensor on a servo.",
    notes: [
      "Hard, flat surfaces give cleaner readings than fabric or angled surfaces.",
      "On ESP32, reduce the ECHO voltage to 3.3V with a divider.",
      "Readings below 2 cm and above roughly 400 cm are not reliable."
    ],
    codeTitle: "Distance in centimeters",
    code: `const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  float distanceCm = duration * 0.0343 / 2.0;

  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");
  delay(100);
}`
  },
  {
    id: "line-tracking",
    name: "Line Tracking Sensor",
    part: "ELEGOO infrared tracking module",
    type: "digital",
    kit: "ELEGOO Smart Robot Car",
    icon: "track",
    intro: "Uses infrared reflection to see whether the rover is over a dark line or a bright floor. The car kit uses it for line-following mode.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["Left OUT", "D2"],
      ["Right OUT", "D3"]
    ],
    workshopUse: "Make the rover follow tape paths drawn over a floor plan, detect edges, or turn a moving model into a drawing machine.",
    notes: [
      "Black electrical tape on a matte light surface works well.",
      "Calibrate in the same lighting where the demo will run.",
      "Use two or three sensors for steering; one sensor only gives line/no-line."
    ],
    codeTitle: "Read two line sensors",
    code: `const int leftLine = 2;
const int rightLine = 3;

void setup() {
  Serial.begin(9600);
  pinMode(leftLine, INPUT);
  pinMode(rightLine, INPUT);
}

void loop() {
  bool left = digitalRead(leftLine);
  bool right = digitalRead(rightLine);

  Serial.print("Left: ");
  Serial.print(left);
  Serial.print("  Right: ");
  Serial.println(right);
  delay(50);
}`
  },
  {
    id: "pir",
    name: "PIR Motion Sensor",
    part: "HC-SR501 / smart home PIR",
    type: "digital",
    kit: "ESP32 smart home + starter kit",
    icon: "motion",
    intro: "Detects warm body movement. It outputs HIGH when movement is detected and LOW when the space is quiet.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["OUT on UNO", "D3"],
      ["OUT on ESP32 smart home", "GPIO14"]
    ],
    workshopUse: "Turn on a model light when a visitor passes, open a door servo, or wake up a kinetic facade only when someone is present.",
    notes: [
      "Let the PIR stabilize for 30-60 seconds after power-up.",
      "It detects changing heat patterns, not a still person.",
      "The smart home kit routes the PIR to GPIO14."
    ],
    codeTitle: "Motion trigger",
    code: `const int pirPin = 3;
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int motion = digitalRead(pirPin);
  digitalWrite(ledPin, motion);

  if (motion == HIGH) {
    Serial.println("Motion detected");
  }
  delay(100);
}`
  },
  {
    id: "ldr",
    name: "Photocell / Light Sensor",
    part: "LDR or photocell module",
    type: "analog",
    kit: "starter kit + smart home backup",
    icon: "sun",
    intro: "A light-dependent resistor changes resistance with brightness. It is the simplest way to sense day, night, shadows, or a hand covering a model opening.",
    pins: [
      ["One LDR leg", "5V"],
      ["Other LDR leg", "A0 + 10k to GND"],
      ["10k resistor", "GND"]
    ],
    workshopUse: "Open shading fins in bright light, turn on model lighting at night, or compare two facade sides for solar tracking.",
    notes: [
      "The resistor and LDR form a voltage divider.",
      "If the value moves in the wrong direction, swap the LDR and resistor positions.",
      "Set thresholds from real Serial Monitor readings in the room."
    ],
    codeTitle: "Read brightness",
    code: `const int lightPin = A0;
const int ledPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int lightValue = analogRead(lightPin);
  int ledValue = map(lightValue, 0, 1023, 255, 0);

  analogWrite(ledPin, ledValue);
  Serial.println(lightValue);
  delay(50);
}`
  },
  {
    id: "xht11",
    name: "Temperature + Humidity",
    part: "XHT11 / DHT11 style sensor",
    type: "climate",
    kit: "ESP32 smart home + starter kit",
    icon: "thermo",
    intro: "Reads air temperature and relative humidity. The smart home kit uses an XHT11 module; it behaves like the common DHT11 class of sensors.",
    pins: [
      ["VCC", "5V or 3.3V module dependent"],
      ["GND", "GND"],
      ["DATA on UNO", "D2"],
      ["DATA on ESP32", "choose kit pin / tutorial pin"]
    ],
    workshopUse: "Open a window servo when the model gets hot, display comfort data on the LCD, or compare interior and exterior conditions.",
    notes: [
      "Install the DHT sensor library from Arduino Library Manager.",
      "Read every 1-2 seconds; faster reads often fail.",
      "Keep the sensor away from motor drivers and voltage regulators."
    ],
    codeTitle: "Temperature and humidity",
    code: `#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidity = dht.readHumidity();
  float tempC = dht.readTemperature();

  if (isnan(humidity) || isnan(tempC)) {
    Serial.println("Sensor read failed");
    delay(2000);
    return;
  }

  Serial.print("Temp: ");
  Serial.print(tempC);
  Serial.print(" C  Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  delay(2000);
}`
  },
  {
    id: "analog-temp",
    name: "Analog Temperature",
    part: "LM35 and 10K thermistor",
    type: "analog",
    kit: "starter kit",
    icon: "thermo",
    intro: "The starter kit includes analog temperature parts. LM35 gives a voltage proportional to Celsius; a thermistor changes resistance with temperature.",
    pins: [
      ["LM35 VCC", "5V"],
      ["LM35 GND", "GND"],
      ["LM35 OUT", "A1"],
      ["Thermistor divider", "A1 with 10k resistor"]
    ],
    workshopUse: "Build a basic heat-triggered actuator before using the slower temperature-humidity module.",
    notes: [
      "LM35 formula: Celsius is approximately analog voltage in millivolts divided by 10.",
      "Thermistors need calibration or a lookup formula.",
      "Analog temperature sensors react faster than DHT-style modules."
    ],
    codeTitle: "LM35 temperature",
    code: `const int lm35Pin = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(lm35Pin);
  float voltage = raw * (5.0 / 1023.0);
  float tempC = voltage * 100.0;

  Serial.print("LM35 temp: ");
  Serial.print(tempC);
  Serial.println(" C");
  delay(500);
}`
  },
  {
    id: "gas",
    name: "Gas / Smoke Sensor",
    part: "Analog gas sensor / MQ-2 style",
    type: "analog",
    kit: "ESP32 smart home",
    icon: "wave",
    intro: "Detects gas or smoke concentration as an analog or threshold signal. In the smart home kit it is used for kitchen safety behavior.",
    pins: [
      ["VCC", "5V unless module says otherwise"],
      ["GND", "GND"],
      ["AO on UNO", "A2"],
      ["Smart home signal", "GPIO23"]
    ],
    workshopUse: "Trigger a buzzer and fan when smoke/gas rises, or build an environmental warning model.",
    notes: [
      "Gas sensors need warm-up time before readings stabilize.",
      "Treat values as relative thresholds, not calibrated safety measurements.",
      "Keep flammable tests out of the workshop; simulate with safe threshold changes."
    ],
    codeTitle: "Gas threshold alarm",
    code: `const int gasPin = A2;
const int buzzerPin = 8;
const int threshold = 420;

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int gas = analogRead(gasPin);
  Serial.println(gas);

  digitalWrite(buzzerPin, gas > threshold);
  delay(200);
}`
  },
  {
    id: "steam",
    name: "Steam / Rain Sensor",
    part: "Smart home steam sensor",
    type: "analog",
    kit: "ESP32 smart home",
    icon: "drop",
    intro: "Detects water droplets or moisture on a plate. The smart home kit uses it to simulate rain and automatically close the window.",
    pins: [
      ["VCC", "3.3V or 5V module dependent"],
      ["GND", "GND"],
      ["UNO analog", "A3"],
      ["ESP32 smart home", "GPIO34"]
    ],
    workshopUse: "Close a window servo during simulated rain, detect wet material, or compare exposed and protected areas of a model.",
    notes: [
      "GPIO34 on ESP32 is input-only, which is fine for this sensor.",
      "Dry the plate between tests for repeatable readings.",
      "Avoid leaving the plate wet while powered for long periods."
    ],
    codeTitle: "Rain threshold",
    code: `const int rainPin = A3;
const int ledPin = 13;
const int wetThreshold = 500;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int rain = analogRead(rainPin);
  Serial.println(rain);

  digitalWrite(ledPin, rain > wetThreshold);
  delay(200);
}`
  },
  {
    id: "flame",
    name: "Flame Sensor",
    part: "IR flame module",
    type: "analog",
    kit: "starter kit",
    icon: "sun",
    intro: "Detects infrared light commonly emitted by a flame. Use it as a light/heat experiment module, not as a certified safety device.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["AO", "A4"],
      ["DO optional", "D4"]
    ],
    workshopUse: "Make a warning model or demonstrate how different wavelengths can trigger behavior.",
    notes: [
      "Do not use real flames in an unsafe classroom setup.",
      "Sunlight and IR remotes can affect the reading.",
      "The digital threshold can be adjusted on many modules."
    ],
    codeTitle: "Flame analog read",
    code: `const int flamePin = A4;
const int buzzerPin = 8;
const int threshold = 350;

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int flame = analogRead(flamePin);
  Serial.println(flame);
  digitalWrite(buzzerPin, flame < threshold);
  delay(100);
}`
  },
  {
    id: "sound",
    name: "Sound Sensor",
    part: "microphone sound module",
    type: "analog",
    kit: "starter kit",
    icon: "wave",
    intro: "Detects sound level changes. It is better for claps and loudness changes than for accurate audio measurement.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["AO", "A5"],
      ["DO optional", "D5"]
    ],
    workshopUse: "Start a motion sequence with a clap, visualize room noise, or trigger a model when activity increases.",
    notes: [
      "Set thresholds from live readings in the workshop room.",
      "Use averaging if the value is noisy.",
      "Do not expect speech recognition from this module."
    ],
    codeTitle: "Clap threshold",
    code: `const int soundPin = A5;
const int ledPin = 6;
const int threshold = 620;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int sound = analogRead(soundPin);
  Serial.println(sound);

  if (sound > threshold) {
    digitalWrite(ledPin, HIGH);
    delay(120);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`
  },
  {
    id: "rfid",
    name: "RFID Reader",
    part: "RFID module + key card/tag",
    type: "i2c",
    kit: "ESP32 smart home + starter kit",
    icon: "axis",
    intro: "Reads an RFID card or key tag. The smart home kit uses it for access-control behavior such as opening a door servo.",
    pins: [
      ["VCC", "3.3V for common RC522"],
      ["GND", "GND"],
      ["SDA/SS on UNO", "D10"],
      ["SPI", "D11 MOSI, D12 MISO, D13 SCK"]
    ],
    workshopUse: "Use cards as physical permissions: open a door, select a behavior mode, or identify a group project station.",
    notes: [
      "Some Keyestudio smart home RFID modules connect through I2C; follow the kit pinout if yours is the I2C version.",
      "Common RC522 readers are 3.3V devices.",
      "Install the MFRC522 library for this starter sketch."
    ],
    codeTitle: "Read card UID",
    code: `#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  Serial.print("UID:");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(" ");
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  Serial.println();

  rfid.PICC_HaltA();
}`
  },
  {
    id: "ir-remote",
    name: "IR Receiver",
    part: "IR receiver + remote",
    type: "digital",
    kit: "starter kit + robot car",
    icon: "range",
    intro: "Receives button codes from an infrared remote control. Useful when students need a simple wireless input.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["Signal", "D7"]
    ],
    workshopUse: "Remote-control a rover, switch facade modes, or step through arm poses without touching the model.",
    notes: [
      "Install the IRremote library.",
      "Bright sunlight can interfere with IR.",
      "Use Serial Monitor first to learn the button codes for your remote."
    ],
    codeTitle: "Print remote codes",
    code: `#include <IRremote.hpp>

const int irPin = 7;

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(irPin);
}

void loop() {
  if (IrReceiver.decode()) {
    Serial.println(IrReceiver.decodedIRData.command, HEX);
    IrReceiver.resume();
  }
}`
  },
  {
    id: "joystick",
    name: "Joystick Module",
    part: "XY joystick",
    type: "analog",
    kit: "robot arm + starter kit",
    icon: "joystick",
    intro: "Two potentiometers and a pushbutton in one module. The robot arm kits include joysticks for direct manual control.",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["VRx", "A0"],
      ["VRy", "A1"],
      ["SW", "D8 with INPUT_PULLUP"]
    ],
    workshopUse: "Drive a rover manually, move a two-axis camera platform, or control base and elbow joints on a robot arm.",
    notes: [
      "Center readings are usually near 512, not exactly 512.",
      "Add a deadband around center to prevent drift.",
      "The switch pin is usually LOW when pressed."
    ],
    codeTitle: "Pan and tilt servos",
    code: `#include <Servo.h>

Servo panServo;
Servo tiltServo;

void setup() {
  panServo.attach(9);
  tiltServo.attach(10);
}

void loop() {
  int x = analogRead(A0);
  int y = analogRead(A1);

  int panAngle = map(x, 0, 1023, 0, 180);
  int tiltAngle = map(y, 0, 1023, 30, 150);

  panServo.write(panAngle);
  tiltServo.write(tiltAngle);
  delay(15);
}`
  },
  {
    id: "keypad",
    name: "Buttons + Keypad",
    part: "button modules and 4x4 membrane keypad",
    type: "digital",
    kit: "smart home + starter kit",
    icon: "dial",
    intro: "Simple digital inputs. Buttons are best for one action; the 4x4 keypad is useful for passwords, modes, and menu selection.",
    pins: [
      ["Button one side", "D6"],
      ["Button other side", "GND"],
      ["Mode", "INPUT_PULLUP"],
      ["Keypad rows/cols", "8 digital pins"]
    ],
    workshopUse: "Create a password door, let visitors choose facade modes, or advance a robot-arm pose sequence.",
    notes: [
      "INPUT_PULLUP means pressed reads LOW.",
      "Debounce buttons when using them as toggles.",
      "Install the Keypad library for the 4x4 membrane keypad."
    ],
    codeTitle: "Button toggle",
    code: `const int buttonPin = 6;
const int ledPin = 13;

bool ledState = false;
bool lastButton = HIGH;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  bool button = digitalRead(buttonPin);
  if (button == LOW && lastButton == HIGH) {
    ledState = !ledState;
    digitalWrite(ledPin, ledState);
    delay(40);
  }
  lastButton = button;
}`
  },
  {
    id: "tilt",
    name: "Tilt Switch",
    part: "ball tilt switch",
    type: "digital",
    kit: "starter kit",
    icon: "tilt",
    intro: "A simple switch that changes state when tilted. It is rough but useful for orientation and safety experiments.",
    pins: [
      ["Signal leg", "D12"],
      ["Other leg", "GND"],
      ["Mode", "INPUT_PULLUP"]
    ],
    workshopUse: "Stop a robot when it tips, detect a raised panel, or make a handheld object respond to orientation.",
    notes: [
      "The reading can chatter; add a short delay or debounce.",
      "Use an accelerometer if exact angle matters.",
      "With INPUT_PULLUP, closed usually reads LOW."
    ],
    codeTitle: "Tilt safety input",
    code: `const int tiltPin = 12;
const int ledPin = 13;

void setup() {
  pinMode(tiltPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  bool tilted = digitalRead(tiltPin) == LOW;
  digitalWrite(ledPin, tilted);
}`
  },
  {
    id: "potentiometer",
    name: "Potentiometer",
    part: "10K rotary knob",
    type: "analog",
    kit: "starter kit",
    icon: "dial",
    intro: "A manual analog input. It is ideal for testing servo angles, motor speed, thresholds, and calibration values.",
    pins: [
      ["Outer leg", "5V"],
      ["Middle leg", "A0"],
      ["Outer leg", "GND"]
    ],
    workshopUse: "Tune a threshold live, manually pose a robotic joint, or set motor speed without editing code.",
    notes: [
      "If clockwise lowers the value, swap the two outer legs.",
      "Use map() to convert 0-1023 into servo angles or PWM.",
      "This is a control input, not a world sensor."
    ],
    codeTitle: "Control a servo angle",
    code: `#include <Servo.h>

Servo hingeServo;
const int knobPin = A0;

void setup() {
  hingeServo.attach(9);
}

void loop() {
  int knob = analogRead(knobPin);
  int angle = map(knob, 0, 1023, 0, 180);
  hingeServo.write(angle);
  delay(15);
}`
  }
];

const examples = [
  {
    id: "rain-window",
    name: "Rain Closes Window",
    parts: ["ESP32 smart home kit", "steam sensor", "window servo", "LCD optional"],
    concept: "The steam sensor simulates rain. When the plate gets wet, the ESP32 rotates the window servo closed; when it dries, the window opens again.",
    build: [
      "Steam sensor signal to GPIO34 on the smart home kit.",
      "Window servo signal to GPIO5.",
      "Use the kit power wiring; servo ground and ESP32 ground must be common."
    ],
    pattern: "Rain value -> wet/dry threshold -> servo window",
    code: `#include <ESP32Servo.h>

Servo windowServo;

const int steamPin = 34;
const int servoPin = 5;
const int wetThreshold = 1800;

void setup() {
  Serial.begin(115200);
  windowServo.attach(servoPin, 500, 2500);
  windowServo.write(90);
}

void loop() {
  int rain = analogRead(steamPin);
  Serial.println(rain);

  if (rain > wetThreshold) {
    windowServo.write(0);
  } else {
    windowServo.write(90);
  }

  delay(300);
}`
  },
  {
    id: "gas-ventilation",
    name: "Gas Alarm Ventilation",
    parts: ["ESP32 smart home kit", "gas sensor", "130 fan motor", "buzzer"],
    concept: "The gas sensor triggers an alarm behavior: buzzer on and fan running. This is a safe threshold demo, not a calibrated safety device.",
    build: [
      "Gas sensor signal to GPIO23 on the smart home kit.",
      "Fan motor module IN- to GPIO18 and IN+ to GPIO19.",
      "Buzzer signal to GPIO25."
    ],
    pattern: "Gas value -> warning threshold -> fan + buzzer",
    code: `const int gasPin = 23;
const int fanA = 18;
const int fanB = 19;
const int buzzerPin = 25;

const int gasThreshold = 1;

void setup() {
  Serial.begin(115200);
  pinMode(gasPin, INPUT);
  pinMode(fanA, OUTPUT);
  pinMode(fanB, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int gas = digitalRead(gasPin);
  Serial.println(gas);

  bool alarm = gas == gasThreshold;
  digitalWrite(buzzerPin, alarm);
  digitalWrite(fanA, alarm);
  digitalWrite(fanB, LOW);
  delay(200);
}`
  },
  {
    id: "night-presence",
    name: "Night Presence Light",
    parts: ["PIR motion sensor", "photocell", "LED module", "buzzer optional"],
    concept: "The model turns a light on only when it is dark and someone moves nearby.",
    build: [
      "PIR OUT to D3.",
      "Photocell divider to A0.",
      "LED signal to D6 or use a normal LED with resistor."
    ],
    pattern: "Light level + motion -> conditional output",
    code: `const int pirPin = 3;
const int lightPin = A0;
const int ledPin = 6;

const int darkThreshold = 450;

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(lightPin);
  bool motion = digitalRead(pirPin);
  bool shouldLight = motion && light < darkThreshold;

  digitalWrite(ledPin, shouldLight);
  Serial.println(light);
  delay(100);
}`
  },
  {
    id: "obstacle-rover",
    name: "Obstacle Avoiding Rover",
    parts: ["ELEGOO car", "ultrasonic sensor", "TB6612 motor driver", "DC motors"],
    concept: "The rover drives forward until an object is close, reverses briefly, then turns away.",
    build: [
      "Use the ELEGOO car shield or driver pins from the kit tutorial.",
      "HC-SR04 trigger and echo use two digital pins.",
      "The car kit already includes the battery and motor driver wiring."
    ],
    pattern: "Distance sensor -> if/else behavior -> motor driver",
    code: `const int trigPin = 9;
const int echoPin = 10;

const int leftA = 4;
const int leftB = 5;
const int rightA = 6;
const int rightB = 7;
const int leftPWM = 3;
const int rightPWM = 11;

float distanceCm() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000);
  return duration * 0.0343 / 2.0;
}

void motors(int leftSpeed, int rightSpeed) {
  digitalWrite(leftA, leftSpeed >= 0);
  digitalWrite(leftB, leftSpeed < 0);
  digitalWrite(rightA, rightSpeed >= 0);
  digitalWrite(rightB, rightSpeed < 0);
  analogWrite(leftPWM, abs(leftSpeed));
  analogWrite(rightPWM, abs(rightSpeed));
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(leftA, OUTPUT);
  pinMode(leftB, OUTPUT);
  pinMode(rightA, OUTPUT);
  pinMode(rightB, OUTPUT);
  pinMode(leftPWM, OUTPUT);
  pinMode(rightPWM, OUTPUT);
}

void loop() {
  float d = distanceCm();

  if (d > 0 && d < 20) {
    motors(-140, -140);
    delay(300);
    motors(150, -150);
    delay(450);
  } else {
    motors(160, 160);
  }
}`
  },
  {
    id: "line-rover",
    name: "Line Following Drawing Rover",
    parts: ["ELEGOO car", "line tracking module", "servo pen lift optional"],
    concept: "The rover follows black tape on a floor plan. Add a servo-held pen to turn navigation into a drawing tool.",
    build: [
      "Use two line sensor outputs for left and right detection.",
      "Use the car kit motor driver pins from its tutorial.",
      "Attach a pen lift servo only if the power supply can handle it."
    ],
    pattern: "Left/right line state -> steering -> drawing behavior",
    code: `const int leftLine = 2;
const int rightLine = 3;
const int leftA = 4;
const int leftB = 5;
const int rightA = 6;
const int rightB = 7;
const int leftPWM = 10;
const int rightPWM = 11;

void drive(int leftSpeed, int rightSpeed) {
  digitalWrite(leftA, leftSpeed >= 0);
  digitalWrite(leftB, leftSpeed < 0);
  digitalWrite(rightA, rightSpeed >= 0);
  digitalWrite(rightB, rightSpeed < 0);
  analogWrite(leftPWM, abs(leftSpeed));
  analogWrite(rightPWM, abs(rightSpeed));
}

void setup() {
  pinMode(leftLine, INPUT);
  pinMode(rightLine, INPUT);
  pinMode(leftA, OUTPUT);
  pinMode(leftB, OUTPUT);
  pinMode(rightA, OUTPUT);
  pinMode(rightB, OUTPUT);
  pinMode(leftPWM, OUTPUT);
  pinMode(rightPWM, OUTPUT);
}

void loop() {
  bool left = digitalRead(leftLine);
  bool right = digitalRead(rightLine);

  if (left && right) {
    drive(150, 150);
  } else if (left) {
    drive(80, 150);
  } else if (right) {
    drive(150, 80);
  } else {
    drive(0, 0);
  }
}`
  },
  {
    id: "joystick-arm",
    name: "Joystick Robot Arm",
    parts: ["mini robot arm", "2 joystick modules", "4 MG90S/SG90 servos"],
    concept: "Two joysticks control four robot-arm degrees of freedom: base, shoulder, elbow, and gripper.",
    build: [
      "Joystick axes to A0-A3.",
      "Servo signals to D6, D9, D10, D11.",
      "Use external servo power; do not power four servos from USB."
    ],
    pattern: "Analog joystick values -> mapped servo angles -> arm pose",
    code: `#include <Servo.h>

Servo baseServo;
Servo shoulderServo;
Servo elbowServo;
Servo gripperServo;

void setup() {
  baseServo.attach(6);
  shoulderServo.attach(9);
  elbowServo.attach(10);
  gripperServo.attach(11);
}

void loop() {
  baseServo.write(map(analogRead(A0), 0, 1023, 0, 180));
  shoulderServo.write(map(analogRead(A1), 0, 1023, 30, 150));
  elbowServo.write(map(analogRead(A2), 0, 1023, 30, 150));
  gripperServo.write(map(analogRead(A3), 0, 1023, 20, 120));
  delay(15);
}`
  },
  {
    id: "rfid-door",
    name: "RFID Door Servo",
    parts: ["RFID module", "servo", "LCD optional", "smart home door"],
    concept: "A known RFID tag opens the door servo. Unknown tags keep it closed.",
    build: [
      "Use the RFID wiring for your exact module: SPI RC522 or Keyestudio I2C RFID.",
      "Door servo signal to D9 on UNO or GPIO13 on the ESP32 smart home kit.",
      "Add the LCD to show OPEN or DENIED if time allows."
    ],
    pattern: "Card ID -> permission check -> door servo",
    code: `#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

#define SS_PIN 10
#define RST_PIN 8

MFRC522 rfid(SS_PIN, RST_PIN);
Servo doorServo;

byte allowedUid[] = {0xDE, 0xAD, 0xBE, 0xEF};

bool uidMatches() {
  if (rfid.uid.size != sizeof(allowedUid)) return false;
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] != allowedUid[i]) return false;
  }
  return true;
}

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  doorServo.attach(9);
  doorServo.write(0);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  if (uidMatches()) {
    doorServo.write(90);
    delay(2500);
    doorServo.write(0);
  }

  rfid.PICC_HaltA();
}`
  },
  {
    id: "camera-observer",
    name: "AI Camera Observer",
    parts: ["Raspberry Pi Zero 2 W", "Raspberry Pi AI Camera", "robot car or arm as actuator"],
    concept: "The camera is not an Arduino sensor. Use the Pi for vision and send simple commands to an Arduino/ESP32 over serial, such as LEFT, RIGHT, OPEN, or STOP.",
    build: [
      "Run the AI camera on the Raspberry Pi.",
      "Connect Pi USB/serial to an Arduino or ESP32 controller.",
      "Arduino receives text commands and moves servos or motors."
    ],
    pattern: "Vision on Pi -> serial command -> Arduino actuator",
    code: `#include <Servo.h>

Servo pointerServo;

void setup() {
  Serial.begin(115200);
  pointerServo.attach(9);
  pointerServo.write(90);
}

void loop() {
  if (!Serial.available()) return;

  String command = Serial.readStringUntil('\\n');
  command.trim();

  if (command == "LEFT") pointerServo.write(40);
  if (command == "CENTER") pointerServo.write(90);
  if (command == "RIGHT") pointerServo.write(140);
}`
  }
];

const actuatorNotes = [
  {
    name: "Servo",
    pins: "Signal pin plus 5V and GND",
    use: "Included in the smart home, robot arm, starter, rover camera gimbal, and crawling robot kits.",
    caution: "Use external 5V power for multiple servos; share GND with the controller."
  },
  {
    name: "DC Motor / Fan",
    pins: "Needs a motor driver or kit fan module",
    use: "Used for rover wheels, smart home ventilation, and simple material movement.",
    caution: "Never drive a motor directly from an Arduino pin."
  },
  {
    name: "Stepper",
    pins: "Stepper driver board from the starter kit",
    use: "Good for turntables, sliders, and repeatable model movement.",
    caution: "Steppers draw current while holding position."
  },
  {
    name: "Relay",
    pins: "Digital control pin plus separate load power",
    use: "Switches higher-current lights, pumps, or external devices in demos.",
    caution: "Keep workshop voltages low unless supervised by qualified staff."
  },
  {
    name: "LCD + LED + Buzzer",
    pins: "I2C for LCD, digital/PWM pins for LEDs and buzzer",
    use: "Gives feedback: values, mode names, warnings, and debugging status.",
    caution: "Displays help students understand behavior before adding motion."
  }
];
