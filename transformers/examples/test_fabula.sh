#!/bin/bash
curl -H "Content-type: application/json" -X POST http://127.0.0.1:5000/generate -d '{"start_text":"The hero rode in on a "}'

