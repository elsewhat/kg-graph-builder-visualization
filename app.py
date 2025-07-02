from flask import Flask, render_template, jsonify
import json
import time
import random

app = Flask(__name__)

def generate_norway_dataset():
    """Generate a large dataset based on Norway and related Wikidata entities"""
    
    # Extended ontology concepts
    ontology = [
        {"step": 1, "concept": "Country", "description": "Sovereign nation state"},
        {"step": 2, "concept": "City", "description": "Urban settlement"},
        {"step": 3, "concept": "Municipality", "description": "Administrative division"},
        {"step": 4, "concept": "County", "description": "Regional administrative unit"},
        {"step": 5, "concept": "Person", "description": "Individual human entity"},
        {"step": 6, "concept": "Politician", "description": "Person involved in politics"},
        {"step": 7, "concept": "Artist", "description": "Creative professional"},
        {"step": 8, "concept": "Scientist", "description": "Research professional"},
        {"step": 9, "concept": "Athlete", "description": "Sports professional"},
        {"step": 10, "concept": "Organization", "description": "Institutional entity"},
        {"step": 11, "concept": "Company", "description": "Business organization"},
        {"step": 12, "concept": "University", "description": "Higher education institution"},
        {"step": 13, "concept": "Museum", "description": "Cultural institution"},
        {"step": 14, "concept": "Event", "description": "Notable occurrence"},
        {"step": 15, "concept": "Festival", "description": "Cultural celebration"},
        {"step": 16, "concept": "Treaty", "description": "International agreement"},
        {"step": 17, "concept": "Mountain", "description": "Elevated landform"},
        {"step": 18, "concept": "Lake", "description": "Body of water"},
        {"step": 19, "concept": "River", "description": "Flowing watercourse"},
        {"step": 20, "concept": "Island", "description": "Land surrounded by water"},
        {"step": 21, "concept": "capital_of", "description": "Administrative center relationship"},
        {"step": 22, "concept": "located_in", "description": "Spatial containment"},
        {"step": 23, "concept": "born_in", "description": "Birth location"},
        {"step": 24, "concept": "works_at", "description": "Employment relationship"},
        {"step": 25, "concept": "member_of", "description": "Organizational membership"},
        {"step": 26, "concept": "part_of", "description": "Component relationship"},
        {"step": 27, "concept": "borders", "description": "Geographic adjacency"},
        {"step": 28, "concept": "flows_through", "description": "River course relationship"},
        {"step": 29, "concept": "founded", "description": "Establishment relationship"},
        {"step": 30, "concept": "studied_at", "description": "Educational relationship"}
    ]
    
    # Base nodes - Norway and major divisions
    nodes = [
        {"step": 31, "data": {"id": "norway", "label": "Norway", "type": "Country"}},
        {"step": 32, "data": {"id": "oslo", "label": "Oslo", "type": "City"}},
        {"step": 33, "data": {"id": "bergen", "label": "Bergen", "type": "City"}},
        {"step": 34, "data": {"id": "trondheim", "label": "Trondheim", "type": "City"}},
        {"step": 35, "data": {"id": "stavanger", "label": "Stavanger", "type": "City"}},
        {"step": 36, "data": {"id": "kristiansand", "label": "Kristiansand", "type": "City"}},
        {"step": 37, "data": {"id": "tromso", "label": "Tromsø", "type": "City"}},
        {"step": 38, "data": {"id": "drammen", "label": "Drammen", "type": "City"}},
    ]
    
    # Norwegian counties
    counties = [
        "Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland",
        "Troms og Finnmark", "Trøndelag", "Vestfold og Telemark", "Vestland", "Viken"
    ]
    
    step_counter = 39
    
    # Add counties
    for county in counties:
        nodes.append({
            "step": step_counter,
            "data": {"id": county.lower().replace(" ", "_").replace("ø", "o").replace("å", "a"), 
                    "label": county, "type": "County"}
        })
        step_counter += 1
    
    # Norwegian municipalities (selection of major ones)
    municipalities = [
        "Bærum", "Asker", "Lillestrøm", "Fredrikstad", "Sandnes", "Tromsø", "Sarpsborg",
        "Skien", "Kristiansand", "Fredrikstad", "Tønsberg", "Moss", "Sandefjord", "Arendal",
        "Bodø", "Molde", "Haugesund", "Ålesund", "Larvik", "Halden", "Kongsberg", "Gjøvik",
        "Hamar", "Elverum", "Lillehammer", "Brumunddal", "Steinkjer", "Levanger", "Verdal",
        "Namsos", "Mo i Rana", "Narvik", "Harstad", "Alta", "Hammerfest", "Kirkenes",
        "Vadsø", "Honningsvåg", "Lakselv", "Kautokeino", "Karasjok", "Sortland", "Svolvær",
        "Leknes", "Stokmarknes", "Andenes", "Finnsnes", "Lenvik", "Målselv", "Bardufoss"
    ]
    
    # Add municipalities
    for municipality in municipalities:
        nodes.append({
            "step": step_counter,
            "data": {"id": municipality.lower().replace(" ", "_").replace("ø", "o").replace("å", "a"), 
                    "label": municipality, "type": "Municipality"}
        })
        step_counter += 1
    
    # Notable Norwegian people
    notable_people = [
        {"name": "Harald V", "type": "Politician", "desc": "King of Norway"},
        {"name": "Erna Solberg", "type": "Politician", "desc": "Former Prime Minister"},
        {"name": "Jonas Gahr Støre", "type": "Politician", "desc": "Prime Minister"},
        {"name": "Edvard Munch", "type": "Artist", "desc": "Painter"},
        {"name": "Henrik Ibsen", "type": "Artist", "desc": "Playwright"},
        {"name": "Edvard Grieg", "type": "Artist", "desc": "Composer"},
        {"name": "Knut Hamsun", "type": "Artist", "desc": "Nobel Prize Winner"},
        {"name": "Sigrid Undset", "type": "Artist", "desc": "Nobel Prize Winner"},
        {"name": "Roald Amundsen", "type": "Scientist", "desc": "Polar Explorer"},
        {"name": "Fridtjof Nansen", "type": "Scientist", "desc": "Explorer & Diplomat"},
        {"name": "Niels Henrik Abel", "type": "Scientist", "desc": "Mathematician"},
        {"name": "Ole Einar Bjørndalen", "type": "Athlete", "desc": "Biathlete"},
        {"name": "Marit Bjørgen", "type": "Athlete", "desc": "Cross-country skier"},
        {"name": "Magnus Carlsen", "type": "Athlete", "desc": "Chess Grandmaster"},
        {"name": "Erling Haaland", "type": "Athlete", "desc": "Football player"},
        {"name": "Martin Ødegaard", "type": "Athlete", "desc": "Football player"},
        {"name": "Therese Johaug", "type": "Athlete", "desc": "Cross-country skier"},
        {"name": "Johannes Høsflot Klæbo", "type": "Athlete", "desc": "Cross-country skier"},
        {"name": "Karsten Warholm", "type": "Athlete", "desc": "Track and field"},
        {"name": "Aksel Lund Svindal", "type": "Athlete", "desc": "Alpine skier"}
    ]
    
    # Add notable people
    for person in notable_people:
        nodes.append({
            "step": step_counter,
            "data": {"id": person["name"].lower().replace(" ", "_").replace("ø", "o").replace("å", "a"), 
                    "label": person["name"], "type": person["type"]}
        })
        step_counter += 1
    
    # Norwegian organizations and companies
    organizations = [
        {"name": "Equinor", "type": "Company", "desc": "Oil and gas company"},
        {"name": "Telenor", "type": "Company", "desc": "Telecommunications"},
        {"name": "DNB", "type": "Company", "desc": "Banking"},
        {"name": "Norsk Hydro", "type": "Company", "desc": "Aluminum and energy"},
        {"name": "Orkla", "type": "Company", "desc": "Consumer goods"},
        {"name": "Yara", "type": "Company", "desc": "Fertilizer company"},
        {"name": "University of Oslo", "type": "University", "desc": "Oldest university"},
        {"name": "Norwegian University of Science and Technology", "type": "University", "desc": "NTNU"},
        {"name": "University of Bergen", "type": "University", "desc": "Research university"},
        {"name": "Norwegian School of Economics", "type": "University", "desc": "Business school"},
        {"name": "Munch Museum", "type": "Museum", "desc": "Art museum"},
        {"name": "Viking Ship Museum", "type": "Museum", "desc": "Maritime history"},
        {"name": "Fram Museum", "type": "Museum", "desc": "Polar exploration"},
        {"name": "Nobel Peace Center", "type": "Museum", "desc": "Peace prize"},
        {"name": "Norwegian Armed Forces", "type": "Organization", "desc": "Military"},
        {"name": "Storting", "type": "Organization", "desc": "Parliament"},
        {"name": "Statistics Norway", "type": "Organization", "desc": "Statistical office"}
    ]
    
    # Add organizations
    for org in organizations:
        nodes.append({
            "step": step_counter,
            "data": {"id": org["name"].lower().replace(" ", "_").replace("ø", "o").replace("å", "a"), 
                    "label": org["name"], "type": org["type"]}
        })
        step_counter += 1
    
    # Geographic features
    geographic_features = [
        {"name": "Galdhøpiggen", "type": "Mountain", "desc": "Highest peak"},
        {"name": "Glittertind", "type": "Mountain", "desc": "Second highest peak"},
        {"name": "Store Skagastølstind", "type": "Mountain", "desc": "Third highest peak"},
        {"name": "Mjøsa", "type": "Lake", "desc": "Largest lake"},
        {"name": "Røssvatnet", "type": "Lake", "desc": "Second largest lake"},
        {"name": "Femund", "type": "Lake", "desc": "Third largest lake"},
        {"name": "Glomma", "type": "River", "desc": "Longest river"},
        {"name": "Drammenselva", "type": "River", "desc": "Major river"},
        {"name": "Tana", "type": "River", "desc": "Northern river"},
        {"name": "Lofoten", "type": "Island", "desc": "Island archipelago"},
        {"name": "Vesterålen", "type": "Island", "desc": "Island group"},
        {"name": "Svalbard", "type": "Island", "desc": "Arctic archipelago"}
    ]
    
    # Add geographic features
    for feature in geographic_features:
        nodes.append({
            "step": step_counter,
            "data": {"id": feature["name"].lower().replace(" ", "_").replace("ø", "o").replace("å", "a"), 
                    "label": feature["name"], "type": feature["type"]}
        })
        step_counter += 1
    
    # Generate additional synthetic nodes to reach ~1000 nodes
    synthetic_categories = [
        {"type": "Municipality", "prefix": "Kommune_", "count": 200},
        {"type": "Person", "prefix": "Person_", "count": 300},
        {"type": "Company", "prefix": "Company_", "count": 150},
        {"type": "Organization", "prefix": "Org_", "count": 100},
        {"type": "Event", "prefix": "Event_", "count": 75},
        {"type": "Mountain", "prefix": "Peak_", "count": 50},
        {"type": "Lake", "prefix": "Lake_", "count": 50},
        {"type": "River", "prefix": "River_", "count": 25}
    ]
    
    for category in synthetic_categories:
        for i in range(1, category["count"] + 1):
            nodes.append({
                "step": step_counter,
                "data": {"id": f"{category['prefix']}{i:03d}", 
                        "label": f"{category['prefix'].replace('_', ' ')}{i:03d}", 
                        "type": category["type"]}
            })
            step_counter += 1
    
    # Generate edges
    edges = []
    edge_step = 1
    
    # Basic location relationships
    location_edges = [
        {"source": "oslo", "target": "norway", "label": "capital_of"},
        {"source": "bergen", "target": "norway", "label": "located_in"},
        {"source": "trondheim", "target": "norway", "label": "located_in"},
        {"source": "stavanger", "target": "norway", "label": "located_in"},
        {"source": "kristiansand", "target": "norway", "label": "located_in"},
        {"source": "tromso", "target": "norway", "label": "located_in"},
        {"source": "drammen", "target": "norway", "label": "located_in"},
    ]
    
    for edge in location_edges:
        edges.append({
            "step": step_counter,
            "data": {"id": f"e{edge_step:04d}", "source": edge["source"], 
                    "target": edge["target"], "label": edge["label"]}
        })
        edge_step += 1
        step_counter += 1
    
    # Generate many more edges randomly to create a dense network
    node_ids = [node["data"]["id"] for node in nodes if node["step"] > 30]  # Skip ontology items
    relationship_types = ["located_in", "part_of", "member_of", "works_at", "born_in", "founded", "borders"]
    
    # Generate random edges to create a connected graph
    for i in range(2000):  # Generate 2000 edges
        source = random.choice(node_ids)
        target = random.choice(node_ids)
        if source != target:  # Avoid self-loops
            relationship = random.choice(relationship_types)
            edges.append({
                "step": step_counter,
                "data": {"id": f"e{edge_step:04d}", "source": source, 
                        "target": target, "label": relationship}
            })
            edge_step += 1
            step_counter += 1
    
    return {
        "ontology": ontology,
        "nodes": nodes,
        "edges": edges
    }

# Generate the large dataset
NORWAY_GRAPH_DATA = generate_norway_dataset()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/graph-data')
def get_graph_data():
    """Return all graph data for client-side simulation"""
    return jsonify(NORWAY_GRAPH_DATA)

@app.route('/api/graph-data/small')
def get_small_graph_data():
    """Return original small dataset for testing"""
    small_data = {
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
    return jsonify(small_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
