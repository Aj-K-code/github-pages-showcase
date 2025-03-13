/**
 * Advanced Data Visualizations for Healthcare Analytics Dashboard
 * Provides interactive and dynamic visualizations for healthcare data
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced visualizations
    initAdvancedVisualizations();
});

/**
 * Initialize advanced visualizations
 */
function initAdvancedVisualizations() {
    // Add visualization containers to dashboard
    addVisualizationContainers();
    
    // Initialize visualizations with sample data
    setTimeout(() => {
        initializeHeatMap();
        initializeNetworkGraph();
        initializeBubbleChart();
        initializeTreemap();
    }, 500);
}

/**
 * Add visualization containers to the dashboard
 */
function addVisualizationContainers() {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    
    if (dashboardGrid) {
        // Add heatmap card
        const heatmapCard = createVisualizationCard(
            'Regional Heatmap Analysis', 
            'heatmap-container',
            'Visualize regional healthcare metrics intensity'
        );
        dashboardGrid.appendChild(heatmapCard);
        
        // Add network graph card
        const networkCard = createVisualizationCard(
            'Provider Relationship Network', 
            'network-container',
            'Explore relationships between healthcare providers'
        );
        dashboardGrid.appendChild(networkCard);
        
        // Add bubble chart card (wide)
        const bubbleCard = createVisualizationCard(
            'Multi-dimensional Cost-Quality Analysis', 
            'bubble-container',
            'Compare providers across multiple dimensions',
            true
        );
        dashboardGrid.appendChild(bubbleCard);
        
        // Add treemap card
        const treemapCard = createVisualizationCard(
            'Procedure Cost Breakdown', 
            'treemap-container',
            'Hierarchical view of procedure costs by category'
        );
        dashboardGrid.appendChild(treemapCard);
    }
}

/**
 * Create a visualization card
 * @param {string} title - Card title
 * @param {string} containerId - ID for the visualization container
 * @param {string} description - Visualization description
 * @param {boolean} isWide - Whether the card should span full width
 * @return {HTMLElement} The created card element
 */
