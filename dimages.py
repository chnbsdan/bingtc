import json
import random
import shutil
import requests
import re
from PIL import Image
from io import BytesIO
import os
from datetime import datetime, timedelta

def validate_title(raw):
    new_title = re.sub("UHD.jpg", "1920x1080.jpg", raw)
    return new_title

def downloads(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    }
    json_data = requests.get(url=url, headers=headers).json()
    pic_url = r'https://cn.bing.com{0}'.format(
        json_data['images'][0]['url'].split("&")[0])
    start_date = json_data['images'][0]['startdate']
    
    # 确保所有需要的目录存在
    os.makedirs('./webp', exist_ok=True)
    os.makedirs('./json', exist_ok=True)
    os.makedirs('./1080pimages', exist_ok=True)
    os.makedirs('./images', exist_ok=True)
    
    # 保存原始 JSON
    open(f'./json/{start_date}.json', 'wb').write(requests.get(url=url, headers=headers).content)
    
    # 下载 1080p 图片并转换为 WebP
    pic_1080p = requests.get(validate_title(pic_url), stream=True)
    if pic_1080p.status_code == 200:
        png_1080p_path = f'./1080pimages/{start_date}.png'
        open(png_1080p_path, 'wb').write(pic_1080p.content)
        shutil.copyfile(png_1080p_path, f'./1080pimages/latest.png')
        print(f'Create {start_date} 1080P_PNG Success!')
        
        try:
            img = Image.open(png_1080p_path)
            if img.mode in ('RGBA', 'LA'):
                img = img.convert('RGB')
            
            # 生成 WebP
            webp_path = f'./webp/{start_date}.webp'
            img.save(webp_path, 'WEBP', quality=85, method=6)
            shutil.copyfile(webp_path, f'./webp/latest.webp')
            print(f'Create {start_date} WebP Success!')
            
            # 生成 daily.jpeg
            img.save('./webp/daily.jpeg', 'JPEG', quality=95, optimize=True)
            print(f'Create webp/daily.jpeg Success!')
            
            # 生成 original.jpeg
            img.save('./webp/original.jpeg', 'JPEG', quality=100)
            print(f'Create webp/original.jpeg Success!')
            
        except Exception as e:
            print(f'Create files Failed: {e}')
    else:
        print(f'Create {start_date} 1080P_PNG Failed!')
    
    # 生成 index.json
    generate_index_json()
    
    return

def generate_index_json():
    """扫描 webp 目录，生成包含 copyright 的 index.json"""
    webp_dir = './webp'
    json_dir = './json'
    if not os.path.exists(webp_dir):
        print('webp directory not found')
        return
    
    images = []
    for filename in os.listdir(webp_dir):
        if filename.endswith('.webp') and filename != 'latest.webp' and filename != 'daily.jpeg' and filename != 'original.jpeg':
            date_str = filename.replace('.webp', '')
            if len(date_str) == 8 and date_str.isdigit():
                formatted_date = date_str[:4] + '-' + date_str[4:6] + '-' + date_str[6:8]
                copyright_text = ''
                image_url = ''
                json_path = os.path.join(json_dir, f'{date_str}.json')
                if os.path.exists(json_path):
                    try:
                        with open(json_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            if data.get('images') and len(data['images']) > 0:
                                copyright_text = data['images'][0].get('copyright', '')
                                urlbase = data['images'][0].get('urlbase', '')
                                if urlbase:
                                    image_url = f'https://www.bing.com{urlbase}_UHD.jpg'
                    except Exception as e:
                        print(f'读取 {json_path} 失败: {e}')
                
                images.append({
                    'filename': filename,
                    'date': formatted_date,
                    'path': f'/webp/{filename}',
                    'copyright': copyright_text,
                    'url': image_url
                })
    
    images.sort(key=lambda x: x['date'], reverse=True)
    
    # 只保留最近90天
    ninety_days_ago = (datetime.now() - timedelta(days=90)).strftime('%Y%m%d')
    images = [img for img in images if img['date'].replace('-', '') >= ninety_days_ago]
    
    with open('./webp/index.json', 'w', encoding='utf-8') as f:
        json.dump({'images': images}, f, ensure_ascii=False, indent=2)
    
    print(f'Create webp/index.json success! {len(images)} images')
