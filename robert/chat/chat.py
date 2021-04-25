from flask_socketio import Namespace, send, emit, join_room, leave_room
from flask import request, session

""" 
We can use session to store things during the socket connection but we will not be able 
to alter it. SocketIO forks the session and destroys it once it's over.
What this means is that we might need to have a different storage system
To preserve a user's data if they disconnect from the socket
We can at least make sure that a user is not trying to pass as another since the session
is signed crypthographically and we can assign a UID when the user first initialize a request
to the server. This UID will be stored in a cookie, preserving some infos if he refreshed the page
"""
class ChatNamespace(Namespace):
    def on_connect(self):
        send('Welcome to the chat app, please start by joining a room');
        print('A user connected to the server, heres their session : ', session)

    def on_disconnect(self):
        pass

    def on_join(self, data):
        room = data['room']
        session['room'] = room
        join_room(room)
        send('You\'re joining room %s' % room)
        send('A new user has entered the room', to=room)
        print('They\'re trying to join a room', session)

    def on_leave(self, data):
        print('They\re trying to leave the room', data)

    def on_message(self, data):
        print('Received message', data)
        send(data, to=session['room'])