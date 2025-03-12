document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Stat Counter Animation
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const prefix = stat.textContent.replace(/[0-9]/g, '');
        let count = 0;
        const duration = 2000; // ms
        const interval = 20; // ms
        const increment = target / (duration / interval);
        
        const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
                stat.textContent = prefix + target;
                clearInterval(counter);
            } else {
                stat.textContent = prefix + Math.floor(count);
            }
        }, interval);
    });

    // Cost-Quality Chart
    if (document.getElementById('costQualityChart')) {
        const ctx = document.getElementById('costQualityChart').getContext('2d');
        
        // Generate random data
        const generateRandomData = (count, min, max) => {
            return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1) + min));
        };
        
        const data = {
            datasets: [{
                label: 'Providers',
                data: Array.from({length: 50}, () => ({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    r: Math.random() * 15 + 5
                })),
                backgroundColor: function(context) {
                    const value = context.raw;
                    if (value.x < 50 && value.y >= 50) {
                        return 'rgba(76, 201, 240, 0.7)'; // High Value
                    } else if (value.x >= 50 && value.y >= 50) {
                        return 'rgba(247, 37, 133, 0.7)'; // High Cost, High Quality
                    } else if (value.x < 50 && value.y < 50) {
                        return 'rgba(249, 65, 68, 0.7)'; // Low Value
                    } else {
                        return 'rgba(248, 150, 30, 0.7)'; // High Cost, Low Quality
                    }
                },
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bubble',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Cost (Lower is Better)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                if (value === 0) return 'Low';
                                if (value === 50) return 'Medium';
                                if (value === 100) return 'High';
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Quality (Higher is Better)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                if (value === 0) return 'Low';
                                if (value === 50) return 'Medium';
                                if (value === 100) return 'High';
                                return '';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return [
                                    'Provider ID: ' + Math.floor(Math.random() * 10000),
                                    'Cost Index: ' + context.raw.x.toFixed(1),
                                    'Quality Score: ' + context.raw.y.toFixed(1),
                                    'Volume: ' + context.raw.r.toFixed(0) + ' procedures'
                                ];
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        };
        
        const costQualityChart = new Chart(ctx, config);
    }

    // Forecast Chart
    if (document.getElementById('forecastChart')) {
        const ctx = document.getElementById('forecastChart').getContext('2d');
        
        // Generate random data with upward trend
        const generateTrendData = (count, start, volatility, trend) => {
            let value = start;
            return Array.from({length: count}, (_, i) => {
                value += trend + (Math.random() - 0.5) * volatility;
                return value;
            });
        };
        
        // Historical data (past 12 months)
        const historicalMonths = 12;
        const historicalData = generateTrendData(historicalMonths, 50, 5, 1.2);
        
        // Forecast data (next 6 months)
        const forecastMonths = 6;
        const forecastData = generateTrendData(forecastMonths, historicalData[historicalData.length - 1], 8, 1.5);
        
        // Confidence intervals (upper and lower bounds)
        const upperBound = forecastData.map(value => value + Math.random() * 15 + 5);
        const lowerBound = forecastData.map(value => value - Math.random() * 15 - 5);
        
        // Labels
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        const labels = [];
        for (let i = 0; i < historicalMonths + forecastMonths; i++) {
            const monthIndex = (currentMonth - historicalMonths + i + 12) % 12;
            const year = new Date().getFullYear() + Math.floor((currentMonth - historicalMonths + i) / 12);
            labels.push(months[monthIndex] + ' ' + year);
        }
        
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Historical Cost Trend',
                    data: [...historicalData, ...Array(forecastMonths).fill(null)],
                    borderColor: 'rgba(67, 97, 238, 1)',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Forecast',
                    data: [...Array(historicalMonths).fill(null), ...forecastData],
                    borderColor: 'rgba(76, 201, 240, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Upper Bound',
                    data: [...Array(historicalMonths).fill(null), ...upperBound],
                    borderColor: 'rgba(76, 201, 240, 0.3)',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    borderWidth: 1,
                    fill: '+1',
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: 'Lower Bound',
                    data: [...Array(historicalMonths).fill(null), ...lowerBound],
                    borderColor: 'rgba(76, 201, 240, 0.3)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        };
        
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Average Cost ($)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            filter: function(item) {
                                // Hide upper and lower bound from legend
                                return !item.text.includes('Bound');
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                xMin: labels[historicalMonths - 1],
                                xMax: labels[historicalMonths - 1],
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: 'Forecast Start',
                                    position: 'start'
                                }
                            }
                        }
                    }
                }
            }
        };
        
        const forecastChart = new Chart(ctx, config);
    }

    // Simple US Map for Region Map
    if (document.getElementById('regionMap')) {
        const width = document.getElementById('regionMap').clientWidth;
        const height = 300;
        
        const svg = d3.select('#regionMap')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
            
        const g = svg.append('g');
        
        // Mock data for regions
        const regionData = {
            "Northeast": Math.random(),
            "Midwest": Math.random(),
            "South": Math.random(),
            "West": Math.random()
        };
        
        // Color scale
        const color = d3.scaleSequential()
            .domain([0, 1])
            .interpolator(d3.interpolateBlues);
            
        // Simple rectangles for regions
        const regions = [
            {name: "Northeast", x: width * 0.7, y: height * 0.2, width: width * 0.25, height: height * 0.3},
            {name: "Midwest", x: width * 0.4, y: height * 0.2, width: width * 0.25, height: height * 0.3},
            {name: "South", x: width * 0.4, y: height * 0.55, width: width * 0.3, height: height * 0.35},
            {name: "West", x: width * 0.1, y: height * 0.2, width: width * 0.25, height: height * 0.5}
        ];
        
        g.selectAll('rect')
            .data(regions)
            .enter()
            .append('rect')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', d => color(regionData[d.name]))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .attr('rx', 5)
            .attr('ry', 5);
            
        g.selectAll('text')
            .data(regions)
            .enter()
            .append('text')
            .attr('x', d => d.x + d.width / 2)
            .attr('y', d => d.y + d.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#fff')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => d.name);
    }
});
