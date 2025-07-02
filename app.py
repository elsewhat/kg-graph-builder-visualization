from flask import Flask, render_template, jsonify
import json
import time

app = Flask(__name__)

# Simulated knowledge graph data that will be built step by step
GRAPH_DATA = {
    "ontology": [
        {"step": 1, "concept": "Person", "description": "Individual human entity"},
        {"step": 2, "concept": "Organization", "description": "Company or institution"},
        {"step": 3, "concept": "Location", "description": "Geographic place"},
        {"step": 4, "concept": "Event", "description": "Temporal occurrence"},
        {"step": 5, "concept": "works_at", "description": "Employment relationship"},
        {"step": 6, "concept": "located_in", "description": "Spatial relationship"},
        {"step": 7, "concept": "attended", "description": "Participation relationship"}
    ],
    "nodes": [
        {"step": 1, "data": {"id": "john", "label": "John Smith", "type": "Person"}},
        {"step": 2, "data": {"id": "acme", "label": "ACME Corp", "type": "Organization"}},
        {"step": 3, "data": {"id": "nyc", "label": "New York", "type": "Location"}},
        {"step": 4, "data": {"id": "mary", "label": "Mary Johnson", "type": "Person"}},
        {"step": 5, "data": {"id": "conference", "label": "Tech Conference 2025", "type": "Event"}},
        {"step": 6, "data": {"id": "sf", "label": "San Francisco", "type": "Location"}},
        {"step": 7, "data": {"id": "google", "label": "Google Inc", "type": "Organization"}}
    ],
    "edges": [
        {"step": 5, "data": {"id": "e1", "source": "john", "target": "acme", "label": "works_at"}},
        {"step": 6, "data": {"id": "e2", "source": "acme", "target": "nyc", "label": "located_in"}},
        {"step": 7, "data": {"id": "e3", "source": "mary", "target": "google", "label": "works_at"}},
        {"step": 8, "data": {"id": "e4", "source": "john", "target": "conference", "label": "attended"}},
        {"step": 9, "data": {"id": "e5", "source": "mary", "target": "conference", "label": "attended"}},
        {"step": 10, "data": {"id": "e6", "source": "conference", "target": "sf", "label": "located_in"}}
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/graph-data')
def get_graph_data():
    """Return all graph data for client-side simulation"""
    return jsonify(GRAPH_DATA)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
