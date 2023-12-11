class PointData {
  constructor(x, y, element, isCluster = false, color = '') {
    this.x = x;
    this.y = y;
    this.element = element;
    this.isCluster = isCluster;
    this.color = color;
  }

  setColor(color) {
    this.element.style.backgroundColor = color;
    this.color = color;
    // You can add more styling changes or logic as needed
  }
}

const visualizer = document.getElementById('visualizer');
const colors = [
  '#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF',
  '#FF33FF', '#FF3366', '#3399FF', '#FF6600', '#00FF66',
  '#CC00FF', '#FF00CC', '#FF9900', '#00FF99', '#6600FF',
  '#00FFFF', '#FFCC00', '#9900FF', '#33FFCC', '#FF3300'
];

for (let i = 1; i < 50; i++) {
  const line = document.createElement('div');
  line.classList.add('horizontal-line');
  line.style.top = `${(i / 50) * 100}%`;
  visualizer.appendChild(line);
}

// Add vertical lines
for (let i = 1; i < 50; i++) {
  const line = document.createElement('div');
  line.classList.add('vertical-line');
  line.style.left = `${(i / 50) * 100}%`;
  visualizer.appendChild(line);
}

const points = [];
const clusters = [];
let isAddingPoints = false;
let isAddingClusters = false;

function addPoint(event, isCluster = false) {
  const rect = visualizer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const pointElement = document.createElement('div');
  pointElement.classList.add('point');
  pointElement.style.left = x + 'px';
  pointElement.style.top = y + 'px';
  
  if (isCluster) {
    pointElement.classList.add('cluster-point'); // Add a specific class for cluster points
  }
  
  visualizer.appendChild(pointElement);

  const color = isCluster ? getNextColor() : 'black'; // Get the next color for cluster points

  const pointData = new PointData(x, y, pointElement, isCluster, color);
  if (isCluster) {
    clusters.push(pointData);
    pointData.setColor(color); // Set color for cluster points
    console.log("added cluster")
  } else {
    points.push(pointData);
    console.log("added point")
  }
}


let colorIndex = 0; // Initialize color index for cycling through colors

function getNextColor() {
  const color = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length; // Cycle through colors
  return color;
}

// Event listener for adding points or clusters
visualizer.addEventListener('click', (event) => {
  if (isAddingPoints) {
    addPoint(event, false);
  } else if (isAddingClusters) {
    addPoint(event, true);
  }
});

// Toggle buttons functionality
document.getElementById('toggleAddPoint').addEventListener('click', () => {
  isAddingPoints = true;
  isAddingClusters = false;

  visualizer.style.cursor = 'crosshair';
  document.getElementById('toggleAddPoint').classList.add('active');
  document.getElementById('toggleAddCluster').classList.remove('active');
});

document.getElementById('toggleAddCluster').addEventListener('click', () => {
  isAddingClusters = true;
  isAddingPoints = false;

  visualizer.style.cursor = 'crosshair';
  document.getElementById('toggleAddCluster').classList.add('active');
  document.getElementById('toggleAddPoint').classList.remove('active');
});
