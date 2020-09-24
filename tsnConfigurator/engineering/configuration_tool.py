"""
.. module:: configurator_tool
    :platform: Linux
    :synopsis: start point for engineering part of web app
 
.. moduleauthor:: mual-de 
"""
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from tsnConfigurator.db import get_db


bp = Blueprint('engineering', __name__, url_prefix='/engineering')



@bp.route("/")
def config_start_page():
    db = get_db()
    data = db.execute("SELECT id, name, description FROM configurations").fetchall()
    print(data)
    return render_template("engineering/index.html", data = data)

@bp.route("/createNewConfig")
def addNewConfiguration():
    db = get_db()
    fpgaTemplates = db.execute("SELECT * FROM fpga_templates").fetchall()
    return render_template("engineering/config/createNewConfig.html", fpgaTemplates = fpgaTemplates)


@bp.route("/storeConfig", methods=["POST"])
def storeConfig():
    name = request.form["config-name"]
    configuration = request.form["dataset"]
    description = request.form["config-desc"]
    db = get_db()
    cmd = "INSERT INTO configurations (name, description, configuration) VALUES (?,?,?);"
    print(cmd)
    db.execute(cmd,(name,description,configuration))
    db.commit()
    return "200 - OK!"

@bp.route("/updateConfig", methods=["POST"])
def updateConfig():
    name = request.form["config-name"]
    configuration = request.form["dataset"]
    description = request.form["config-desc"]
    id = request.form["config-id"]
    db = get_db()
    cmd = "UPDATE configurations SET name=?, description=?, configuration=? WHERE id=?;"
    print(cmd)
    db.execute(cmd,(name,description,configuration, id))
    db.commit()
    return "200 - OK!"


@bp.route("/editConfig")
def getConfiguration():
    id = request.args.get("id")
    db = get_db()
    data = db.execute("SELECT id, name, description, configuration FROM configurations WHERE id="+str(id)).fetchone()
    print(data["name"])
    return render_template("/engineering/config/editConfig.html", data=data)

@bp.route("/filterRecipe")
def getFilterRecipe():
    db = get_db()

    return render_template("/engineering/config/filtering.html")

@bp.route("/createNewRecipe")
def createFilterRecipe():
    return render_template("/engineering/config/createRecipeFilter.html")

@bp.route("/storeFPGAFlowControlRule", methods=["POST"])
def storeFPGAFlowControlRule():
    name = request.form["template-name"]
    configuration = request.form["dataset"]
    db = get_db()
    cmd = "INSERT INTO fpga_templates (name, template) VALUES (?,?);"
    db.execute(cmd,(name,configuration))
    db.commit()
    return "200 - OK!"

@bp.route("/configJSONEditor")
def jsonEditor():
    return render_template("/engineering/config/rawJSONEditor.html")