D3.jsのForce Graphは力学モデルに基づいてノードを配置するグラフです。以下は、D3.jsでForce Graphを描画するための基本的な手順です。

1. 必要なJavaScriptライブラリをインポートします。

```html

<script src="https://d3js.org/d3.v7.min.js"></script>

```

2描画するコンテナを作成します。
```html

<div id="container"></div>
```
3. 描画するためのデータを用意します。以下は、3つのノードと2つのエッジを持つシンプルなデータセットです。
```javascript
const nodes = [
  {id: 0, label: "Node 0"},
  {id: 1, label: "Node 1"},
  {id: 2, label: "Node 2"}
];

const edges = [
  {source: 0, target: 1},
  {source: 1, target: 2}
];
```

4. Force Graphを定義します。
```javascript

const width = 500;
const height = 500;

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(edges))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
```

5. SVG要素を作成し、ノードとエッジを描画します。
```javascript

const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const link = svg.selectAll("line")
    .data(edges)
    .enter().append("line");

const node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 5)
    .call(drag(simulation));

simulation.on("tick", () => {
  link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  
  node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
});

function drag(simulation) {
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

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
```# d3-bingata-graph
