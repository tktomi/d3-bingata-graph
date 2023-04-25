
# Installation & usage

## convert JSON file

1. インポートした"bg.csv"を下記のコマンドでjsonにする

```sh
cd data_tools
python3 json_converter.py
python3 node_links_converter.py
cp bg.json ../docs/assets/data/bg.json
cp node_links.json ../docs/assets/data/node_links.json
cd ..
```
