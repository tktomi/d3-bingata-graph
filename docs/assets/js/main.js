// グラフのデータを定義
// var nodes = [
//   { id: 0, image: "./img/bg1.png" },
//   { id: 1, image: "./img/bg2.png" },
//   { id: 2, image: "./img/bg3.png" },
// ];
// var links = [
//   { source: 0, target: 1 },
//   { source: 1, target: 2 },
//   { source: 2, target: 0 },
// ];

// drawNetwork(nodes, links);

function drawNetwork(nodes, links) {
  const svgWidth = 1000;
  const svgHeight = 800;
  const linkIds = links.map(link => [link.source, link.target]).flat();
  const nodeIds = nodes.map(node => node.id);
  const sub = nodeIds.filter(i => linkIds.indexOf(i) == -1)
  console.log(sub);


  console.log([...new Set(linkIds)].sort());
  console.log([...new Set(nodeIds)].sort());


  // 力学的グラフを作成します
  var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink().id(d => d.id).links(links))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2));

  // ノードをドラッグできるようにする関数を定義します
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
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  // SVG要素を作成します
  var svg = d3.select("#myGraph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style("background-color", "#555555");
  // var a = d3.select("#myGraph");
  // console.log(a);
  // var b = a.append("svg");
  // console.log(b);
  // var c = b.attr("width", 500);
  // console.log(c);
  // var svg = c.attr("height", 500);
  // console.log(svg);

  // リンクを描画するための線を作成します
  var link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "white")
    .attr("stroke-opacity", "20%");

  const nodeSize = 20;
  // ノードを描画するためのグループを作成します
  var node = svg.append("g")
    .selectAll("image")
    .data(nodes)
    .enter()
    .append("image")
    .attr("xlink:href", function (d, i) {
      return `./assets/data/img/${d.image}`;
    })
    .attr("width", nodeSize)
    .attr("height", nodeSize)
    .call(drag(simulation)); // ノードをドラッグできるようにします



  // シミュレーションのフレームごとに呼び出される関数を定義します
  simulation.on("tick", function () {
    // ノードの座標を更新します
    node.attr("x", function (d) { return d.x - nodeSize / 2; })
      .attr("y", function (d) { return d.y - nodeSize / 2; });
    // リンクの座標を更新します
    link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });
  });
}

d3.json("./assets/data/node_links.json").then(function (data) {
  drawNetwork(data.nodes, data.links);
});
