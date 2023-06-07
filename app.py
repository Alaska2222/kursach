from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from routs import student, teacher

app = Flask(__name__)
ma = Marshmallow(app)
CORS(app)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGER_BLUEPRINT = get_swaggerui_blueprint(SWAGGER_URL, API_URL,
                                            config={'app_name': 'LPNU students'})
app.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)

app.register_blueprint(student)
app.register_blueprint(teacher)

if __name__ == "__main__":
    app.run(debug=True)
