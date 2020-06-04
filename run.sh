#!/bin/bash
python ./transformers/examples/run_generation_fabula.py --model_type gpt2 --model_name_or_path gpt2 --length 200 & node ./server.js
