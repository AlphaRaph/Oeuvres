from flask import Flask, request, render_template, redirect, url_for
import os, json

from ItemManager import *
from UploadManager import *


# ======== Chargement de la base de données JSON des oeuvres =================
ITEM_FOLDER_PATH = "data"
ITEM_FILE_PATH = "data/oeuvres-2.json"
UPLOAD_FOLDER = "/static/OEUVRES/uploads"

itemManager = ItemManager(ITEM_FILE_PATH, ITEM_FOLDER_PATH)
uploadManager = UploadManager(UPLOAD_FOLDER)


# ================ Mise en place de l'API / du serveur ======================
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/catalogue")
def catalogue():
    return render_template("catalogue.html")


@app.route("/oeuvres")
def get_oeuvres():
    return itemManager.read_json()


@app.route("/propos")
def propos():
    return render_template("propos.html")


@app.route("/add", methods=['GET', 'POST'])
def add():
    if request.method == 'GET':
        return render_template("add.html")
    else:
        # check if the post request has the file part
        if 'file' not in request.files:
            print("No file part")
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            print("No selected file")
            return redirect(request.url)
        if file:
            itemManager.save_item(request.form["name"], request.form["author"], request.form, file, uploadManager)
            print("L'oeuvre a été ajouté avec succés !")
            return redirect(url_for('add', result="success"))

        return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form method=post enctype=multipart/form-data>
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''


@app.route("/oeuvres/<urlname>")
def oeuvre(urlname):
    return render_template("oeuvre.html")


@app.route("/oeuvres/<urlname>/json")
def get_oeuvre(urlname):
    return itemManager.item_to_json(itemManager.get_item(urlname))


if __name__ == "__main__":
    app.run(debug=True)
