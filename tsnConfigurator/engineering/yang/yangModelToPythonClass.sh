#!/bin/bash
# This script has two parameters
# $1 - Path to yang file
# $2 - Path where generated python files should be stored
# $3 - Working path
# yang file name must be equivalent to yang module name in yang file!
PYBINDPLUGIN=`/usr/bin/env python3 -c 'import pyangbind; import os; print("%s/plugin" % os.path.dirname(pyangbind.__file__))'`
pyang --plugindir $PYBINDPLUGIN -f pybind -o $1 $2
