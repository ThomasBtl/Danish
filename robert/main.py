from flask import Flask, render_template, request
from flask_socketio import SocketIO
from chat import chat

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
socketio.on_namespace(chat.ChatNamespace('/chat'))

@app.route('/')
def index():
    return render_template('hello.html')

@app.route('/chat')
def hello():
	return render_template('chat.html')

if __name__ == '__main__':
	socketio.run(app)
