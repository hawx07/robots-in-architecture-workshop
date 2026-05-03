const inventorySummary = [
  "Keyestudio Smart Robot Arm (FKS0003)",
  "Keyestudio IoT Smart Home Kit (KS5009)",
  "Keyestudio ESP32 Smart Farm Kit (KS0567)",
  "Freenove Tank Robot Kit (FNK0077)"
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

const hardwareElements = [
  {
    id: "arduino-uno",
    name: "Arduino Uno / Compatible Board",
    part: "microcontroller board",
    type: "controller",
    kit: "starter kits, robot car, robot arms",
    icon: "axis",
    intro: "The main beginner controller for sensors and actuators. It reads pins, makes decisions, and drives servos, LEDs, buzzers, relays, and motor drivers.",
    connectionTitle: "Core Connections",
    pins: [
      ["USB", "programming + Serial Monitor"],
      ["5V / GND", "sensor power"],
      ["Digital pins", "buttons, PIR, buzzer, relay"],
      ["Analog pins", "LDR, joystick, temperature"]
    ],
    workshopUse: "Use it for the first day of exercises because the wiring and Arduino IDE examples are simple and well documented.",
    notes: [
      "Digital pins are for on/off signals and PWM output.",
      "Analog pins read changing voltages from 0 to 5V.",
      "Do not power motors directly from Arduino pins."
    ],
    codeTitle: "Minimal pin test",
    code: `const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}`
  },
  {
    id: "esp32-smart-home",
    name: "ESP32 Smart Home Board",
    part: "Keyestudio smart home controller",
    type: "controller",
    kit: "Keyestudio ESP32 smart home kit",
    icon: "axis",
    intro: "A Wi-Fi capable controller mounted inside the smart home kit. It connects the house modules such as PIR, gas, steam, RFID, fan, servos, LCD, LEDs, and buzzer.",
    connectionTitle: "Typical Kit Pins",
    pins: [
      ["PIR", "GPIO14"],
      ["Steam/rain", "GPIO34"],
      ["Gas", "GPIO23"],
      ["Fan", "GPIO18 + GPIO19"]
    ],
    workshopUse: "Use it for architecture scenarios: automatic window, alarm ventilation, access control, and remote-controlled house behavior.",
    notes: [
      "ESP32 analog values are 0-4095, not 0-1023 like Arduino Uno.",
      "GPIO34 is input-only.",
      "Most ESP32 pins are 3.3V logic; check modules before connecting 5V signals."
    ],
    codeTitle: "ESP32 input/output test",
    code: `const int inputPin = 14;
const int outputPin = 25;

void setup() {
  Serial.begin(115200);
  pinMode(inputPin, INPUT);
  pinMode(outputPin, OUTPUT);
}

void loop() {
  int value = digitalRead(inputPin);
  digitalWrite(outputPin, value);
  Serial.println(value);
  delay(100);
}`
  },
  {
    id: "raspberry-pi",
    name: "Raspberry Pi Zero 2 W",
    part: "single-board computer",
    type: "controller",
    kit: "Pi Zero 2 W + battery + heatsink case",
    icon: "axis",
    intro: "A small Linux computer for camera work, AI experiments, web dashboards, and higher-level control. It is not a direct Arduino replacement for simple pin lessons.",
    connectionTitle: "Main Roles",
    pins: [
      ["USB", "programming, serial, power"],
      ["Wi-Fi", "web interface and remote control"],
      ["Camera connector", "AI camera"],
      ["GPIO", "advanced users only"]
    ],
    workshopUse: "Use the Pi when the project needs vision, networking, or a small web server. Send simple commands from the Pi to Arduino/ESP32 for motion.",
    notes: [
      "Boot time is slower than Arduino because it runs an operating system.",
      "Use the battery board for mobile demos.",
      "Keep AI camera processing on the Pi and actuator timing on Arduino/ESP32."
    ]
  },
  {
    id: "ai-camera",
    name: "Raspberry Pi AI Camera",
    part: "camera module",
    type: "vision",
    kit: "Raspberry Pi AI Camera",
    icon: "motion",
    intro: "A camera for visual sensing. It can detect objects, movement, or spatial conditions when connected to the Raspberry Pi.",
    connectionTitle: "Connections",
    pins: [
      ["Camera cable", "Raspberry Pi camera port"],
      ["Processing", "Raspberry Pi"],
      ["Output to Arduino", "USB serial commands"],
      ["Power", "Pi battery or USB supply"]
    ],
    workshopUse: "Make a model respond to where people stand, track a marker, observe a drawing robot, or trigger a servo when an object appears.",
    notes: [
      "Arduino code cannot read this camera directly.",
      "Use simple serial words such as LEFT, RIGHT, OPEN, STOP.",
      "Lighting and background strongly affect camera experiments."
    ]
  },
  {
    id: "robot-car",
    name: "Smart Robot Car",
    part: "ELEGOO car with camera",
    type: "platform",
    kit: "ELEGOO Smart Robot Car V4",
    icon: "track",
    intro: "A complete mobile robot platform with chassis, motors, motor driver, ultrasonic sensor, line tracking, camera mount, battery, and remote-control options.",
    connectionTitle: "Built-In Elements",
    pins: [
      ["Drive", "2 DC motors + motor driver"],
      ["Navigation", "ultrasonic + line tracking"],
      ["View", "camera / gimbal depending on build"],
      ["Power", "battery pack"]
    ],
    workshopUse: "Use it for path following, obstacle avoidance, mapping a floor plan, drawing with a pen, or carrying small sensors through a model.",
    notes: [
      "Start with the official car examples before changing pin maps.",
      "Keep wires away from wheels.",
      "Battery voltage affects motor speed and sensor stability."
    ]
  },
  {
    id: "mini-robot-arm",
    name: "Mini Robot Arm",
    part: "4DOF servo arm kit",
    type: "platform",
    kit: "two mini robot arm kits",
    icon: "joystick",
    intro: "A small servo arm for pick-and-place, pointing, drawing, material pressing, or repetitive architectural model actions.",
    connectionTitle: "Built-In Elements",
    pins: [
      ["Base", "servo signal"],
      ["Shoulder", "servo signal"],
      ["Elbow", "servo signal"],
      ["Gripper", "servo signal"]
    ],
    workshopUse: "Teach joint control, calibration, inverse thinking, and repeatable tool paths without industrial robot complexity.",
    notes: [
      "Power several servos from an external 5V supply.",
      "Write down safe angle limits before running sequences.",
      "Use joysticks first, then recorded poses."
    ]
  },
  {
    id: "fabri-arm",
    name: "Fabri Creator Robot Arm Parts",
    part: "larger robot arm kit",
    type: "platform",
    kit: "Robot Arm - Complete Parts",
    icon: "axis",
    intro: "A more substantial arm assembly for custom end effectors and stronger spatial experiments than the small acrylic arm.",
    connectionTitle: "Use Planning",
    pins: [
      ["Structure", "assembled arm parts"],
      ["Joints", "servos or motors from kit"],
      ["Controller", "Arduino-compatible board"],
      ["End effector", "custom 3D printed tool"]
    ],
    workshopUse: "Use it for group demos such as pressing material, moving a marker, pushing model panels, or presenting robotic arm logic.",
    notes: [
      "Build and test one joint at a time.",
      "Check mechanical stops before powering servos.",
      "Use 3D printed adapters for architectural tools."
    ]
  },
  {
    id: "spider-robot",
    name: "Crawling Robot",
    part: "Freenove spider / crawling robot",
    type: "platform",
    kit: "Arduino robot spider",
    icon: "motion",
    intro: "A multi-servo walking robot. It is useful for understanding gait, balance, repeated motion, and body coordination.",
    connectionTitle: "Built-In Elements",
    pins: [
      ["Legs", "multiple servos"],
      ["Controller", "kit controller board"],
      ["Power", "battery pack"],
      ["Optional sensing", "distance or remote modules"]
    ],
    workshopUse: "Use it as an advanced demonstrator after students understand single-servo and robot-arm motion.",
    notes: [
      "Calibrate servo centers carefully.",
      "Walking robots are power hungry.",
      "Debug one leg pair before running full gait code."
    ]
  },
  {
    id: "servo",
    name: "Servo Motor",
    part: "SG90 / MG90S style servo",
    type: "actuator",
    kit: "smart home, arms, starter kit, robot car",
    icon: "dial",
    intro: "A motor that moves to a commanded angle. It is the most useful actuator for doors, windows, grippers, pointers, joints, and kinetic facade panels.",
    connectionTitle: "Wiring",
    pins: [
      ["Signal", "PWM-capable digital pin"],
      ["Red", "5V external supply for loaded servos"],
      ["Brown/black", "GND"],
      ["Common ground", "servo GND to controller GND"]
    ],
    workshopUse: "Open windows, rotate fins, lift pens, grip objects, move robot arms, and create repeatable kinetic model movements.",
    notes: [
      "Do not power multiple servos from Arduino USB.",
      "Limit angle ranges to avoid forcing the mechanism.",
      "Servo.write(90) usually means center."
    ],
    codeTitle: "Sweep a servo",
    code: `#include <Servo.h>

Servo servo;

void setup() {
  servo.attach(9);
}

void loop() {
  servo.write(20);
  delay(800);
  servo.write(140);
  delay(800);
}`
  },
  {
    id: "dc-motor",
    name: "DC Motor / Fan",
    part: "wheel motors and smart home fan",
    type: "actuator",
    kit: "robot car + smart home kit",
    icon: "wave",
    intro: "A continuous-rotation motor. DC motors are used for rover wheels, fans, pumps, and spinning prototypes.",
    connectionTitle: "Wiring",
    pins: [
      ["Motor", "driver output or fan module"],
      ["Direction", "driver IN pins"],
      ["Speed", "PWM enable pin"],
      ["Power", "battery or motor supply"]
    ],
    workshopUse: "Drive rovers, create ventilation, spin material samples, or test continuous robotic behavior.",
    notes: [
      "Never connect a DC motor directly to an Arduino pin.",
      "Use a motor driver, transistor module, or the kit fan module.",
      "Always share GND between motor driver and controller."
    ],
    codeTitle: "PWM motor speed",
    code: `const int motorPin = 5;

void setup() {
  pinMode(motorPin, OUTPUT);
}

void loop() {
  analogWrite(motorPin, 80);
  delay(1000);
  analogWrite(motorPin, 200);
  delay(1000);
}`
  },
  {
    id: "stepper",
    name: "Stepper Motor",
    part: "28BYJ-48 + ULN2003 driver",
    type: "actuator",
    kit: "starter kit",
    icon: "dial",
    intro: "A motor that moves in discrete steps. It is good for turntables, sliders, calibrated shutters, and repeatable motion studies.",
    connectionTitle: "Wiring",
    pins: [
      ["IN1", "D8"],
      ["IN2", "D9"],
      ["IN3", "D10"],
      ["IN4", "D11"],
      ["Power", "5V driver supply"]
    ],
    workshopUse: "Rotate a model slowly, index between facade positions, or move a small stage by a known amount.",
    notes: [
      "Use the driver board; do not wire the stepper directly to Arduino.",
      "Steppers draw current while holding still.",
      "Keep speed modest with the small 28BYJ-48 motor."
    ],
    codeTitle: "Stepper rotation",
    code: `#include <Stepper.h>

const int stepsPerRevolution = 2048;
Stepper stepper(stepsPerRevolution, 8, 10, 9, 11);

void setup() {
  stepper.setSpeed(10);
}

void loop() {
  stepper.step(512);
  delay(500);
  stepper.step(-512);
  delay(500);
}`
  },
  {
    id: "relay",
    name: "Relay Module",
    part: "single-channel relay",
    type: "output",
    kit: "starter kit",
    icon: "touch",
    intro: "An electrically controlled switch. Use it to switch a separate low-voltage circuit from an Arduino pin.",
    connectionTitle: "Wiring",
    pins: [
      ["VCC", "5V"],
      ["GND", "GND"],
      ["IN", "digital pin"],
      ["Load", "COM + NO terminals"]
    ],
    workshopUse: "Switch low-voltage lamps, pumps, solenoids, or external demonstrator circuits from sensor logic.",
    notes: [
      "Avoid mains voltage in the workshop.",
      "Some relay modules are active LOW.",
      "Use MOSFET modules for fast PWM loads instead of relays."
    ]
  },
  {
    id: "display",
    name: "Display Modules",
    part: "I2C LCD / 7-segment / LED matrix",
    type: "output",
    kit: "smart home + starter kit",
    icon: "axis",
    intro: "Displays show values, modes, warnings, and debugging status so participants can understand what the robot thinks.",
    connectionTitle: "Typical Wiring",
    pins: [
      ["I2C SDA", "A4 on Uno / kit SDA"],
      ["I2C SCL", "A5 on Uno / kit SCL"],
      ["VCC", "5V or 3.3V module dependent"],
      ["GND", "GND"]
    ],
    workshopUse: "Show temperature, rain state, RFID access status, current robot mode, or countdowns during automated motion.",
    notes: [
      "I2C modules need the correct address, often 0x27 or 0x3F.",
      "Displays are excellent for debugging before adding motors.",
      "LED matrices and 7-segment displays are better for icons or numbers than long text."
    ]
  },
  {
    id: "led-buzzer",
    name: "LEDs, RGB LED, and Buzzer",
    part: "visual and audio feedback",
    type: "output",
    kit: "all starter kits + smart home kit",
    icon: "sun",
    intro: "Simple feedback elements for status, warnings, and testing. They help debug logic before connecting stronger actuators.",
    connectionTitle: "Wiring",
    pins: [
      ["LED anode", "digital pin through resistor"],
      ["LED cathode", "GND"],
      ["Buzzer signal", "digital pin"],
      ["RGB", "one PWM pin per color"]
    ],
    workshopUse: "Show sensor thresholds, alarm states, robot modes, countdowns, and successful RFID/keypad input.",
    notes: [
      "Always use resistors with bare LEDs.",
      "PWM pins can dim LEDs.",
      "Buzzers can be annoying during class; test briefly."
    ],
    codeTitle: "Blink and beep",
    code: `const int ledPin = 13;
const int buzzerPin = 8;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  tone(buzzerPin, 1000, 100);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}`
  },
  {
    id: "breadboard-wires",
    name: "Breadboards, Jumper Wires, Terminals",
    part: "connection hardware",
    type: "build",
    kit: "starter kits + extra wire budget",
    icon: "track",
    intro: "The physical connection layer for temporary circuits. Breadboards are for prototypes; terminal blocks and better wiring are for moving robots.",
    connectionTitle: "Use",
    pins: [
      ["Breadboard rails", "5V and GND distribution"],
      ["Jumper wires", "short signal connections"],
      ["Terminal blocks", "motor and power wiring"],
      ["Dupont leads", "module-to-board wiring"]
    ],
    workshopUse: "Prototype quickly on the bench, then secure wires before adding motion or mounting circuits inside models.",
    notes: [
      "Loose wires cause most beginner robot failures.",
      "Use color convention: red for power, black for GND.",
      "Moving platforms need strain relief and taped or tied cables."
    ]
  },
  {
    id: "passives",
    name: "Resistors, Capacitors, Diodes, Transistors",
    part: "basic electronic parts",
    type: "build",
    kit: "starter kits",
    icon: "wave",
    intro: "Support parts that make circuits safe and stable: resistors limit current, capacitors smooth power, diodes protect from coils, transistors switch loads.",
    connectionTitle: "Common Uses",
    pins: [
      ["Resistor", "LED current limit / voltage divider"],
      ["Capacitor", "power smoothing"],
      ["Diode", "flyback protection"],
      ["Transistor", "switch motors, fans, relays"]
    ],
    workshopUse: "Build sensor voltage dividers, protect relay or motor circuits, and switch loads that Arduino pins cannot drive directly.",
    notes: [
      "A 220 ohm resistor is typical for basic LEDs.",
      "A 10K resistor is typical for pullups and LDR dividers.",
      "Transistors and MOSFETs need a shared ground with the controller."
    ]
  },
  {
    id: "power",
    name: "Batteries and Power Supplies",
    part: "robot batteries, USB power, Pi battery",
    type: "power",
    kit: "robot car, Pi battery, smart home kit",
    icon: "drop",
    intro: "Power determines reliability. Motors and servos often need separate power from the controller, while all grounds must still connect.",
    connectionTitle: "Power Rules",
    pins: [
      ["Arduino USB", "programming and light loads"],
      ["Servo 5V", "external 5V supply"],
      ["Motor battery", "driver motor input"],
      ["Common GND", "connect all grounds"]
    ],
    workshopUse: "Plan power before building mobile robots, arms, or fans. Most unstable demos are actually power problems.",
    notes: [
      "Never short a battery.",
      "Use the correct voltage for each board.",
      "If servos twitch or the board resets, power is probably insufficient."
    ]
  }
];

sensors.push(...hardwareElements);

const examples = [];

const creativeExamples = [
  {
    id: "climate-breathing-facade",
    name: "Climate Breathing Facade",
    parts: ["DHT11/XHT11", "photocell", "PIR sensor", "3 servos", "fan", "RGB LED"],
    concept: "A facade module reacts differently to heat, sunlight, and presence. It opens upper fins for ventilation, rotates shading fins in bright light, and only animates when someone is nearby.",
    build: [
      "DHT DATA to D2, photocell divider to A0, PIR OUT to D3.",
      "Three fin servos to D6, D9, D10 with external 5V servo power.",
      "Fan driver or fan module to D5, RGB/status LED to PWM pins."
    ],
    pattern: "Temperature + light + presence -> comfort state -> multiple facade actuators",
    code: `#include <DHT.h>
#include <Servo.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
Servo ventServo;
Servo shadeLeft;
Servo shadeRight;

const int lightPin = A0;
const int pirPin = 3;
const int fanPin = 5;
const int redPin = 11;
const int greenPin = 12;

bool hotMode = false;
bool brightMode = false;

void setStatus(bool alert) {
  digitalWrite(redPin, alert);
  digitalWrite(greenPin, !alert);
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(pirPin, INPUT);
  pinMode(fanPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  ventServo.attach(6);
  shadeLeft.attach(9);
  shadeRight.attach(10);
}

void loop() {
  float tempC = dht.readTemperature();
  int light = analogRead(lightPin);
  bool occupied = digitalRead(pirPin);

  if (isnan(tempC)) return;

  if (tempC > 28.0) hotMode = true;
  if (tempC < 26.0) hotMode = false;

  if (light > 720) brightMode = true;
  if (light < 560) brightMode = false;

  if (occupied && hotMode) {
    ventServo.write(120);
    analogWrite(fanPin, 190);
  } else {
    ventServo.write(25);
    analogWrite(fanPin, 0);
  }

  if (brightMode) {
    shadeLeft.write(35);
    shadeRight.write(145);
  } else {
    shadeLeft.write(90);
    shadeRight.write(90);
  }

  setStatus(hotMode || brightMode);
  delay(1000);
}`
  },
  {
    id: "rain-heat-skin",
    name: "Rain + Heat Double Skin",
    parts: ["steam/rain sensor", "LM35 temperature sensor", "servo window", "fan", "buzzer", "LCD optional"],
    concept: "A double-skin facade closes during rain, but if the cavity overheats it switches to a protected ventilation mode with a fan and warning state.",
    build: [
      "Rain/steam sensor to A3 and LM35 to A1.",
      "Window servo to D9, fan driver to D5, buzzer to D8.",
      "Use separate 5V power for the fan and servo, with shared ground."
    ],
    pattern: "Rain + heat -> mode selection -> window, fan, and warning feedback",
    code: `#include <Servo.h>

Servo windowServo;

const int rainPin = A3;
const int tempPin = A1;
const int fanPin = 5;
const int buzzerPin = 8;

enum Mode { OPEN_DRY, CLOSED_RAIN, PROTECTED_VENT };
Mode mode = OPEN_DRY;

float readTempC() {
  int raw = analogRead(tempPin);
  return raw * (5.0 / 1023.0) * 100.0;
}

void setup() {
  Serial.begin(9600);
  pinMode(fanPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  windowServo.attach(9);
}

void loop() {
  int rain = analogRead(rainPin);
  float tempC = readTempC();

  bool wet = rain > 520;
  bool overheated = tempC > 31.0;

  if (wet && overheated) mode = PROTECTED_VENT;
  else if (wet) mode = CLOSED_RAIN;
  else mode = OPEN_DRY;

  if (mode == OPEN_DRY) {
    windowServo.write(110);
    analogWrite(fanPin, 0);
    noTone(buzzerPin);
  } else if (mode == CLOSED_RAIN) {
    windowServo.write(15);
    analogWrite(fanPin, 0);
    noTone(buzzerPin);
  } else {
    windowServo.write(45);
    analogWrite(fanPin, 220);
    tone(buzzerPin, 900, 80);
  }

  Serial.print("rain=");
  Serial.print(rain);
  Serial.print(" temp=");
  Serial.print(tempC);
  Serial.print(" mode=");
  Serial.println(mode);
  delay(500);
}`
  },
  {
    id: "material-curing-rig",
    name: "Material Curing Turntable",
    parts: ["LM35 or thermistor", "steam/moisture plate", "stepper motor", "servo marker", "LED/buzzer"],
    concept: "A rotating test rig watches a wet material sample dry. It slowly indexes the sample, marks the drying state with a servo pointer, and alerts when the material crosses a threshold.",
    build: [
      "Temperature sensor to A1 and wetness plate to A2.",
      "Stepper driver IN1-IN4 to D8-D11.",
      "Servo marker to D6 and buzzer/LED to D5."
    ],
    pattern: "Material state over time -> turntable indexing -> physical indicator",
    code: `#include <Stepper.h>
#include <Servo.h>

const int stepsPerTurn = 2048;
Stepper tableMotor(stepsPerTurn, 8, 10, 9, 11);
Servo markerServo;

const int wetPin = A2;
const int tempPin = A1;
const int alertPin = 5;

unsigned long lastStepTime = 0;
int wetAverage = 0;

void setup() {
  Serial.begin(9600);
  tableMotor.setSpeed(8);
  markerServo.attach(6);
  pinMode(alertPin, OUTPUT);
  wetAverage = analogRead(wetPin);
}

void loop() {
  int wetRaw = analogRead(wetPin);
  wetAverage = (wetAverage * 9 + wetRaw) / 10;

  int tempRaw = analogRead(tempPin);
  float tempC = tempRaw * (5.0 / 1023.0) * 100.0;

  int dryness = map(wetAverage, 850, 350, 0, 100);
  dryness = constrain(dryness, 0, 100);
  markerServo.write(map(dryness, 0, 100, 20, 160));

  if (millis() - lastStepTime > 5000) {
    tableMotor.step(128);
    lastStepTime = millis();
  }

  bool ready = dryness > 75 && tempC < 35.0;
  digitalWrite(alertPin, ready);

  Serial.print("dryness=");
  Serial.print(dryness);
  Serial.print(" temp=");
  Serial.println(tempC);
  delay(300);
}`
  },
  {
    id: "acoustic-light-field",
    name: "Acoustic Light Field",
    parts: ["sound sensor", "photocell", "potentiometer", "RGB LEDs", "2 servos"],
    concept: "A small room model reacts to activity: sound pulses ripple through light, while a pair of servo apertures open more when the space is both dark and loud.",
    build: [
      "Sound sensor to A5, photocell to A0, sensitivity knob to A1.",
      "RGB LED channels or LED strips to PWM pins through drivers.",
      "Two aperture servos to D9 and D10."
    ],
    pattern: "Sound envelope + darkness + manual sensitivity -> light and aperture movement",
    code: `#include <Servo.h>

Servo apertureA;
Servo apertureB;

const int soundPin = A5;
const int lightPin = A0;
const int knobPin = A1;
const int redPin = 3;
const int bluePin = 5;

int soundEnvelope = 0;

void setup() {
  apertureA.attach(9);
  apertureB.attach(10);
  pinMode(redPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  int sound = analogRead(soundPin);
  int light = analogRead(lightPin);
  int knob = analogRead(knobPin);
  int threshold = map(knob, 0, 1023, 520, 760);

  int pulse = max(0, sound - threshold);
  soundEnvelope = max(pulse, soundEnvelope - 8);
  soundEnvelope = constrain(soundEnvelope, 0, 300);

  bool dark = light < 420;
  int aperture = dark ? map(soundEnvelope, 0, 300, 20, 140) : 20;

  apertureA.write(aperture);
  apertureB.write(160 - aperture);
  analogWrite(redPin, map(soundEnvelope, 0, 300, 0, 255));
  analogWrite(bluePin, dark ? 120 : 20);

  delay(30);
}`
  },
  {
    id: "rfid-kinetic-thresholds",
    name: "RFID Mode Wall",
    parts: ["RFID reader", "photocell", "temperature sensor", "servo latch", "LEDs", "buzzer"],
    concept: "Different RFID cards switch the wall between exhibition modes. Each mode changes the light threshold, servo latch behavior, and warning feedback.",
    build: [
      "RFID reader to SPI pins or the smart-home RFID connector.",
      "Photocell to A0 and temperature sensor to A1.",
      "Latch servo to D9, status LEDs to PWM pins, buzzer to D8."
    ],
    pattern: "Physical identity token -> behavior profile -> sensor thresholds and actuator response",
    code: `#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

#define SS_PIN 10
#define RST_PIN 7

MFRC522 rfid(SS_PIN, RST_PIN);
Servo latchServo;

const int lightPin = A0;
const int tempPin = A1;
const int buzzerPin = 8;
const int ledPin = 6;

int mode = 0;

void readCardMode() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  byte lastByte = rfid.uid.uidByte[rfid.uid.size - 1];
  mode = lastByte % 3;
  tone(buzzerPin, 700 + mode * 200, 120);
  rfid.PICC_HaltA();
}

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  latchServo.attach(9);
  pinMode(buzzerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  readCardMode();

  int light = analogRead(lightPin);
  float tempC = analogRead(tempPin) * (5.0 / 1023.0) * 100.0;

  int lightLimit[] = {350, 550, 750};
  int openAngle[] = {35, 90, 145};
  bool active = light < lightLimit[mode] || tempC > 30.0;

  latchServo.write(active ? openAngle[mode] : 10);
  analogWrite(ledPin, active ? 220 : 25);

  Serial.print("mode=");
  Serial.print(mode);
  Serial.print(" light=");
  Serial.print(light);
  Serial.print(" temp=");
  Serial.println(tempC);
  delay(200);
}`
  },
  {
    id: "pan-tilt-proximity-map",
    name: "Pan-Tilt Proximity Mapper",
    parts: ["ultrasonic sensor", "2 servos", "joystick", "LED/buzzer", "optional LCD"],
    concept: "A custom scanning head sweeps an ultrasonic sensor over a model and reacts to the closest direction. Manual joystick override lets students compare automatic and hand control.",
    build: [
      "Ultrasonic sensor mounted on a two-servo pan/tilt bracket.",
      "TRIG to D4, ECHO to D5, pan servo to D9, tilt servo to D10.",
      "Joystick to A0/A1 for manual override, buzzer to D8."
    ],
    pattern: "Servo scan -> distance map -> closest direction response",
    code: `#include <Servo.h>

Servo panServo;
Servo tiltServo;

const int trigPin = 4;
const int echoPin = 5;
const int buzzerPin = 8;

float distanceCm() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 25000);
  return duration * 0.0343 / 2.0;
}

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  panServo.attach(9);
  tiltServo.attach(10);
  tiltServo.write(80);
}

void loop() {
  int closestAngle = 90;
  float closestDistance = 999;

  for (int angle = 35; angle <= 145; angle += 10) {
    panServo.write(angle);
    delay(120);
    float d = distanceCm();
    if (d > 0 && d < closestDistance) {
      closestDistance = d;
      closestAngle = angle;
    }
  }

  panServo.write(closestAngle);
  if (closestDistance < 25) {
    tone(buzzerPin, 1200, 80);
    tiltServo.write(120);
  } else {
    tiltServo.write(80);
  }

  Serial.print("closest angle=");
  Serial.print(closestAngle);
  Serial.print(" distance=");
  Serial.println(closestDistance);
  delay(400);
}`
  },
  {
    id: "adaptive-threshold-lab",
    name: "Adaptive Threshold Lab",
    parts: ["potentiometer", "PIR", "light sensor", "temperature sensor", "servo", "fan", "LEDs"],
    concept: "A teaching rig where the potentiometer changes the system sensitivity live. Students can see how one threshold affects comfort decisions and motion.",
    build: [
      "Potentiometer to A2, light to A0, temperature to A1, PIR to D3.",
      "Servo indicator to D9, fan driver to D5, LEDs to D6/D7.",
      "Mark the dial with paper labels so threshold changes are visible."
    ],
    pattern: "Manual calibration -> combined sensor score -> actuator mix",
    code: `#include <Servo.h>

Servo indicator;

const int lightPin = A0;
const int tempPin = A1;
const int knobPin = A2;
const int pirPin = 3;
const int fanPin = 5;
const int okLed = 6;
const int alertLed = 7;

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(fanPin, OUTPUT);
  pinMode(okLed, OUTPUT);
  pinMode(alertLed, OUTPUT);
  indicator.attach(9);
}

void loop() {
  int light = analogRead(lightPin);
  float tempC = analogRead(tempPin) * (5.0 / 1023.0) * 100.0;
  int knob = analogRead(knobPin);
  bool occupied = digitalRead(pirPin);

  int sensitivity = map(knob, 0, 1023, 20, 80);
  int heatScore = constrain((int)((tempC - 22.0) * 10), 0, 100);
  int lightScore = map(light, 0, 1023, 0, 100);
  int presenceScore = occupied ? 30 : 0;
  int score = (heatScore + lightScore + presenceScore) / 2;

  bool active = score > sensitivity;
  indicator.write(map(score, 0, 100, 20, 160));
  analogWrite(fanPin, active ? map(score, 0, 100, 90, 230) : 0);
  digitalWrite(okLed, !active);
  digitalWrite(alertLed, active);

  Serial.print("score=");
  Serial.print(score);
  Serial.print(" threshold=");
  Serial.println(sensitivity);
  delay(200);
}`
  },
  {
    id: "vision-serial-installation",
    name: "Vision-Driven Kinetic Marker",
    parts: ["Raspberry Pi AI Camera", "Arduino/ESP32", "2 servos", "LED strip", "buzzer"],
    concept: "The Pi handles vision and sends simple text commands. The Arduino turns those commands into physical movement, so the installation remains modular and easy to debug.",
    build: [
      "AI camera connects to the Raspberry Pi, not directly to Arduino.",
      "Pi sends serial commands over USB: LEFT, RIGHT, CENTER, ALERT, IDLE.",
      "Arduino moves two servos and feedback LEDs from those text commands."
    ],
    pattern: "Vision computer -> serial command protocol -> kinetic marker",
    code: `#include <Servo.h>

Servo panServo;
Servo markerServo;

const int ledPin = 6;
const int buzzerPin = 8;

void setup() {
  Serial.begin(115200);
  panServo.attach(9);
  markerServo.attach(10);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  panServo.write(90);
  markerServo.write(30);
}

void loop() {
  if (!Serial.available()) return;

  String command = Serial.readStringUntil('\\n');
  command.trim();

  if (command == "LEFT") panServo.write(45);
  else if (command == "RIGHT") panServo.write(135);
  else if (command == "CENTER") panServo.write(90);
  else if (command == "ALERT") {
    markerServo.write(130);
    analogWrite(ledPin, 255);
    tone(buzzerPin, 1000, 80);
  } else if (command == "IDLE") {
    markerServo.write(30);
    analogWrite(ledPin, 25);
  }
}`
  }
];

const actuatorNotes = [
  {
    name: "Servo",
    pins: "Signal pin plus 5V and GND",
    use: "Best for custom hinges, grippers, shutters, pointers, apertures, and small kinetic facade modules.",
    caution: "Use external 5V power for multiple servos; share GND with the controller."
  },
  {
    name: "DC Motor / Fan",
    pins: "Needs a motor driver, transistor, or MOSFET module",
    use: "Best for ventilation, rotating samples, pumps, moving belts, and continuous material experiments.",
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
