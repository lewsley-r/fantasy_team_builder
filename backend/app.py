from flask import Flask, jsonify, request, make_response
from flask.scaffold import F
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import jwt
import datetime
import bcrypt

from functools import wraps

#Route Wrappers
def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify( 
            {'message' : 'Token is missing'}), 401
        try:
            data = jwt.decode(token, 
            app.config['SECRET_KEY'])
        except:
            return jsonify( 
            {'message' : 'Token is invalid'}), 401
        bl_token = blacklist.find_one({"token":token})
        if bl_token is not None:
            return make_response(jsonify( 
            {'message' : 
            'Token has been cancelled'}), 401)
        return func(*args, **kwargs)        
    return jwt_required_wrapper

def admin_required(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])
        if data["admin"]:
            return func(*args, **kwargs)
        else:
            return make_response(jsonify( {'message' : 'Admin access required'}), 401)
    return admin_required_wrapper


# mongodb config
DB_HOST_MONGO = 'mongodb://127.0.0.1:27017/'
DB_NAME_MONGO = "premierLeague"


# mongodb connection
mongo_client = MongoClient(DB_HOST_MONGO)
db = mongo_client[DB_NAME_MONGO]
player_collection = db.players
team_collection = db.teams
user_collection = db.users
blacklist = db.blacklist

# start flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'uujFullStack'
CORS(app)


#Player Routes
# @app.route('/api/v1.0/players/<player_id>', methods=['GET'])
# @jwt_required
# def get_single_player(player_id):
#     player = player_collection.find_one({"_id": ObjectId(player_id)})
#     player['_id'] = str(player['_id'])

#     return make_response( jsonify(player), 200 ) 



@app.route('/api/v1.0/players', methods=['GET'])
@jwt_required
def get_all_players():
    data_to_return = []
    for player in player_collection.find():
        player['_id'] = str(player['_id'])
        data_to_return.append(player)
    return make_response( jsonify(data_to_return), 200 ) 


#Team Routes
@app.route('/api/v1.0/create/team', methods=['POST'])
@jwt_required
def create_team():
    team = request.get_json()
    team_collection.insert_one(team).inserted_id
    return make_response( jsonify ({'message': 'Team Added Successfully'}), 201 )


@app.route('/api/v1.0/delete/team', methods=['POST'])
@jwt_required
def delete_team():
    id = request.get_json()
    id = id['id']
    team = team_collection.find_one({"_id": ObjectId(id)})
    if team is not None:
        team_collection.delete_one({"_id": ObjectId(id)})
        return make_response( jsonify( 
            {'message': 'Deleted Successfully'}), 200)
    else:
        return make_response( jsonify( 
            {'message': 'Team not found. Please delete via on screen functionality, to avoid invalid requests'}), 401)


@app.route('/api/v1.0/teams', methods=['GET'])
@jwt_required
def get_teams():
    token = request.headers['x-access-token']
    token_user = jwt.decode(token, 
            app.config['SECRET_KEY'])
    user_data = user_collection.find_one({"email": token_user['user']})
    data_to_return = []
    teams = team_collection.find({"Owner_id": str(user_data['_id'])})
    for team in teams:
        team['_id'] = str(team['_id'])
        data_to_return.append(team)
    if data_to_return:
        return make_response( jsonify(data_to_return), 200 )
    else:
        return make_response({'message': 'No Teams Found'}, 401)





#Auth Routes
@app.route('/api/v1.0/login', methods=['POST'])
def login():
    auth = request.get_json()
    if auth:
        user = user_collection.find_one( {"email" : auth['username']})
        if user is not None:
            if bcrypt.checkpw( bytes( auth['password'], 'UTF-8' ), user["password"] ):
                token = jwt.encode( 
                    {'user' : auth['username'], 
                    'exp' : datetime.datetime.utcnow() + 
                    datetime.timedelta(minutes=30)}, 
                    app.config['SECRET_KEY'])
                return make_response( jsonify(token.decode('UTF-8')), 200 )
            else:
                return make_response( jsonify( {'message': 'Incorrect Password attempt'}), 401)
        else:
                return make_response( jsonify( {'message': 'User Not Found'}), 401)
  
    return make_response( jsonify( {'message': 'Username and Password Required'}), 401)


        

@app.route('/api/v1.0/logout', methods=["POST"])
@jwt_required
def logout():
    token = request.headers['x-access-token']
    if token is not None:
        blacklist.insert_one({"token":token})
        return make_response(jsonify( 
        {'message' : 'Logout successful'}), 200)
    else:
        return make_response(jsonify( 
        {'message' : 'We were not able to log you, as your request did not contain a valid JWT Token'}), 401)



#User Routes
@app.route('/api/v1.0/create/user', methods=["POST"])
def create_user():
    if request.method == "POST":
        user = request.form.get("fullname")
        email = request.form.get("email")
        
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        
        user_found = user_collection.find_one({"name": user})
        email_found = user_collection.find_one({"email": email})
        if user_found:
            return make_response( jsonify( {'message': 'There already is a user by that name'}), 409) #409 as request causes a conflict
        if email_found:
            return make_response( jsonify( {'message': 'This email already exists in database'}), 409)
        if password1 != password2:
            return make_response( jsonify( {'message': 'Passwords should match!'}), 409)
        else:
            hashed = bcrypt.hashpw(password2.encode('utf-8'), bcrypt.gensalt())
            if user and email and hashed:
                user_input = {'name': user, 'email': email, 'password': hashed}
                user_collection.insert_one(user_input)
            else:
                return make_response( jsonify( {'message': 'All Fields are Required to create a user!'}), 401)
        
            user_data = user_collection.find_one({"email": email})
            new_users_name = user_data["name"]
   
            return make_response( jsonify( {'message': 'User: ' + new_users_name + ', Created Successfully'}), 201)
    return make_response( jsonify( {'message': 'Invalid Request Type for this Endpoint'}), 401)


@app.route('/api/v1.0/get/user', methods=["GET"])
@jwt_required
def get_user():
    token = request.headers['x-access-token']
    token_user = jwt.decode(token, 
            app.config['SECRET_KEY'])
    user_data = user_collection.find_one({"email": token_user['user']})
    if (user_data is not None):
        user_data['_id'] = str(user_data['_id'])
        user_data.pop('password', None)
        return make_response(jsonify(user_data), 200)
    else:
        return make_response( jsonify( {'message': 'Could not find user by that email'}), 401)


@app.route('/api/v1.0/edit/username', methods=['POST'])
@jwt_required
def edit_username():
    new_name = request.get_json('')
    token = request.headers['x-access-token']
    token_user = jwt.decode(token, 
            app.config['SECRET_KEY'])
    user = user_collection.find_one({"email": token_user['user']})
    if user:
        user_collection.update_one(user_collection.find_one({"email": token_user['user']}) , {'$set' :{'name' : new_name['name']}})
        return make_response(jsonify( {'message': 'Successfully edited'} ), 200)
    else:
        return make_response( jsonify( {'message': 'Could not find logged in user'}), 401)





    
    
    
   


    
    



if __name__ == "__main__":
    app.run(debug=True)
