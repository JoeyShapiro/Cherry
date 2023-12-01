from flask import Flask, render_template

with open('index.html') as f:
    page_index = f.read()

app = Flask(__name__)

@app.route('/test')
def hello_world():
    return render_template('index.html')

@app.route('/')
def index():
    return page_index

if __name__ == '__main__':
    app.run(host="0.0.0.0" , port=8000)
