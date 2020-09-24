"""
.. module:: yang-editor
    :platform: Linux
    :synopsis: All requests belonging to YANG Models are handled here.
 
.. moduleauthor:: mual-de 
"""

import functools
import os
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)


bp = Blueprint('yang', __name__, url_prefix='/engineering/yang')

@bp.route("/")
def overview():
    return render_template("engineering/yang_models.html")
