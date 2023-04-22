let bingata, node_links;

function drawNetwork(nodes, links, patterns) {
  const svgWidth = 800;
  const svgHeight = 500;

  // 力学的グラフを作成する
  var simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink().id(d => d.id).links(links))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
    .force('limit', d3.forceLimit()
        .x0(20)
        .x1(svgWidth - 20)
        .y0(20)
        .y1(svgHeight - 20)
    );

  // ノードをドラッグできるようにする関数を定義する
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  // SVG要素を作成する
  var svg = d3.select('#myGraph')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#555555');

  // リンクを描画するための線を作成する
  var link = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    // linkの色分けする際に使用する
    .attr('stroke', l => `rgb(${l.color[0]}, ${l.color[1]}, ${l.color[2]})`)
    // .attr('stroke', 'white')
    .attr('stroke-opacity', '20%');

  const nodeSize = 20;
  // ノードを描画するためのグループを作成する
  var node = svg.append('g')
    .selectAll('image')
    .data(nodes)
    .enter()
    .append('image')
    .attr('xlink:href', function (d, i) {
      return `./assets/data/img/${d.image}`;
    })
    .attr('width', nodeSize)
    .attr('height', nodeSize)
    .call(drag(simulation)); // ノードをドラッグできるようにする

  // シミュレーションのフレームごとに呼び出される関数を定義する
  simulation.on('tick', function () {
    // ノードの座標を更新する
    node.attr('x', function (d) { return d.x - nodeSize / 2; })
      .attr('y', function (d) { return d.y - nodeSize / 2; });
    // リンクの座標を更新する
    link.attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });
  });
}

/**
 * 柄の情報からチェックボックスのリストを生成する
 */
function patterns2checkboxList(patterns, change = () => {}) {
  const checkboxList = patterns.map(pattern => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `link-checkbox-${pattern.id}`;
    checkbox.classList.add(`link-checkbox`);
    checkbox.value = pattern.id;
    checkbox.setAttribute('checked', true);
    checkbox.addEventListener('change', change);

    const label = document.createElement('label');
    label.setAttribute('for', `link-checkbox-${pattern.id}`);
    label.innerText = pattern.name;

    const li = document.createElement('li');
    li.classList.add('link-check-list-item');

    li.appendChild(checkbox);
    li.appendChild(label);
    return li;
  })

  const ul = document.createElement('ul');
  ul.id = 'link-check-list';
  checkboxList.forEach(checkboxLi => {
    ul.appendChild(checkboxLi);
  });

  return ul;
}

function remakeNetwork() {
  d3.select('svg').remove();
    const checkboxes = Array.from(document.getElementsByClassName('link-checkbox'));
    const checkedIds = checkboxes
      .filter(checkbox => checkbox.checked)
      .map(checkbox => Number(checkbox.value));
    const filteredLinks = node_links.links
      .filter(l => checkedIds.find(checkedId => checkedId === l.pattern_id));
    node_links.nodes.forEach(node => {
      node.x = 0.0;
      node.y = 0.0;
      node.vx = 0.0;
      node.vy = 0.0;
    });
    drawNetwork(node_links.nodes, filteredLinks, bingata.patterns);
}

function connectAll() {
  const checkboxes = document.getElementsByClassName('link-checkbox');
  for (let checkbox of checkboxes) {
    checkbox.setAttribute('checked', true);
  }
  remakeNetwork();
}

function disConnectAll() {
  const checkboxes = document.getElementsByClassName('link-checkbox');
  for (let checkbox of checkboxes) {
    checkbox.removeAttribute('checked');
  }
  remakeNetwork();
}

Promise.all([
  d3.json('./assets/data/bg.json'),
  d3.json('./assets/data/node_links.json')
]).then(data => {
  bingata = data[0];
  node_links = data[1];

  const checkboxList = patterns2checkboxList(bingata.patterns, remakeNetwork);
  document.body.appendChild(checkboxList);
  
  drawNetwork(node_links.nodes, node_links.links, bingata.patterns);
});
