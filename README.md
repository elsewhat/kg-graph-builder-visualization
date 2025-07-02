# Knowledge Graph Builder Visualization

**A proof of concept** Flask-based web application that demonstrates the step-by-step construction of a knowledge graph from predefined data using Cytoscape.js.

> **Note**: This is a demonstration prototype designed to showcase knowledge graph visualization concepts. It's been vibe code in a few hours. It uses simulated data and simplified graph construction for educational purposes.

## Features

This proof of concept includes:

- **Basic Visualization**: Simple demonstration of adding ontology concepts, nodes and edges sequentially
- **Simple Controls**: Basic start, pause, and reset functionality
- **Step Animation**: Animated progression through predefined graph construction steps
- **Ontology Display**: Shows sample ontology concepts as they are introduced
- **Layout**: Uses Cytoscape with various layout algorithms for node positioning
- **Statistics Tracking**: Real-time display of construction progress (steps, nodes, edges, concepts)

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
4. Watch the **Statistics panel** to see real-time counts of steps, nodes, edges, and concepts
5. Observe the **Ontology panel** to see concepts being defined during construction

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

This proof of concept demonstrates building a knowledge graph with sample data including:

- **Sample Ontology Concepts**: Person, Organization, Location, Event, and basic relationships
- **Example Entities**: John Smith, Mary Johnson, ACME Corp, Google Inc, New York, San Francisco, Tech Conference 2025
- **Simple Relationships**: works_at, located_in, attended

> **Note**: The data is hardcoded for demonstration purposes and does not represent real knowledge extraction from unstructured sources.

## Customization

You can experiment with different graph data by modifying the `GRAPH_DATA` dictionary in `app.py`. This allows you to:

- Add different ontology concepts and descriptions
- Include nodes with various types and labels  
- Define edges representing different relationships

The visualization assigns basic colors and shapes based on node types:
- **Person**: Blue circles
- **Organization**: Green rectangles  
- **Location**: Orange diamonds
- **Event**: Red octagons

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: Cytoscape.js with fcose layout
- **UI**: Modern CSS with animations and responsive design
