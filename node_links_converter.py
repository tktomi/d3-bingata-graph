"""
出力されるJSON
{
    "nodes": [
        {
            "id": "1",
            "name": "松に梅",
        },
        {
            "id": "2",
            "name": "山に牡丹大模様",
        }
        // ...
    ],
    "links": [
        {
            "id": 1,
            "source": 1,
            "target": 2
        },
        {
            "id": 1,
            "source": 3,
            "target": 4
        },
        // ...
    ]
}
"""

import json
import itertools


def pattern_and_bingata2links(pattern, bingata):
    """
    あるpatternを持っているという関係性の配列
    """
    has_pattern_bingata = filter(lambda b: pattern['id'] in b['patterns'], bingata)
    has_pattern_bingata_ids = list(map(lambda b: b['id'], has_pattern_bingata))
    links = itertools.combinations(has_pattern_bingata_ids, 2)
    links = map(lambda l: {
        'source': l[0],
        'target': l[1]
    }, links)
    links = list(links)
    return links


def main():
    with open('bg.json', 'r') as input_file, open('node_links.json', 'w') as output_file:
        input_json = json.load(input_file)
        output_json = {}
        output_json['nodes'] = map(lambda b: {
            'id': b['id'],
            'name': b['title']
        }, input_json['bingata'])
        output_json['nodes'] = list(output_json['nodes'])
        output_json['links'] = map(
            lambda pattern: pattern_and_bingata2links(pattern, input_json['bingata']),
            input_json['patterns']
        )
        output_json['links'] = itertools.chain.from_iterable(output_json['links'])
        output_json['links'] = list(output_json['links'])

        json.dump(output_json, output_file, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    main()
