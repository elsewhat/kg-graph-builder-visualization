# Knowledge Graph Builder Visualization

A Flask-based web application that visualizes the step-by-step construction of a knowledge graph from unstructured data using Cytoscape.js.

## Features

- **Real-time Visualization**: Watch as ontology concepts, nodes, and edges are added step by step
- **Interactive Controls**: Start, pause, reset, and adjust the speed of construction
- **Animated Graph**: Smooth animations when new elements are added
- **Ontology Tracking**: See the ontology being developed alongside the graph
- **Responsive Layout**: Uses Cytoscape fcose layout for optimal node positioning
- **Modern UI**: Clean, modern interface with statistics and controls

## Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application**:
   ```bash
   python app.py
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. Click **"Start Building"** to begin the knowledge graph construction simulation
2. Use **"Pause"** to pause the construction at any time
3. Use **"Reset"** to clear the graph and start over
4. Adjust the **Speed slider** to control how fast elements are added
5. Watch the **Statistics panel** to see real-time counts
6. Observe the **Ontology panel** to see concepts being defined

## Project Structure

```
kg-graph-builder-visualization/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Application styles
    └── js/
        ├── app.js        # Main application logic
        ├── cytoscape.min.js      # Cytoscape.js library
        └── cytoscape-fcose.js    # fcose layout extension
```

## Graph Data

The application simulates building a knowledge graph with:

- **Ontology Concepts**: Person, Organization, Location, Event, and relationships
- **Entities**: John Smith, Mary Johnson, ACME Corp, Google Inc, New York, San Francisco, Tech Conference 2025
- **Relationships**: works_at, located_in, attended

## Customization

You can modify the graph data in `app.py` by editing the `GRAPH_DATA` dictionary to include your own:

- Ontology concepts and descriptions
- Nodes with different types and labels  
- Edges representing relationships

The visualization automatically assigns colors and shapes based on node types:
- **Person**: Blue circles
- **Organization**: Green rectangles  
- **Location**: Orange diamonds
- **Event**: Red octagons

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: Cytoscape.js with fcose layout
- **UI**: Modern CSS with animations and responsive design
