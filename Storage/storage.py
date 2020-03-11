from flask import Flask
from flask_mqtt import Mqtt

import json

import mysql.connector as mariadb
from datetime import datetime

app = Flask(__name__)


app.config['MQTT_BROKER_URL'] = '127.0.0.1'  # use the free broker from HIVEMQ
app.config['MQTT_BROKER_PORT'] = 1883  # default port for non-tls connection
# app.config['MQTT_USERNAME'] = ''  # set the username here if you need authentication for the broker
# app.config['MQTT_PASSWORD'] = ''  # set the password here if the broker demands authentication
# app.config['MQTT_KEEPALIVE'] = 5  # set the time interval for sending a ping to the broker to 5 seconds
# app.config['MQTT_TLS_ENABLED'] = False  # set TLS to disabled for testing purposes
mqtt = Mqtt(app)

mariadb_connection = mariadb.connect(user="root", password="admin", database="ground_station")
cursor = mariadb_connection.cursor()
# cursor.execute("CREATE TABLE sensor_readings(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, sensor_name VARCHAR(64) NOT NULL, sensor_value VARCHAR(64) NOT NULL, datetime DATETIME);")
# cursor.execute("INSERT INTO sensor_readings(sensor_name, sensor_value, datetime) VALUES (%s,%s,%s)", ("temperature","32",datetime.now()))
# mariadb_connection.commit()
# cursor.execute("SELECT * FROM sensor_readings")
    
@app.route("/")
def getAllSensorReadings():
    cursor.execute("SELECT * FROM sensor_readings")
    result = cursor.fetchall()
    response = "RESULT: "
    for x in result:
        response = response + "," + str(x)
        print(str(x))
    return response  


@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print("mqtt on_connect : connecting to topics")
    mqtt.subscribe('home/mytopic')
    mqtt.subscribe('rover_commands')
    mqtt.subscribe('isru_commands')
    mqtt.subscribe('rover_sensors')
    mqtt.subscribe('isru_sensors')
    mqtt.subscribe('rover_emergency_stop')
    mqtt.subscribe('isru_emergency_stop')
    

@mqtt.on_message()  
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    print("Got data:  " + str(data))
    obj = json.loads(message.payload.decode())
    print("Decoded: " + str(obj))
    for key,value in obj.items():
        cursor.execute("INSERT INTO sensor_readings(sensor_name, sensor_value, datetime) VALUES (%s,%s,%s)", (key,value,datetime.now()))
        print("adding " + key + ":" + value)   
    mariadb_connection.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5002,debug=True)



# venv\Scripts\activate
# $ set FLASK_APP=storage.py
# $ flask run --port 5002