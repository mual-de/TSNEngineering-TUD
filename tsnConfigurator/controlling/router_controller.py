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

bp = Blueprint('controlling/router', __name__, url_prefix='/controlling/router')

@bp.route("/")
def routerOverview():
    db = get_db()
    switches = db.execute('SELECT * FROM switches').fetchall()
    return render_template("controller/switch/switches.html",switches = switches)

@bp.route("/addNew")
def addNewRouter():
    return render_template("controller/switch/addNewSwitch.html", data = None)

@bp.route("/insertNew", methods=["POST"])
def insertNewSwitch():
    name = request.form['name']
    ip = request.form['ip']
    uuid = request.form['uuid']
    username = request.form['username']
    password = request.form['password']
    port = request.form['port']
    devicetype = request.form['devicetype']
    dpid = request.form["dpid"]
    db = get_db()
    if request.args.get("id") == "":
        cmd = "INSERT INTO switches (name, uuid, ip, port, username, password, dpid, devicetype) VALUES (?,?,?,?,?,?,?, ?);"
        print(cmd)
        db.execute(cmd,(name,uuid, ip, port, username, password,dpid, devicetype))
        db.commit()
    else:
        cmd = "UPDATE switches SET name=?,  uuid=?, ip=?, port=?, username=?, password=?, devicetype=?, dpid=? WHERE id=?;"
        db.execute(cmd,(name,uuid, ip, port, username, password, devicetype,dpid,request.args.get("id")))
        db.commit()
    return redirect("/controlling/router")

@bp.route("/edit", methods=["GET"])
def editSwitch():
    id = request.args.get("id")
    db = get_db()
    data = db.execute('SELECT * FROM switches WHERE id=%s'%id).fetchone()
    print(data)
    return render_template("controller/switch/addNewSwitch.html", data = data)


@bp.route("/delete", methods=['GET'])
def deleteRouter():
    return render_template("controller/rouswitchter/deleteRouter.html")

