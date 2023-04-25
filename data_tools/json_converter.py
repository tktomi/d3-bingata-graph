"""
出力されるJSON
{
    "bingata": [
        {
            "id": "1",
            "title": "松に梅",
            "patterns": [52, 58]
        },
        {
            "id": "2",
            "title": "山に牡丹大模様",
            "patterns": [5, 33, 35, 37, 40, 64]
        }
        // ...
    ],
    "patterns": [
        {
            "id": 1,
            "name": "珊瑚礁"
        },
        {
            "id": 2,
            "name": "水車"
        }
        // ...
    ]
}
"""

import csv
import json
import re
import itertools


def dict_reader2bingata_list(reader):
    """
    DictReaderを紅型の配列に変換する
    """
    # CSVのヘッダーから'模様${連続した数字}' にマッチする key 一覧を取得する
    patterns_pattern = re.compile('模様\d+')
    pattern_keys = list(filter(lambda k: re.match(patterns_pattern, k), reader.fieldnames))
    bingata_list = map(lambda row: row2bingata_dict(row, pattern_keys), reader)
    return list(bingata_list)


def row2bingata_dict(row, pattern_keys):
    """
    行データを紅型データのdictに変換する
    """
    # dict から pattern_keys に含まれる key の value を取得する
    patterns = filter(lambda i: i[0] in pattern_keys, row.items())
    patterns = map(lambda m: m[1], patterns)
    # 空文字の値を削除する
    patterns = filter(lambda m: len(m) != 0, patterns)
    patterns = list(patterns)
    
    return {
        'id': row['番号'],
        'title': row['タイトル'],
        'image': row['ファイル名'],
        'patterns': patterns,
    }


def bingata_list2patterns(bingata_list):
    """
    紅型の配列を模様の配列に変換する
    """
    patterns = itertools.chain.from_iterable(map(lambda bingata: bingata['patterns'], bingata_list))
    patterns = set(patterns)
    patterns = map(lambda item: { 'id': item[0] + 1, 'name': item[1] }, enumerate(patterns))
    return list(patterns)


def replace_bingata_pattern_id(bingata, patterns):
    """
    紅型の模様を模様のIDに置き換える
    """
    bingata_patterns = filter(lambda pattern: pattern['name'] in bingata['patterns'], patterns)
    bingata_patterns = map(lambda bingata_pattern: bingata_pattern['id'], bingata_patterns)
    bingata['patterns'] = list(bingata_patterns)
    return bingata


def main():
    with open('bg.csv', 'r') as csv_file, open('bg.json', 'w') as json_file, open('patterns.json', 'w') as patterns_json_file:
        reader = csv.DictReader(csv_file)
        bingata_list = dict_reader2bingata_list(reader)
        patterns = bingata_list2patterns(bingata_list)
        bingata_list = map(lambda bingata: replace_bingata_pattern_id(bingata, patterns), bingata_list)
        # print(list(bingata_list))
        bingata_list = filter(lambda b: len(b['title']) > 0,  bingata_list)
        bingata_list = list(bingata_list)
        
        json.dump({
            'bingata': bingata_list,
            'patterns': patterns,
        }, json_file, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    main()