function createVisualizationCard(title, containerId, description, isWide = false) {
    const card = document.createElement('div');
    card.className = `dashboard-card${isWide ? ' wide' : ''}`;
    card.dataset.type = 'visualization';
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${title}</h3>
            <div class="card-actions">
                <button class="btn-icon" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" title="Refresh">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button class="btn-icon" title="More options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        </div>
        <div class="card-content">
            <div class="visualization-description">${description}</div>
            <div id="${containerId}" class="visualization-container"></div>
        </div>
    `;
    
    return card;
}

/**
 * Initialize regional heatmap visualization
 */
function initializeHeatMap() {
    const container = document.getElementById('heatmap-container');
    
    if (!container) return;
    
    // Create SVG element
    const width = container.clientWidth;
    const height = 300;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create US map outline
    const projection = d3.geoAlbersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);
    
    const path = d3.geoPath()
        .projection(projection);
    
    // Generate random data for states
    const stateData = {};
    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];
    
    states.forEach(state => {
        stateData[state] = Math.random();
    });
    
    // Create color scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1]);
    
    // Load US states TopoJSON
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
        .then(us => {
            // Draw states
            svg.append('g')
                .selectAll('path')
                .data(topojson.feature(us, us.objects.states).features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', d => {
                    const stateId = d.properties.name.substring(0, 2);
                    return colorScale(stateData[stateId] || 0);
                })
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .attr('stroke-width', 2)
                        .attr('stroke', '#333');
                    
                    // Show tooltip
                    const stateId = d.properties.name.substring(0, 2);
                    const value = stateData[stateId] || 0;
                    
                    showTooltip(
                        event.pageX,
                        event.pageY,
                        `<strong>${d.properties.name}</strong><br>Value: ${(value * 100).toFixed(1)}%`
                    );
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .attr('stroke-width', 0.5)
                        .attr('stroke', '#fff');
                    
                    // Hide tooltip
                    hideTooltip();
                });
            
            // Add legend
            const legendWidth = 200;
            const legendHeight = 20;
            
            const legendX = width - legendWidth - 20;
            const legendY = height - 40;
            
            const legend = svg.append('g')
                .attr('transform', `translate(${legendX}, ${legendY})`);
            
            // Create gradient
            const defs = svg.append('defs');
            
            const gradient = defs.append('linearGradient')
                .attr('id', 'heatmap-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%');
            
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', colorScale(0));
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(1));
            
            // Draw gradient rectangle
            legend.append('rect')
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .style('fill', 'url(#heatmap-gradient)');
            
            // Add labels
            legend.append('text')
                .attr('x', 0)
                .attr('y', legendHeight + 15)
                .text('Low')
                .attr('font-size', '12px')
                .attr('fill', '#666');
            
            legend.append('text')
                .attr('x', legendWidth)
                .attr('y', legendHeight + 15)
                .attr('text-anchor', 'end')
                .text('High')
                .attr('font-size', '12px')
                .attr('fill', '#666');
            
            // Add title
            legend.append('text')
                .attr('x', legendWidth / 2)
                .attr('y', -5)
                .attr('text-anchor', 'middle')
                .text('Healthcare Cost Intensity')
                .attr('font-size', '12px')
                .attr('fill', '#666');
        })
        .catch(error => {
            console.error('Error loading US map data:', error);
            container.innerHTML = '<div class="error-message">Error loading map data</div>';
        });
}

/**
 * Initialize provider relationship network graph
 */
function initializeNetworkGraph() {
    const container = document.getElementById('network-container');
    
    if (!container) return;
    
    // Create SVG element
    const width = container.clientWidth;
    const height = 300;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Generate sample network data
    const nodes = [];
    const links = [];
    
    // Create nodes
    for (let i = 0; i < 20; i++) {
        const nodeType = i < 5 ? 'hospital' : (i < 12 ? 'clinic' : 'specialist');
        
        nodes.push({
            id: i,
            name: `Provider ${i + 1}`,
            type: nodeType,
            value: Math.random() * 10
        });
    }
    
    // Create links
    for (let i = 0; i < 30; i++) {
        const source = Math.floor(Math.random() * nodes.length);
        let target = Math.floor(Math.random() * nodes.length);
        
        // Ensure no self-links
        while (source === target) {
            target = Math.floor(Math.random() * nodes.length);
        }
        
        links.push({
            source,
            target,
            value: Math.random()
        });
    }
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(70))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => Math.sqrt(d.value) * 4 + 5));
    
    // Create color scale for node types
    const colorScale = d3.scaleOrdinal()
        .domain(['hospital', 'clinic', 'specialist'])
        .range(['#4361ee', '#4cc9f0', '#f72585']);
    
    // Draw links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', '#ddd')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => Math.sqrt(d.value) * 2);
    
    // Draw nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', d => Math.sqrt(d.value) * 4 + 5)
        .attr('fill', d => colorScale(d.type))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('stroke', '#333')
                .attr('stroke-width', 2);
            
            // Show tooltip
            showTooltip(
                event.pageX,
                event.pageY,
                `<strong>${d.name}</strong><br>Type: ${d.type}<br>Value: ${d.value.toFixed(1)}`
            );
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5);
            
            // Hide tooltip
            hideTooltip();
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(20, 20)`);
    
    const types = ['hospital', 'clinic', 'specialist'];
    
    types.forEach((type, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('circle')
            .attr('r', 6)
            .attr('fill', colorScale(type));
        
        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .text(type.charAt(0).toUpperCase() + type.slice(1))
            .attr('font-size', '12px')
            .attr('fill', '#666');
    });
    
    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
    
    // Drag functions
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
    
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

/**
 * Initialize multi-dimensional bubble chart
 */
