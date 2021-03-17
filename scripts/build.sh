#!/bin/bash

yarn run codegen
yarn run build
rm -rf .data
