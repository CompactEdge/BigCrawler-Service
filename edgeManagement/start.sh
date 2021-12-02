#!/usr/bin/env bash

RELATIVE_DIR=`dirname "$0"`
cd $RELATIVE_DIR

cd frontend
npm install & npm run build

cd ..

cd backend
python3 run.py