function initializeBubbleChart() {
    const container = document.getElementById('bubble-container');
    
    if (!container) return;
    
    // Create SVG element
    const width = container.clientWidth;
    const height = 400;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Generate sample data
    const data = [];
    
    for (let i = 0; i < 30; i++) {
        data.push({
            id: i,
            name: `Provider ${i + 1}`,
            x: Math.random() * 100, // Cost (x-axis)
            y: Math.random() * 100, // Quality (y-axis)
            size: Math.random() * 1000 + 100, // Volume
            category: ['Hospital', 'Clinic', 'Specialist'][Math.floor(Math.random() * 3)]
        });
    }
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([50, width - 50]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - 50, 50]);
    
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.size)])
        .range([4, 30]);
    
    const colorScale = d3.scaleOrdinal()
        .domain(['Hospital', 'Clinic', 'Specialist'])
        .range(['#4361ee', '#4cc9f0', '#f72585']);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(xAxis);
    
    svg.append('g')
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);
    
    // Add axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .text('Cost (Lower is Better)')
        .attr('font-size', '12px')
        .attr('fill', '#666');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .text('Quality (Higher is Better)')
        .attr('font-size', '12px')
        .attr('fill', '#666');
    
    // Add quadrant lines
    svg.append('line')
        .attr('x1', xScale(50))
        .attr('y1', yScale(0))
        .attr('x2', xScale(50))
        .attr('y2', yScale(100))
        .attr('stroke', '#ddd')
        .attr('stroke-dasharray', '4');
    
    svg.append('line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(50))
        .attr('x2', xScale(100))
        .attr('y2', yScale(50))
        .attr('stroke', '#ddd')
        .attr('stroke-dasharray', '4');
    
    // Add quadrant labels
    const quadrants = [
        { x: 25, y: 75, label: 'High Value' },
        { x: 75, y: 75, label: 'High Quality, High Cost' },
        { x: 25, y: 25, label: 'Low Quality, Low Cost' },
        { x: 75, y: 25, label: 'Low Value' }
    ];
    
    quadrants.forEach(q => {
        svg.append('text')
            .attr('x', xScale(q.x))
            .attr('y', yScale(q.y))
            .attr('text-anchor', 'middle')
            .text(q.label)
            .attr('font-size', '10px')
            .attr('fill', '#999')
            .attr('opacity', 0.7);
    });
    
    // Draw bubbles
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => sizeScale(d.size))
        .attr('fill', d => colorScale(d.category))
        .attr('fill-opacity', 0.7)
        .attr('stroke', d => d3.color(colorScale(d.category)).darker())
        .attr('stroke-width', 1)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('stroke-width', 2)
                .attr('fill-opacity', 0.9);
            
            // Show tooltip
            showTooltip(
                event.pageX,
                event.pageY,
                `<strong>${d.name}</strong><br>
                Category: ${d.category}<br>
                Cost: ${d.x.toFixed(1)}<br>
                Quality: ${d.y.toFixed(1)}<br>
                Volume: ${d.size.toFixed(0)}`
            );
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('stroke-width', 1)
                .attr('fill-opacity', 0.7);
            
            // Hide tooltip
            hideTooltip();
        });
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 120}, 20)`);
    
    const categories = ['Hospital', 'Clinic', 'Specialist'];
    
    categories.forEach((category, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('circle')
            .attr('r', 6)
            .attr('fill', colorScale(category))
            .attr('fill-opacity', 0.7)
            .attr('stroke', d3.color(colorScale(category)).darker())
            .attr('stroke-width', 1);
        
        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .text(category)
            .attr('font-size', '12px')
            .attr('fill', '#666');
    });
    
    // Add size legend
    const sizeLegend = svg.append('g')
        .attr('transform', `translate(${width - 120}, 100)`);
    
    sizeLegend.append('text')
        .attr('x', 0)
        .attr('y', -10)
        .text('Volume')
        .attr('font-size', '12px')
        .attr('fill', '#666');
    
    const sizes = [100, 500, 1000];
    
    sizes.forEach((size, i) => {
        const y = i * 25 + 10;
        
        sizeLegend.append('circle')
            .attr('cx', 6)
            .attr('cy', y)
            .attr('r', sizeScale(size))
            .attr('fill', '#999')
            .attr('fill-opacity', 0.5)
            .attr('stroke', '#666')
            .attr('stroke-width', 1);
        
        sizeLegend.append('text')
            .attr('x', 25)
            .attr('y', y + 4)
            .text(size)
            .attr('font-size', '12px')
            .attr('fill', '#666');
    });
}

/**
 * Initialize procedure cost treemap
 */
function initializeTreemap() {
    const container = document.getElementById('treemap-container');
    
    if (!container) return;
    
    // Create SVG element
    const width = container.clientWidth;
    const height = 300;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Generate hierarchical data
    const data = {
        name: 'Procedures',
        children: [
            {
                name: 'Surgical',
                children: [
                    { name: 'Cardiac', value: 5000 },
                    { name: 'Orthopedic', value: 3500 },
                    { name: 'Neurological', value: 4200 },
                    { name: 'General', value: 2800 }
                ]
            },
            {
                name: 'Diagnostic',
                children: [
                    { name: 'Imaging', value: 2200 },
                    { name: 'Laboratory', value: 1800 },
                    { name: 'Pathology', value: 1500 }
                ]
            },
            {
                name: 'Therapeutic',
                children: [
                    { name: 'Rehabilitation', value: 1200 },
                    { name: 'Respiratory', value: 900 },
                    { name: 'Oncology', value: 3000 }
                ]
            }
        ]
    };
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
        .domain(['Surgical', 'Diagnostic', 'Therapeutic'])
        .range(['#4361ee', '#4cc9f0', '#f72585']);
    
    // Create treemap layout
    const treemap = d3.treemap()
        .size([width, height])
        .padding(2)
        .round(true);
    
    // Create hierarchy
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    
    // Generate treemap layout
    treemap(root);
    
    // Draw cells
    const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);
    
    // Add rectangles
    cell.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => {
            // Get parent category
            const category = d.parent.data.name;
            return colorScale(category);
        })
        .attr('fill-opacity', 0.8)
        .attr('stroke', '#fff')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('fill-opacity', 1)
                .attr('stroke', '#333');
            
            // Show tooltip
            const category = d.parent.data.name;
            
            showTooltip(
                event.pageX,
                event.pageY,
                `<strong>${d.data.name}</strong><br>
                Category: ${category}<br>
                Cost: $${d.data.value.toLocaleString()}`
            );
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('fill-opacity', 0.8)
                .attr('stroke', '#fff');
            
            // Hide tooltip
            hideTooltip();
        });
    
    // Add text labels
    cell.append('text')
        .attr('x', 5)
        .attr('y', 15)
        .text(d => d.data.name)
        .attr('font-size', '12px')
        .attr('fill', '#fff')
        .attr('font-weight', 'bold');
    
    // Add value labels
    cell.append('text')
        .attr('x', 5)
        .attr('y', 30)
        .text(d => `$${d.data.value.toLocaleString()}`)
        .attr('font-size', '10px')
        .attr('fill', '#fff')
        .attr('fill-opacity', 0.9);
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(20, ${height - 80})`);
    
    const categories = ['Surgical', 'Diagnostic', 'Therapeutic'];
    
    categories.forEach((category, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', colorScale(category))
            .attr('fill-opacity', 0.8);
        
        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .text(category)
            .attr('font-size', '12px')
            .attr('fill', '#666');
    });
}

/**
 * Show tooltip at specified position
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} html - Tooltip content
 */
function showTooltip(x, y, html) {
    // Create tooltip if it doesn't exist
    let tooltip = document.getElementById('visualization-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'visualization-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Set content
    tooltip.innerHTML = html;
    
    // Position tooltip
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
    
    // Show tooltip
    tooltip.style.display = 'block';
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('visualization-tooltip');
    
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}
