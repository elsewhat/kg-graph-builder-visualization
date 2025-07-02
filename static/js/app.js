class KnowledgeGraphBuilder {constructor() {
        this.cy = null;
        this.graphData = null;
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timeoutId = null;
        this.speed = 50; // milliseconds - much faster for large dataset
        
        this.elements = {
            ontology: [],
            nodes: [],
            edges: []
        };
        
        this.hiddenConcepts = new Set(); // Track hidden ontology concepts
        
        this.init();
    }
      async init() {
        await this.loadGraphData();
        this.initializeCytoscape();
        this.setupEventListeners();
        this.updateStats();
        this.checkAvailableLayouts();
    }
    
    async loadGraphData() {
        try {
            const response = await fetch('/api/graph-data');
            this.graphData = await response.json();
        } catch (error) {
            console.error('Failed to load graph data:', error);
        }
    }    initializeCytoscape() {        this.cy = cytoscape({
            container: document.getElementById('cy'),
            
            // Performance optimizations for large graphs
            hideEdgesOnViewport: false,
            hideLabelsOnViewport: true,
            textureOnViewport: true,
            motionBlur: true,
            motionBlurOpacity: 0.2,
            wheelSensitivity: 0.1,
            pixelRatio: 'auto',
            
            style: [{
                    selector: 'node',
                    style: {
                        'background-color': 'data(color)',
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',                        'color': '#ffffff',
                        'text-outline-width': 2,
                        'text-outline-color': '#333',
                        'font-size': '12px',
                        'font-weight': 'bold',
                        'width': '100px',
                        'height': '100px',
                        'border-width': 4,
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
                },                {
                    selector: 'node[type="Event"]',
                    style: {
                        'background-color': '#ef4444',
                        'shape': 'octagon'
                    }
                },
                {
                    selector: 'node[type="Country"]',
                    style: {
                        'background-color': '#dc2626',
                        'shape': 'star',
                        'width': '120px',
                        'height': '120px'
                    }
                },
                {
                    selector: 'node[type="City"]',
                    style: {
                        'background-color': '#2563eb',
                        'shape': 'round-rectangle'
                    }
                },
                {
                    selector: 'node[type="Municipality"]',
                    style: {
                        'background-color': '#7c3aed',
                        'shape': 'round-rectangle'
                    }
                },
                {
                    selector: 'node[type="County"]',
                    style: {
                        'background-color': '#0891b2',
                        'shape': 'rectangle'
                    }
                },
                {
                    selector: 'node[type="Politician"]',
                    style: {
                        'background-color': '#be123c',
                        'shape': 'ellipse'
                    }
                },
                {
                    selector: 'node[type="Artist"]',
                    style: {
                        'background-color': '#a21caf',
                        'shape': 'ellipse'
                    }
                },
                {
                    selector: 'node[type="Scientist"]',
                    style: {
                        'background-color': '#0369a1',
                        'shape': 'ellipse'
                    }
                },
                {
                    selector: 'node[type="Athlete"]',
                    style: {
                        'background-color': '#15803d',
                        'shape': 'ellipse'
                    }
                },
                {
                    selector: 'node[type="Company"]',
                    style: {
                        'background-color': '#ca8a04',
                        'shape': 'rectangle'
                    }
                },
                {
                    selector: 'node[type="University"]',
                    style: {
                        'background-color': '#9333ea',
                        'shape': 'hexagon'
                    }
                },
                {
                    selector: 'node[type="Museum"]',
                    style: {
                        'background-color': '#c2410c',
                        'shape': 'pentagon'
                    }
                },
                {
                    selector: 'node[type="Festival"]',
                    style: {
                        'background-color': '#ec4899',
                        'shape': 'star'
                    }
                },
                {
                    selector: 'node[type="Treaty"]',
                    style: {
                        'background-color': '#6b7280',
                        'shape': 'diamond'
                    }
                },
                {
                    selector: 'node[type="Mountain"]',
                    style: {
                        'background-color': '#78716c',
                        'shape': 'triangle'
                    }
                },
                {
                    selector: 'node[type="Lake"]',
                    style: {
                        'background-color': '#0284c7',
                        'shape': 'ellipse'
                    }
                },
                {
                    selector: 'node[type="River"]',
                    style: {
                        'background-color': '#0891b2',
                        'shape': 'round-rectangle'
                    }
                },
                {
                    selector: 'node[type="Island"]',
                    style: {
                        'background-color': '#059669',
                        'shape': 'round-octagon'
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
                },                {
                    selector: '.new-node',
                    style: {
                        'opacity': 0,
                        'width': '20px',
                        'height': '20px'
                    }
                },
                {
                    selector: '.new-edge',
                    style: {
                        'opacity': 0,
                        'width': '1px'
                    }
                }
            ],              layout: {
                name: 'preset', // Start with preset layout, we'll manage layouts dynamically
                animate: false,
                fit: false,
                positions: {} // Empty positions, nodes will be positioned as they're added
            },
            
            elements: []        });
          // Log renderer and performance information
        console.log('Cytoscape initialized with performance optimizations:', {
            renderer: this.cy.renderer().name,
            nodeCount: this.cy.nodes().length,
            edgeCount: this.cy.edges().length,
            container: this.cy.container().tagName
        });
          // Check for hardware acceleration capabilities
        const container = this.cy.container();
        const canvas = container.querySelector('canvas');
        const svg = container.querySelector('svg');
        
        if (canvas) {
            console.log('✓ Canvas rendering enabled');
            // Try to detect WebGL support
            try {
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    console.log('✓ WebGL context available for hardware acceleration');
                    console.log('WebGL renderer:', gl.getParameter(gl.RENDERER));
                } else {
                    console.log('✓ Canvas 2D rendering (hardware accelerated where supported)');
                }
            } catch (e) {
                console.log('✓ Canvas rendering available');
            }
        } else if (svg) {
            console.log('ℹ Using SVG renderer');
        } else {
            console.log('ℹ Renderer type could not be determined');
        }
        
        // Ensure proper sizing
        this.cy.resize();
        this.cy.fit();
    }    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('apply-layout-btn').addEventListener('click', () => this.applyCustomLayout());
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
        
        // Hide layout controls when running
        this.hideLayoutControls();
        
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
    }pause() {
        this.isPaused = true;
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        // Update layout when pausing to clean up current state
        this.updateLayout();
        
        // Show layout controls when paused
        this.showLayoutControls();
        
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('current-action').textContent = 'Paused - Click Start to continue';
    }    reset() {
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
        
        // Reset hidden concepts
        this.hiddenConcepts.clear();
        
        // Hide layout controls on reset
        this.hideLayoutControls();
        
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
        ontologyDiv.dataset.concept = item.concept; // Store concept name for reference
        ontologyDiv.innerHTML = `
            <div class="concept">${item.concept}</div>
            <div class="description">${item.description}</div>
        `;
        
        // Add click listener to toggle visibility
        ontologyDiv.addEventListener('click', () => {
            this.toggleConceptVisibility(item.concept, ontologyDiv);
        });
        
        ontologyList.appendChild(ontologyDiv);
        
        // Animate in
        setTimeout(() => {
            ontologyDiv.classList.add('visible');
        }, 50);
          document.getElementById('current-action').textContent = `Added ontology concept: ${item.concept}`;
    }

    toggleConceptVisibility(concept, ontologyDiv) {
        if (this.hiddenConcepts.has(concept)) {
            // Show the concept
            this.hiddenConcepts.delete(concept);
            ontologyDiv.classList.remove('hidden');
            this.showConceptInGraph(concept);
            document.getElementById('current-action').textContent = `Showed concept: ${concept}`;
        } else {
            // Hide the concept
            this.hiddenConcepts.add(concept);
            ontologyDiv.classList.add('hidden');
            this.hideConceptInGraph(concept);
            document.getElementById('current-action').textContent = `Hidden concept: ${concept}`;
        }
    }

    hideConceptInGraph(concept) {
        // Find nodes that belong to this concept type
        const nodesToHide = this.cy.nodes().filter(node => {
            const nodeType = node.data('type');
            return nodeType === concept;
        });

        // Hide the nodes and their connected edges
        nodesToHide.style('display', 'none');
        
        // Hide edges connected to these nodes
        nodesToHide.connectedEdges().style('display', 'none');
    }

    showConceptInGraph(concept) {
        // Find nodes that belong to this concept type
        const nodesToShow = this.cy.nodes().filter(node => {
            const nodeType = node.data('type');
            return nodeType === concept;
        });

        // Show the nodes
        nodesToShow.style('display', 'element');
        
        // Show edges connected to these nodes (only if both endpoints are visible)
        nodesToShow.connectedEdges().forEach(edge => {
            const sourceVisible = edge.source().style('display') !== 'none';
            const targetVisible = edge.target().style('display') !== 'none';
            if (sourceVisible && targetVisible) {
                edge.style('display', 'element');
            }
        });
    }addNode(item) {
        this.elements.nodes.push(item);
        
        // Check if we should animate and update layout (every 100 nodes)
        const shouldAnimate = this.elements.nodes.length % 100 === 0;
        
        // Check if a node with this ID already exists
        const existingNode = this.cy.getElementById(item.data.id);
        if (existingNode.length > 0) {
            // Node already exists, modify the label to include the type in parentheses
            const existingLabel = existingNode.data('label');
            const existingType = existingNode.data('type');
            
            // Update existing node label to include type
            if (!existingLabel.includes('(')) {
                existingNode.data('label', `${existingLabel} (${existingType})`);
            }
            
            // Create new unique ID for the current item
            const newId = `${item.data.id}_${item.data.type.toLowerCase()}`;
            const newLabel = `${item.data.label} (${item.data.type})`;
            
            const nodeData = {
                ...item.data,
                id: newId,
                label: newLabel,
                color: this.getNodeColor(item.data.type)
            };
            
            // Add node with animation class and new ID
            this.cy.add({
                group: 'nodes',
                data: nodeData,
                classes: 'new-node'
            });
              const newNode = this.cy.getElementById(newId);
            
            // Check if this concept type is hidden
            if (this.hiddenConcepts.has(item.data.type)) {
                newNode.style('display', 'none');
            }
            
            // Animate the node in only if we should animate
            if (shouldAnimate) {
                newNode.animate({
                    style: {
                        'opacity': 1,
                        'width': this.getNodeSize(item.data.type) + 'px',
                        'height': this.getNodeSize(item.data.type) + 'px'
                    }
                }, {
                    duration: 500,
                    easing: 'ease-out'
                });
            } else {
                // No animation, just set final state immediately
                newNode.style({
                    'opacity': 1,
                    'width': this.getNodeSize(item.data.type) + 'px',
                    'height': this.getNodeSize(item.data.type) + 'px'
                });
            }
            
            document.getElementById('current-action').textContent = `Added ${item.data.type}: ${newLabel} (resolved duplicate)`;
        } else {
            // No duplicate, proceed normally
            const nodeData = {
                ...item.data,
                color: this.getNodeColor(item.data.type)
            };
            
            // Add node with animation class
            this.cy.add({
                group: 'nodes',
                data: nodeData,
                classes: 'new-node'
            });
              const newNode = this.cy.getElementById(item.data.id);
            
            // Check if this concept type is hidden
            if (this.hiddenConcepts.has(item.data.type)) {
                newNode.style('display', 'none');
            }
            
            // Animate the node in only if we should animate
            if (shouldAnimate) {
                newNode.animate({
                    style: {
                        'opacity': 1,
                        'width': this.getNodeSize(item.data.type) + 'px',
                        'height': this.getNodeSize(item.data.type) + 'px'
                    }
                }, {
                    duration: 100,
                    easing: 'ease-out'
                });
            } else {
                // No animation, just set final state immediately
                newNode.style({
                    'opacity': 1,
                    'width': this.getNodeSize(item.data.type) + 'px',
                    'height': this.getNodeSize(item.data.type) + 'px'
                });
            }
            
            document.getElementById('current-action').textContent = `Added ${item.data.type}: ${item.data.label}`;
        }
          // Update layout only when we should animate
        if (shouldAnimate) {
            this.updateLayout();
        }
        // No zoom adjustment between layout updates for cleaner experience
    }
      adjustZoom() {
        const nodeCount = this.cy.nodes().length;
        let zoomLevel = 1;
        
        if (nodeCount > 100) {
            zoomLevel = Math.max(0.1, 1 - (nodeCount - 100) / 1000);
        }
        
        // Smoothly adjust zoom without changing the center
        this.cy.animate({
            zoom: zoomLevel
        }, {
            duration: 200
        });
    }    addEdge(item) {
        this.elements.edges.push(item);
        
        // Check if we should animate and update layout (every 100 edges)
        const shouldAnimate = this.elements.edges.length % 100 === 0;
        
        // Check if the source and target nodes exist, if not try with modified IDs
        let sourceId = item.data.source;
        let targetId = item.data.target;
        
        // If source node doesn't exist, try to find it with type suffix
        if (this.cy.getElementById(sourceId).length === 0) {
            const possibleIds = this.cy.nodes().map(node => node.id()).filter(id => id.startsWith(sourceId + '_'));
            if (possibleIds.length > 0) {
                sourceId = possibleIds[0]; // Use the first match
            }
        }
        
        // If target node doesn't exist, try to find it with type suffix
        if (this.cy.getElementById(targetId).length === 0) {
            const possibleIds = this.cy.nodes().map(node => node.id()).filter(id => id.startsWith(targetId + '_'));
            if (possibleIds.length > 0) {
                targetId = possibleIds[0]; // Use the first match
            }
        }
        
        // Create the edge with potentially modified IDs
        const edgeData = {
            ...item.data,
            source: sourceId,
            target: targetId
        };
        
        // Add edge
        this.cy.add({
            group: 'edges',
            data: edgeData,
            classes: 'new-edge'
        });
          const newEdge = this.cy.getElementById(item.data.id);
        
        // Check if either endpoint node is hidden
        const sourceNode = this.cy.getElementById(sourceId);
        const targetNode = this.cy.getElementById(targetId);
        const sourceHidden = sourceNode.length > 0 && sourceNode.style('display') === 'none';
        const targetHidden = targetNode.length > 0 && targetNode.style('display') === 'none';
        
        if (sourceHidden || targetHidden) {
            newEdge.style('display', 'none');
        }
        
        // Animate the edge in only if we should animate
        if (shouldAnimate) {
            newEdge.animate({
                style: {
                    'opacity': 1,
                    'width': 3
                }
            }, {
                duration: 300
            });
        } else {
            // No animation, just set final state immediately
            newEdge.style({
                'opacity': 1,
                'width': 3
            });
        }
        
        // Highlight connected nodes briefly only when we should animate
        if (shouldAnimate) {
            const sourceNode = this.cy.getElementById(sourceId);
            const targetNode = this.cy.getElementById(targetId);
            
            sourceNode.addClass('highlighted');
            targetNode.addClass('highlighted');
            
            setTimeout(() => {
                sourceNode.removeClass('highlighted');
                targetNode.removeClass('highlighted');
            }, 1000);
        }
        
        // Update layout only when we should animate
        if (shouldAnimate) {
            this.updateLayout();
        }
        
        document.getElementById('current-action').textContent = `Connected ${sourceId} → ${targetId} (${item.data.label})`;
    }
      getNodeColor(type) {
        const colors = {
            'Person': '#3b82f6',
            'Organization': '#10b981',
            'Location': '#f59e0b',
            'Event': '#ef4444',
            'Country': '#dc2626',
            'City': '#2563eb',
            'Municipality': '#7c3aed',
            'County': '#0891b2',
            'Politician': '#be123c',
            'Artist': '#a21caf',
            'Scientist': '#0369a1',
            'Athlete': '#15803d',
            'Company': '#ca8a04',
            'University': '#9333ea',
            'Museum': '#c2410c',
            'Festival': '#ec4899',
            'Treaty': '#6b7280',
            'Mountain': '#78716c',
            'Lake': '#0284c7',
            'River': '#0891b2',
            'Island': '#059669'
        };
        return colors[type] || '#64748b';
    }
      getNodeSize(type) {
        const sizes = {
            'Person': 100,
            'Organization': 100,
            'Location': 100,
            'Event': 100,
            'Country': 120,
            'City': 100,
            'Municipality': 90,
            'County': 110,
            'Politician': 100,
            'Artist': 100,
            'Scientist': 100,
            'Athlete': 100,
            'Company': 100,
            'University': 110,
            'Museum': 100,
            'Festival': 100,
            'Treaty': 100,
            'Mountain': 100,
            'Lake': 100,
            'River': 100,
            'Island': 100
        };
        return sizes[type] || 100;
    }      updateLayout() {
        const nodeCount = this.cy.nodes().length;
        const edgeCount = this.cy.edges().length;
        
        // Calculate appropriate zoom level based on node count
        let zoomLevel = 1;
        if (nodeCount > 100) {
            zoomLevel = Math.max(0.1, 1 - (nodeCount - 100) / 1000);
        }
          // Adjust padding based on node count
        const padding = Math.max(50, 150 - nodeCount / 10);
        
        // Always use cose layout but adjust parameters based on graph size
        let layoutOptions = {
            name: 'cose',
            fit: false, // Don't auto-fit to avoid panning
            padding: padding,
            randomize: false
        };
          if (nodeCount < 50) {
            // Small graph - use full animation and high quality
            layoutOptions = {
                ...layoutOptions,
                animate: true,
                animationDuration: 300,
                nodeRepulsion: 800000,
                idealEdgeLength: 200,
                edgeElasticity: 100,
                numIter: 1000
            };
        } else if (nodeCount < 200) {
            // Medium graph - reduce animation and iterations
            layoutOptions = {
                ...layoutOptions,
                animate: false,
                nodeRepulsion: 400000,
                idealEdgeLength: 150,
                edgeElasticity: 50,
                numIter: 500
            };
        } else {
            // Large graph - minimal iterations for performance
            layoutOptions = {
                ...layoutOptions,
                animate: false,
                nodeRepulsion: 200000,
                idealEdgeLength: 120,
                edgeElasticity: 25,
                numIter: 200
            };
        }
        
        const layout = this.cy.layout(layoutOptions);
        layout.run();
        
        // Apply zoom level gradually without changing center position
        setTimeout(() => {
            this.cy.zoom(zoomLevel);
        }, 100);
    }    updateStats() {
        document.getElementById('current-step').textContent = this.currentStep;
        document.getElementById('node-count').textContent = this.elements.nodes.length;
        document.getElementById('edge-count').textContent = this.elements.edges.length;
        document.getElementById('concept-count').textContent = this.elements.ontology.length;
    }    checkAvailableLayouts() {
        const layoutSelect = document.getElementById('layout-type');
        if (!layoutSelect) {
            console.warn('Layout dropdown not found');
            return;
        }
        
        const options = layoutSelect.querySelectorAll('option');
          // Check which layouts are available by testing if they're registered
        const availableLayouts = new Set(['preset', 'grid', 'circle', 'concentric', 'breadthfirst', 'cose']);
        
        // Check for extended layouts by testing if we can create them
        const extendedLayouts = ['cose-bilkent', 'fcose', 'cola'];
        
        extendedLayouts.forEach(layoutName => {
            try {
                // Test by creating a minimal layout instance
                if (this.cy) {
                    const testLayout = this.cy.layout({ 
                        name: layoutName, 
                        randomize: false, 
                        animate: false,
                        fit: false,
                        stop: () => {} // prevent any actual execution
                    });
                    availableLayouts.add(layoutName);
                    console.log(`✓ Layout '${layoutName}' is available`);
                } else {
                    // Fallback: test with a temporary cytoscape instance
                    const tempCy = cytoscape({
                        elements: [{ data: { id: 'test' } }],
                        headless: true
                    });
                    const testLayout = tempCy.layout({ name: layoutName });
                    tempCy.destroy();
                    availableLayouts.add(layoutName);
                    console.log(`✓ Layout '${layoutName}' is available (tested with temp instance)`);
                }
            } catch (e) {
                console.log(`✗ Layout '${layoutName}' is NOT available:`, e.message);
            }
        });
        
        // Update dropdown options
        options.forEach(option => {
            const layoutName = option.value;
            if (!availableLayouts.has(layoutName)) {
                option.disabled = true;
                option.textContent = option.textContent.replace(' (Not Available)', '') + ' (Not Available)';
                option.style.color = '#999';
            } else {
                option.disabled = false;
                option.textContent = option.textContent.replace(' (Not Available)', '');
                option.style.color = '';
            }
        });
        
        console.log('Available layouts for dropdown:', Array.from(availableLayouts));
    }
    
    showLayoutControls() {
        const controlsDiv = document.getElementById('layout-controls');
        controlsDiv.style.display = 'block';
        
        // Update controls with current layout values
        this.updateLayoutControlValues();
    }
    
    hideLayoutControls() {
        const controlsDiv = document.getElementById('layout-controls');
        controlsDiv.style.display = 'none';
    }
    
    updateLayoutControlValues() {
        const nodeCount = this.cy.nodes().length;
        
        // Set default values based on current graph size
        let idealEdgeLength = 150;
        let nodeRepulsion = 400000;
        let padding = 50;
        
        if (nodeCount < 50) {
            idealEdgeLength = 200;
            nodeRepulsion = 800000;
            padding = Math.max(50, 150 - nodeCount / 10);
        } else if (nodeCount < 200) {
            idealEdgeLength = 150;
            nodeRepulsion = 400000;
            padding = Math.max(50, 150 - nodeCount / 10);
        } else {
            idealEdgeLength = 120;
            nodeRepulsion = 200000;
            padding = Math.max(50, 150 - nodeCount / 10);
        }
        
        document.getElementById('layout-type').value = 'cose';
        document.getElementById('ideal-edge-length').value = idealEdgeLength;
        document.getElementById('node-repulsion').value = nodeRepulsion;
        document.getElementById('padding').value = padding;
    }
    
    applyCustomLayout() {
        const layoutType = document.getElementById('layout-type').value;
        const idealEdgeLength = parseInt(document.getElementById('ideal-edge-length').value);
        const nodeRepulsion = parseInt(document.getElementById('node-repulsion').value);
        const padding = parseInt(document.getElementById('padding').value);
        
        document.getElementById('current-action').textContent = `Applying ${layoutType} layout...`;
        
        let layoutOptions = {
            name: layoutType,
            fit: false,
            padding: padding,
            randomize: false
        };        // Add specific options for different layout types
        if (layoutType === 'cose') {
            layoutOptions = {
                ...layoutOptions,
                animate: true,
                animationDuration: 1000,
                nodeRepulsion: nodeRepulsion,
                idealEdgeLength: idealEdgeLength,
                edgeElasticity: 100,
                numIter: 1000
            };
        } else if (layoutType === 'cose-bilkent') {
            layoutOptions = {
                ...layoutOptions,
                animate: true,
                animationDuration: 1000,
                nodeRepulsion: nodeRepulsion,
                idealEdgeLength: idealEdgeLength,
                edgeElasticity: 0.45,
                numIter: 2500,
                tile: true,
                tilingPaddingVertical: 10,
                tilingPaddingHorizontal: 10
            };
        } else if (layoutType === 'fcose') {
            layoutOptions = {
                ...layoutOptions,
                animate: true,
                animationDuration: 1000,
                nodeRepulsion: nodeRepulsion,
                idealEdgeLength: idealEdgeLength,
                edgeElasticity: 0.45,
                numIter: 2500,
                tile: true,
                samplingType: true,
                sampleSize: 25
            };
        } else if (layoutType === 'cola') {
            layoutOptions = {
                ...layoutOptions,
                animate: true,
                animationDuration: 1000,
                maxSimulationTime: 4000,
                ungrabifyWhileSimulating: false,
                nodeSpacing: function(node) { return 10; },
                edgeLength: idealEdgeLength,
                edgeSymDiffLength: 10,
                edgeJaccardLength: 10
            };
        }
        
        // Apply the layout
        const layout = this.cy.layout(layoutOptions);
        layout.run();
        
        // Update status when layout is complete
        setTimeout(() => {
            document.getElementById('current-action').textContent = `Layout applied: ${layoutType}`;
        }, 1200);
    }
    
    finish() {
        this.isRunning = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('current-action').textContent = 'Knowledge graph construction complete!';
        
        // Show layout controls when finished
        this.showLayoutControls();
        
        // Final layout update and fit to show the complete graph
        this.updateLayout();
        setTimeout(() => {
            this.cy.fit(50);
        }, 500);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking extension registration...');
    
    // Give extensions time to auto-register since cytoscape is now globally available
    setTimeout(() => {
        console.log('Testing which layouts are available...');
        
        // Test which layouts are actually available by creating a temporary cytoscape instance
        try {
            const testCy = cytoscape({
                elements: [{ data: { id: 'test' } }],
                headless: true
            });
            
            const layoutsToTest = ['cose', 'cose-bilkent', 'fcose', 'cola'];
            const availableLayouts = [];
            
            layoutsToTest.forEach(layoutName => {
                try {
                    const layout = testCy.layout({ name: layoutName });
                    availableLayouts.push(layoutName);
                    console.log(`✓ Layout '${layoutName}' is available`);
                } catch(e) {
                    console.log(`✗ Layout '${layoutName}' is NOT available:`, e.message);
                }
            });
            
            testCy.destroy();
            console.log('Available layouts:', availableLayouts);
            
            // Initialize the application
            new KnowledgeGraphBuilder();
            
        } catch(e) {
            console.warn('Error testing layout availability:', e);
            // Fallback: initialize anyway
            new KnowledgeGraphBuilder();
        }
        
    }, 200); // Give extensions time to register
});
