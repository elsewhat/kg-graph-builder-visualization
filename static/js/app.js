class KnowledgeGraphBuilder {
    constructor() {
        this.cy = null;
        this.graphData = null;
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timeoutId = null;
        this.speed = 1500; // milliseconds
        
        this.elements = {
            ontology: [],
            nodes: [],
            edges: []
        };
        
        this.init();
    }
    
    async init() {
        await this.loadGraphData();
        this.initializeCytoscape();
        this.setupEventListeners();
        this.updateStats();
    }
    
    async loadGraphData() {
        try {
            const response = await fetch('/api/graph-data');
            this.graphData = await response.json();
        } catch (error) {
            console.error('Failed to load graph data:', error);
        }
    }
      initializeCytoscape() {
        this.cy = cytoscape({
            container: document.getElementById('cy'),
            
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': 'data(color)',
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'color': '#ffffff',
                        'text-outline-width': 2,
                        'text-outline-color': '#333',
                        'font-size': '12px',
                        'font-weight': 'bold',
                        'width': 'mapData(degree, 0, 10, 30, 80)',
                        'height': 'mapData(degree, 0, 10, 30, 80)',
                        'border-width': 3,
                        'border-color': '#333',
                        'transition-property': 'background-color, border-color, width, height',
                        'transition-duration': '0.3s'
                    }
                },
                {
                    selector: 'node[type="Person"]',
                    style: {
                        'background-color': '#3b82f6',
                        'shape': 'ellipse'
                    }
                },
                {
                    selector: 'node[type="Organization"]',
                    style: {
                        'background-color': '#10b981',
                        'shape': 'rectangle'
                    }
                },
                {
                    selector: 'node[type="Location"]',
                    style: {
                        'background-color': '#f59e0b',
                        'shape': 'diamond'
                    }
                },
                {
                    selector: 'node[type="Event"]',
                    style: {
                        'background-color': '#ef4444',
                        'shape': 'octagon'
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-width': 4,
                        'border-color': '#ff6b6b'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#64748b',
                        'target-arrow-color': '#64748b',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '10px',
                        'text-background-color': '#ffffff',
                        'text-background-opacity': 0.8,
                        'text-background-padding': '3px',
                        'color': '#333',
                        'text-rotation': 'autorotate',
                        'transition-property': 'line-color, target-arrow-color, width',
                        'transition-duration': '0.3s'
                    }
                },
                {
                    selector: 'edge:selected',
                    style: {
                        'line-color': '#ff6b6b',
                        'target-arrow-color': '#ff6b6b',
                        'width': 4
                    }
                },
                {
                    selector: '.highlighted',
                    style: {
                        'background-color': '#ff6b6b',
                        'line-color': '#ff6b6b',
                        'target-arrow-color': '#ff6b6b',
                        'border-color': '#ff6b6b'
                    }
                },
                {
                    selector: '.new-element',
                    style: {
                        'opacity': 0,
                        'width': 10,
                        'height': 10
                    }
                }
            ],
              layout: {
                name: 'cose',
                animate: true,
                animationDuration: 1000,
                animationEasing: 'ease-out',
                fit: true,
                padding: 50,
                nodeDimensionsIncludeLabels: true,
                randomize: false,
                componentSpacing: 100,
                nodeRepulsion: 400000,
                nodeOverlap: 10,
                idealEdgeLength: 100,
                edgeElasticity: 100,
                nestingFactor: 5,
                gravity: 80,
                numIter: 1000,
                initialTemp: 200,
                coolingFactor: 0.95,
                minTemp: 1.0
            },
            
            elements: []
        });
        
        // Add hover effects
        this.cy.on('mouseover', 'node', (evt) => {
            const node = evt.target;
            node.animate({
                style: { 'width': '+=10', 'height': '+=10' }
            }, {
                duration: 200
            });
        });
        
        this.cy.on('mouseout', 'node', (evt) => {
            const node = evt.target;
            node.animate({
                style: { 'width': '-=10', 'height': '-=10' }
            }, {
                duration: 200
            });
        });
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        
        const speedSlider = document.getElementById('speed');
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            document.getElementById('speed-value').textContent = (this.speed / 1000).toFixed(1) + 's';
        });
    }
    
    start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.isRunning = true;
            this.continueBuilding();
        } else {
            this.isRunning = true;
            this.buildGraph();
        }
        
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
    }
    
    pause() {
        this.isPaused = true;
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('current-action').textContent = 'Paused - Click Start to continue';
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        // Clear cytoscape
        this.cy.elements().remove();
        
        // Clear ontology list
        document.getElementById('ontology-list').innerHTML = '';
        
        // Reset elements
        this.elements = {
            ontology: [],
            nodes: [],
            edges: []
        };
        
        // Reset UI
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('current-action').textContent = 'Ready to start building...';
        
        this.updateStats();
    }
    
    buildGraph() {
        if (!this.isRunning || this.isPaused) return;
        
        const allItems = [
            ...this.graphData.ontology.map(item => ({...item, type: 'ontology'})),
            ...this.graphData.nodes.map(item => ({...item, type: 'node'})),
            ...this.graphData.edges.map(item => ({...item, type: 'edge'}))
        ].sort((a, b) => a.step - b.step);
        
        if (this.currentStep < allItems.length) {
            const currentItem = allItems[this.currentStep];
            this.processItem(currentItem);
            this.currentStep++;
            
            this.timeoutId = setTimeout(() => this.buildGraph(), this.speed);
        } else {
            this.finish();
        }
    }
    
    continueBuilding() {
        this.buildGraph();
    }
    
    processItem(item) {
        switch (item.type) {
            case 'ontology':
                this.addOntologyItem(item);
                break;
            case 'node':
                this.addNode(item);
                break;
            case 'edge':
                this.addEdge(item);
                break;
        }
        
        this.updateStats();
    }
    
    addOntologyItem(item) {
        this.elements.ontology.push(item);
        
        const ontologyList = document.getElementById('ontology-list');
        const ontologyDiv = document.createElement('div');
        ontologyDiv.className = 'ontology-item';
        ontologyDiv.innerHTML = `
            <div class="concept">${item.concept}</div>
            <div class="description">${item.description}</div>
        `;
        
        ontologyList.appendChild(ontologyDiv);
        
        // Animate in
        setTimeout(() => {
            ontologyDiv.classList.add('visible');
        }, 50);
        
        document.getElementById('current-action').textContent = `Added ontology concept: ${item.concept}`;
    }
    
    addNode(item) {
        this.elements.nodes.push(item);
        
        const nodeData = {
            ...item.data,
            color: this.getNodeColor(item.data.type)
        };
        
        // Add node with animation class
        this.cy.add({
            group: 'nodes',
            data: nodeData,
            classes: 'new-element'
        });
        
        const newNode = this.cy.getElementById(item.data.id);
        
        // Animate the node in
        newNode.animate({
            style: {
                'opacity': 1,
                'width': this.getNodeSize(item.data.type),
                'height': this.getNodeSize(item.data.type)
            }
        }, {
            duration: 500,
            easing: 'ease-out-bounce'
        });
        
        // Update layout
        this.updateLayout();
        
        document.getElementById('current-action').textContent = `Added ${item.data.type}: ${item.data.label}`;
    }
    
    addEdge(item) {
        this.elements.edges.push(item);
        
        // Add edge
        this.cy.add({
            group: 'edges',
            data: item.data,
            classes: 'new-element'
        });
        
        const newEdge = this.cy.getElementById(item.data.id);
        
        // Animate the edge in
        newEdge.animate({
            style: {
                'opacity': 1,
                'width': 3
            }
        }, {
            duration: 300
        });
        
        // Highlight connected nodes briefly
        const sourceNode = this.cy.getElementById(item.data.source);
        const targetNode = this.cy.getElementById(item.data.target);
        
        sourceNode.addClass('highlighted');
        targetNode.addClass('highlighted');
        
        setTimeout(() => {
            sourceNode.removeClass('highlighted');
            targetNode.removeClass('highlighted');
        }, 1000);
        
        // Update layout
        this.updateLayout();
        
        document.getElementById('current-action').textContent = `Connected ${item.data.source} → ${item.data.target} (${item.data.label})`;
    }
    
    getNodeColor(type) {
        const colors = {
            'Person': '#3b82f6',
            'Organization': '#10b981',
            'Location': '#f59e0b',
            'Event': '#ef4444'
        };
        return colors[type] || '#64748b';
    }
    
    getNodeSize(type) {
        const sizes = {
            'Person': 60,
            'Organization': 70,
            'Location': 65,
            'Event': 65
        };
        return sizes[type] || 50;
    }
      updateLayout() {
        // Only run layout if we have multiple elements
        if (this.cy.elements().length > 1) {
            const layout = this.cy.layout({
                name: 'cose',
                animate: true,
                animationDuration: 800,
                fit: true,
                padding: 50,
                randomize: false,
                nodeRepulsion: 400000,
                idealEdgeLength: 100,
                edgeElasticity: 100
            });
            layout.run();
        }
    }
    
    updateStats() {
        document.getElementById('current-step').textContent = this.currentStep;
        document.getElementById('node-count').textContent = this.elements.nodes.length;
        document.getElementById('edge-count').textContent = this.elements.edges.length;
        document.getElementById('concept-count').textContent = this.elements.ontology.length;
    }
    
    finish() {
        this.isRunning = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('current-action').textContent = 'Knowledge graph construction complete!';
        
        // Final layout adjustment
        this.cy.fit(50);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KnowledgeGraphBuilder();
});
