"""
.. module:: controller
    :platform: Linux
    :synopsis: start point for controller part of web app
 
.. moduleauthor:: mual-de 
"""
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from tsnConfigurator.db import get_db
import requests
import json


bp = Blueprint('controlling', __name__, url_prefix='/controlling')



@bp.route("/")
def config_start_page():
    """Show index of controller subsystem.
    :return: rendered html page
    """
    return render_template("controller/index.html")


@bp.route("/deployment")
def deployment_start_page():
    """Show overview of deployable configurations.
    :return: rendered html page
    """
    db = get_db()
    data = db.execute("SELECT id, name, description FROM configurations").fetchall()
    return render_template("controller/deployment/configurationsToDeploy.html", data = data)

@bp.route("/deployment/loadConfig", methods=["GET"])
def deployConfig():#
    """Deploy a given configuration (using db id) to a tsn controller running on same system.
    :return: redirect to deployment overview
    """
    id = request.args.get("id")
    db = get_db()
    data = db.execute("SELECT configuration FROM configurations WHERE id=%s"%(id)).fetchone()
    jsonData = json.loads(data["configuration"])
    for entry in jsonData:
        uuid = entry["uuid"]
        print(uuid)
        switchData = db.execute("SELECT * FROM switches WHERE uuid='%s'"%(uuid)).fetchone()
        ovsData = dict()
        ovsData["dpid"] = switchData["dpid"]
        fpgaData = dict()
        fpgaData["host"] = switchData["ip"]
        fpgaData["port"] = int(switchData["port"])
        fpgaData["username"] = switchData["username"]
        fpgaData["password"] = switchData["password"]
        fpgaData["sw_type"] = "trustnodev1"
        entry["fpga_sw_data"] = fpgaData
        entry["ovs_sw_data"] = ovsData
    print(jsonData)
    requests.post("http://localhost:9090/setConfiguration", json=jsonData)
    return redirect("/controlling/deployment")


@bp.route("/states")
def actualState():
    """Get a actual state from an associated tsnController instance
    :return: rendered html page
    """
    actualConfig = requests.get("http://localhost:9090/actualStatus").json()
    switches = requests.get("http://localhost:9090/getSwitches/ovs").json()
    print(switches)
    return render_template("controller/actualState.html", switches = switches, actualConfig=actualConfig)

