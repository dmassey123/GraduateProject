
from flask import Flask
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
from flask_cors import CORS

import json

app = Flask(__name__)


app.config['MQTT_BROKER_URL'] = '127.0.0.1'  # use the free broker from HIVEMQ
app.config['MQTT_BROKER_PORT'] = 1883  # default port for non-tls connection
# app.config['MQTT_USERNAME'] = ''  # set the username here if you need authentication for the broker
# app.config['MQTT_PASSWORD'] = ''  # set the password here if the broker demands authentication
# app.config['MQTT_KEEPALIVE'] = 5  # set the time interval for sending a ping to the broker to 5 seconds
# app.config['MQTT_TLS_ENABLED'] = False  # set TLS to disabled for testing purposes
mqtt = Mqtt(app)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_HEADERS'] = 'Content-Type'
# add test data
state = {"temp":"32","connection":"strong"}

@app.route('/')
def getState():
    print("getState() called")
    return "State : " + str(state)
    
@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print("mqtt on_connect : connecting to home/mytopic")
    mqtt.subscribe('home/mytopic')
    mqtt.subscribe('rover_commands')
    mqtt.subscribe('isru_commands')
    mqtt.subscribe('rover_sensors')
    mqtt.subscribe('isru_sensors')
    mqtt.subscribe('rover_emergency_stop')
    mqtt.subscribe('isru_emergency_stop')
    

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    print("mqtt message recieved, updating state and emiting state on socketio")
    global state
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )   
    obj = json.loads(message.payload.decode())
    print("Recieved: " + str(obj))
    state.update(obj)
    print("State updated:" + str(state))
    socketio.emit("new-message", str(state)) 

@socketio.on('publish')
def handle_publish(json_str):
    print("socketio on publish. mqtt publishing topic and message")
    data = json.loads(json_str)
    print("topic " + data['topic'] + ", message " + data['message'])
    mqtt.publish(data['topic'], data['message'])

@socketio.on('subscribe')
def handle_subscribe(json_str):
    data = json.loads(json_str)
    print("socketio on subscribe, mqtt subscribing to " + data['topic'])
    mqtt.subscribe(data['topic'])

@socketio.on('unsubscribe_all')
def handle_unsubscribe_all():
    print("Unsubscribing from all")
    mqtt.unsubscribe_all()

@mqtt.on_log()
def handle_logging(client, userdata, level, buf):
    print(level, buf)


@socketio.on('connection')
def handle_connection(methods=['GET', 'POST']):
    print("socketio on connection, user connected")

@socketio.on('new-message')
def handle_new_message(message, methods=['GET', 'POST']):
    print('received message: ' + message)
    socketio.emit('my response', "recieved")
    obj = json.loads(message)
    print("Decoded: " + str(obj))
    for key,value in obj.items():
        mqtt.publish(key, value)
        print("publishing " + value + " on " + key)  
    

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000, use_reloader=False, debug=True, logger=True, engineio_logger=True)



# venv\Scripts\activate
# $ set FLASK_APP=server.py
# $ flask run