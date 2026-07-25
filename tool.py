import requests
import re
import os

def validate_title(raw):
    new_title = re.sub("UHD.jpg", "1920x1080.jpg", raw)
    return new_title

def get_date():
    url = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&nc=1612409408851&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160'

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    }
    json_data = requests.get(url=url, headers=headers).json()

    images_url = "https://cn.bing.com" + json_data['images'][0]['url']
    copyright = json_data['images'][0]['copyright']
    title = json_data['images'][0]['title']
    startdate = json_data['images'][0]['startdate']

    # ===== 修复：限制每个文件只保留最近 30 条 =====
    def update_file(filename, new_line):
        lines = []
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        # 插入新行到开头
        lines.insert(0, new_line + '\n')
        # 只保留最近 30 条
        lines = lines[:30]
        with open(filename, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f'Update {filename} Success! (共 {len(lines)} 条)')

    update_file('1080purl.txt', validate_title(images_url.split("&")[0]))
    update_file('url.txt', images_url.split("&")[0])
    update_file('startdate.txt', startdate)
    update_file('copyright.txt', copyright)

    topimg = '![{}]({}&w=1000) Today:[{}]({})'.format(title, images_url.split("&")[0], copyright, images_url.split("&")[0])
    img_info = '{} | [{}]({})'.format(startdate, copyright, images_url.split("&")[0])
    return topimg, img_info

def get_list():
    url = []
    copyright = []
    startdate = []
    
    try:
        with open('url.txt', 'r', encoding='utf-8') as fu:
            for line in fu:
                if line != '\n':
                    url.append(line[:-1])
    except FileNotFoundError:
        pass

    try:
        with open('copyright.txt', 'r', encoding='utf-8') as fc:
            for line in fc:
                if line != '\n':
                    copyright.append(line[:-1])
    except FileNotFoundError:
        pass

    try:
        with open('startdate.txt', 'r', encoding='utf-8') as fd:
            for line in fd:
                if line != '\n':
                    startdate.append(line[:-1])
    except FileNotFoundError:
        pass

    list_img = ['![' + a + ']' + '(' + b + '&pid=hp&w=384&h=216&rs=1&c=4' + ')' + '`' + c + '`' + '[' + a + ']' + '(' + b + ')' for a, b, c in zip(copyright, url, startdate)]
    return list_img
