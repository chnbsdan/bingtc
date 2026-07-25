import tool

def create():
    imginfo = tool.get_date()
    
    # GALLERY.md - 覆盖写入
    with open('GALLERY.md', 'w+', encoding='utf-8') as fw:
        fw.write(imginfo[0] + '\n\n')
        fw.write('|      |      |      |\n')
        fw.write('| :----: | :----: | :----: |\n')
        i = 0
        list_data = tool.get_list()
        # 只取前 30 条
        for dd in list_data[:30]:
            i = i + 1
            fw.write('|')
            fw.write(dd)
            if (i % 3 == 0):
                fw.write("|\n")
        if (len(list_data[:30]) % 3 != 0):
            fw.write('|')
        print(f'Create GALLERY.md Success!')

    # bing-url.md - 覆盖写入，只保留最新一条
    with open('bing-url.md', 'w+', encoding='utf-8') as fi:
        fi.write(imginfo[1] + '\n\n')
        print(f'Create bing-url.md Success!')

    # wallpaper.md - 覆盖写入
    with open('wallpaper.md', 'w+', encoding='utf-8') as fw:
        fw.write("---" + '\n')
        fw.write("title: wallpaper" + '\n')
        fw.write("date: 2022-01-01 19:24:56" + '\n')
        fw.write("type: 'gallery'" + '\n')
        fw.write("---" + '\n\n')
        with open('GALLERY.md', 'r', encoding='utf-8') as fi:
            content = fi.read()
        fw.write(content)
        print(f'Create wallpaper.md Success!')
