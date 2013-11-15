var map = new Map();

map.showGrid(true);

var currentLayer = 'bottom';

var selectedTile = {
	bottom: { left: 22, right: 9  },
	middle: { left: 16, right: 21 },
	upper:  { left: 0, 	right: 1  },
	events: { left: 0, 	right: 1  },
	player: false
};

map.setSelected(selectedTile);

var selectColor = {
  left: 'red',
  right: 'green'
};