from flask import Flask
from flask_mqtt import Mqtt

import json

app = Flask(__name__)


app.config['MQTT_BROKER_URL'] = '127.0.0.1'  # use the free broker from HIVEMQ
app.config['MQTT_BROKER_PORT'] = 1883  # default port for non-tls connection
# app.config['MQTT_USERNAME'] = ''  # set the username here if you need authentication for the broker
# app.config['MQTT_PASSWORD'] = ''  # set the password here if the broker demands authentication
# app.config['MQTT_KEEPALIVE'] = 5  # set the time interval for sending a ping to the broker to 5 seconds
# app.config['MQTT_TLS_ENABLED'] = False  # set TLS to disabled for testing purposes
mqtt = Mqtt(app)

# add test data
state = {"temp":"33","speed":"3mph"}

@app.route('/send')
def hello_world():
    print("Sending message called")
    mqtt.publish('home/mytopic', json.dumps(state))
    return "Message sent"

    
@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.subscribe('home/mytopic')

@mqtt.on_message()  
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    print("Recieved: " + str(data))

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5001,debug=True)



# venv\Scripts\activate
# $ set FLASK_APP=debugServer.py
# $ flask run