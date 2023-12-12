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

  }

  setPosition(x,y) {
    this.element.style.left = x + 'px';
    this.element.style.top  = y + 'px';  
    this.x = x;
    this.y = y;
  }
}

const visualizer = document.getElementById('visualizer');
const colors = [
  '#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF',
  '#FF33FF', '#FF3366', '#3399FF', '#FF6600', '#00FF66',
  '#CC00FF', '#FF00CC', '#FF9900', '#00FF99', '#6600FF',
  '#00FFFF', '#FFCC00', '#9900FF', '#33FFCC', '#FF3300'
];

document.getElementById('clearAll').addEventListener('click', () => {
  // Remove all points and clusters from the visualizer
  points.forEach(point => visualizer.removeChild(point.element));
  clusters.forEach(cluster => visualizer.removeChild(cluster.element));

  // Clear the points and clusters arrays
  points.length = 0;
  clusters.length = 0;
});


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

var points = [];
var clusters = [];
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
    pointData.setColor("#00000"); 
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


function classify () {
  for (let point of points){
    
    var dist = 9999999999;
    var color = '#000000';
    for (let cluster of clusters) {
      var current_dist = ((cluster.x-point.x)**2 + (cluster.y-point.y)**2) ** 0.5;
      if(current_dist<dist){
        dist = current_dist;
        color = cluster.color
      }
    }
    point.setColor(color);
}
}

function updateClusters() {

  for (let cluster of clusters) {
    let totalX = 0;
    let totalY = 0;
    let count = 0;

    for (let point of points) {
      if (point.color === cluster.color) { // Check if the point belongs to the cluster
        totalX += point.x;
        totalY += point.y;
        count++;
      }
    }


    if (count > 0) {

      const avgX = totalX / count;
      const avgY = totalY / count;
      console.log("avgx: ", avgX);
      console.log("avgy: ", avgY);
      cluster.setPosition(avgX,avgY);
    }
  }
}

document.getElementById('classifyPoints').addEventListener('click', () => {

  classify()

});


document.getElementById('setNewClusters').addEventListener('click', () => {

  
  updateClusters()

});
